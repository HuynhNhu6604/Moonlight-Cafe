const crypto = require('crypto');

const VNP_TMN_CODE = process.env.VNP_TMN_CODE || 'N7EEGOFE';
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'CJDFAU6O4XOHCXT4ZT9OONIPVL6CGEVG';
const VNP_URL = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      const value = obj[key];
      if (value !== undefined && value !== null && value !== '') {
        sorted[key] = value;
      }
    });
  return sorted;
}

function hmacSHA512(secret, data) {
  return crypto.createHmac('sha512', secret).update(Buffer.from(data, 'utf-8')).digest('hex');
}

function queryString(params) {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(String(params[key])).replace(/%20/g, '+')}`)
    .join('&');
}

function formatDateVN() {
  const now = new Date();
  const vn = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const YYYY = vn.getUTCFullYear();
  const MM = String(vn.getUTCMonth() + 1).padStart(2, '0');
  const DD = String(vn.getUTCDate()).padStart(2, '0');
  const hh = String(vn.getUTCHours()).padStart(2, '0');
  const mm = String(vn.getUTCMinutes()).padStart(2, '0');
  const ss = String(vn.getUTCSeconds()).padStart(2, '0');
  return `${YYYY}${MM}${DD}${hh}${mm}${ss}`;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  };
}

module.exports = {
  VNP_TMN_CODE,
  VNP_HASH_SECRET,
  VNP_URL,
  sortObject,
  hmacSHA512,
  queryString,
  formatDateVN,
  corsHeaders
};
