const { VNP_HASH_SECRET, sortObject, hmacSHA512, queryString, corsHeaders } = require('./_vnpay');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = { ...(event.queryStringParameters || {}) };
    const secureHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const sorted = sortObject(params);
    const signData = queryString(sorted);
    const signed = hmacSHA512(VNP_HASH_SECRET, signData);
    const verified = secureHash === signed;

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        verified,
        responseCode: sorted.vnp_ResponseCode || null,
        txnRef: sorted.vnp_TxnRef || null
      })
    };
  } catch (e) {
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ verified: false, error: e.message }) };
  }
};
