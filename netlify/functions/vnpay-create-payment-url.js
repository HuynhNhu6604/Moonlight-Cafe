const {
  VNP_TMN_CODE,
  VNP_HASH_SECRET,
  VNP_URL,
  sortObject,
  hmacSHA512,
  queryString,
  formatDateVN,
  corsHeaders
} = require('./_vnpay');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const amount = Number(body.amount || 0);
    const orderId = String(body.orderId || '').trim();
    const returnUrl = String(body.returnUrl || '').trim();

    if (!amount || !orderId || !returnUrl) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing amount/orderId/returnUrl' })
      };
    }

    const createDate = formatDateVN();
    const ipAddr = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '127.0.0.1';

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_Amount: amount,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: body.orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Locale: body.locale || 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: String(ipAddr).split(',')[0].trim(),
      vnp_CreateDate: createDate
    };

    if (body.bankCode) vnp_Params.vnp_BankCode = body.bankCode;

    vnp_Params = sortObject(vnp_Params);
    const signData = queryString(vnp_Params);
    const secureHash = hmacSHA512(VNP_HASH_SECRET, signData);
    vnp_Params.vnp_SecureHash = secureHash;

    const paymentUrl = `${VNP_URL}?${queryString(vnp_Params)}`;
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ paymentUrl }) };
  } catch (e) {
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: e.message }) };
  }
};
