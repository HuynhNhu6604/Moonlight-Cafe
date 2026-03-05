function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'untitled';
}

function sanitizeId(value, fallbackPrefix = 'id') {
  const raw = String(value || '').trim();
  if (!raw) return `${fallbackPrefix}-${Date.now()}`;
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80);
  return cleaned || `${fallbackPrefix}-${Date.now()}`;
}

function buildDateBucket(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}/${month}`;
}

export function buildMenuImageTarget({ category, name, productId } = {}) {
  const safeCategory = slugify(category || 'general');
  const safeName = slugify(name || 'menu-item');
  const stableId = sanitizeId(productId, 'menu');
  return {
    folder: `moonlight-cafe/menu/${safeCategory}`,
    publicId: `${buildDateBucket()}/${safeName}-${stableId}`
  };
}

export function buildNewsImageTarget({ category, title, newsId } = {}) {
  const safeCategory = slugify(category || 'general');
  const safeTitle = slugify(title || 'news');
  const stableId = sanitizeId(newsId, 'news');
  return {
    folder: `moonlight-cafe/news/${safeCategory}`,
    publicId: `${buildDateBucket()}/${safeTitle}-${stableId}`
  };
}

export function buildAvatarImageTarget({ userId } = {}) {
  const safeUserId = sanitizeId(userId, 'user');
  return {
    folder: 'moonlight-cafe/avatars/users',
    publicId: `${buildDateBucket()}/avatar-${safeUserId}`
  };
}
