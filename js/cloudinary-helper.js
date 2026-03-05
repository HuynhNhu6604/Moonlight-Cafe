export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không thể đọc nội dung ảnh'));
    img.src = dataUrl;
  });
}

async function optimizeImageFile(file) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  const type = String(file.type || '').toLowerCase();
  if (type === 'image/gif') return file;
  if (file.size < 350 * 1024) return file;

  const sourceDataUrl = await readFileAsDataUrl(file);
  const img = await loadImageFromDataUrl(sourceDataUrl);

  const maxDimension = 1600;
  const ratio = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const targetWidth = Math.max(1, Math.round(img.width * ratio));
  const targetHeight = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) return file;

  context.drawImage(img, 0, 0, targetWidth, targetHeight);

  const optimizedBlob = await canvasToBlob(canvas, 'image/jpeg', 0.82);
  if (!optimizedBlob) return file;
  if (optimizedBlob.size >= file.size * 0.95) return file;

  const optimizedName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
  return new File([optimizedBlob], optimizedName, { type: 'image/jpeg' });
}

async function fetchWithTimeout(url, options, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function getPublicCloudinaryConfig() {
  if (typeof window !== 'undefined' && window.CLOUDINARY_PUBLIC_CONFIG) {
    return window.CLOUDINARY_PUBLIC_CONFIG;
  }
  try {
    const mod = await import('./cloudinary-public-config.js');
    return mod.CLOUDINARY_PUBLIC_CONFIG || {};
  } catch (_) {
    return {};
  }
}

async function uploadViaUnsignedPreset(file, folder, cloudName, unsignedUploadPreset, options = {}) {
  const publicId = typeof options.publicId === 'string' ? options.publicId.trim() : '';
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', unsignedUploadPreset);
  if (folder) form.append('folder', folder);
  if (publicId) form.append('public_id', publicId);

  const response = await fetchWithTimeout(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form
  }, 25000);
  const result = await response.json();
  if (!response.ok || !result?.secure_url) {
    throw new Error(result?.error?.message || 'Upload thất bại (unsigned preset)');
  }
  return result.secure_url;
}

export async function uploadImageToCloudinary(file, folder = 'moonlight-cafe/general', options = {}) {
  if (!file) throw new Error('Chưa chọn file ảnh');
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn đúng định dạng ảnh');
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Ảnh vượt quá 8MB');
  }

  const optimizedFile = await optimizeImageFile(file);
  const fileData = await readFileAsDataUrl(optimizedFile);
  const publicId = typeof options.publicId === 'string' ? options.publicId.trim() : '';
  const payload = {
    file: fileData,
    folder
  };
  if (publicId) payload.publicId = publicId;

  const endpoints = ['/api/cloudinary/upload', '/.netlify/functions/cloudinary-upload'];
  let lastError = 'Upload thất bại';

  for (const endpoint of endpoints) {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 25000);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Upload thất bại');
      }
      if (!result?.secure_url) {
        throw new Error('Không nhận được URL ảnh từ Cloudinary');
      }
      return result.secure_url;
    } catch (error) {
      lastError = error.message || 'Upload thất bại';
    }
  }

  const publicCfg = await getPublicCloudinaryConfig();
  const cloudName = publicCfg.CLOUDINARY_CLOUD_NAME || '';
  const unsignedUploadPreset = publicCfg.CLOUDINARY_UNSIGNED_PRESET || '';

  if (cloudName && unsignedUploadPreset) {
    return uploadViaUnsignedPreset(optimizedFile, folder, cloudName, unsignedUploadPreset, { publicId });
  }

  throw new Error(`${lastError}. Nếu chạy bằng Live Server, hãy cấu hình CLOUDINARY_UNSIGNED_PRESET trong js/cloudinary-public-config.js`);
}