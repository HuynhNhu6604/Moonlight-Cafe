const { VNP_HASH_SECRET, sortObject, hmacSHA512, queryString, corsHeaders } = require('./_vnpay');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ RspCode: '99', Message: 'Method not allowed' }) };
  }

  try {
    const params = { ...(event.queryStringParameters || {}) };
    const secureHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const sorted = sortObject(params);
    const signData = queryString(sorted);
    const signed = hmacSHA512(VNP_HASH_SECRET, signData);

    if (secureHash !== signed) {
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ RspCode: '97', Message: 'Invalid Checksum' }) };
    }

    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ RspCode: '00', Message: 'Confirm Success' }) };
  } catch (e) {
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ RspCode: '99', Message: e.message }) };
  }
};
