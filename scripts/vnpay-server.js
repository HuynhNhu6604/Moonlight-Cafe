const http = require('http');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 8787);
const VNP_TMN_CODE = process.env.VNP_TMN_CODE || 'N7EEGOFE';
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'CJDFAU6O4XOHCXT4ZT9OONIPVL6CGEVG';
const VNP_URL = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

function sendJson(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

function sortObject(obj) {
    const sorted = {};
    Object.keys(obj)
        .sort()
        .forEach((key) => {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                sorted[key] = obj[key];
            }
        });
    return sorted;
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

function hmacSHA512(secret, data) {
    return crypto.createHmac('sha512', secret).update(Buffer.from(data, 'utf-8')).digest('hex');
}

function queryStringNoEncode(params) {
    return Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(String(params[key])).replace(/%20/g, '+')}`)
        .join('&');
}

function normalizeVnpayAmount(amount) {
    const numericAmount = Number(String(amount ?? '').replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return 0;
    }
    return Math.round(numericAmount);
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        return sendJson(res, 200, { ok: true });
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const isCreatePaymentUrl =
        url.pathname === '/api/vnpay/create-payment-url' ||
        url.pathname === '/vnpay-create-payment-url' ||
        url.pathname === '/.netlify/functions/vnpay-create-payment-url';
    const isVerifyReturn =
        url.pathname === '/api/vnpay/verify-return' ||
        url.pathname === '/vnpay-verify-return' ||
        url.pathname === '/.netlify/functions/vnpay-verify-return';
    const isIpn =
        url.pathname === '/api/vnpay/ipn' ||
        url.pathname === '/vnpay-ipn' ||
        url.pathname === '/.netlify/functions/vnpay-ipn';

    if (req.method === 'POST' && isCreatePaymentUrl) {
        try {
            const body = await parseBody(req);
            const amount = normalizeVnpayAmount(body.amount);
            const orderId = String(body.orderId || '').trim();
            const returnUrl = String(body.returnUrl || '').trim();

            if (!amount || !orderId || !returnUrl) {
                return sendJson(res, 400, { error: 'Missing amount/orderId/returnUrl' });
            }

            const createDate = formatDateVN();
            const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

            let vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: VNP_TMN_CODE,
                vnp_Amount: amount * 100,
                vnp_CurrCode: 'VND',
                vnp_TxnRef: orderId,
                vnp_OrderInfo: body.orderInfo || `Thanh toan don hang ${orderId}`,
                vnp_OrderType: 'other',
                vnp_Locale: body.locale || 'vn',
                vnp_ReturnUrl: returnUrl,
                vnp_IpAddr: String(ipAddr),
                vnp_CreateDate: createDate
            };

            if (body.bankCode) {
                vnp_Params.vnp_BankCode = body.bankCode;
            }

            vnp_Params = sortObject(vnp_Params);
            const signData = queryStringNoEncode(vnp_Params);
            const secureHash = hmacSHA512(VNP_HASH_SECRET, signData);
            vnp_Params.vnp_SecureHash = secureHash;

            const paymentUrl = `${VNP_URL}?${queryStringNoEncode(vnp_Params)}`;
            return sendJson(res, 200, { paymentUrl });
        } catch (e) {
            return sendJson(res, 500, { error: e.message });
        }
    }

    if (req.method === 'GET' && isVerifyReturn) {
        try {
            const params = {};
            url.searchParams.forEach((value, key) => { params[key] = value; });

            const secureHash = params.vnp_SecureHash;
            delete params.vnp_SecureHash;
            delete params.vnp_SecureHashType;

            const sorted = sortObject(params);
            const signData = queryStringNoEncode(sorted);
            const signed = hmacSHA512(VNP_HASH_SECRET, signData);
            const verified = secureHash === signed;

            return sendJson(res, 200, {
                verified,
                responseCode: sorted.vnp_ResponseCode || null,
                txnRef: sorted.vnp_TxnRef || null
            });
        } catch (e) {
            return sendJson(res, 500, { verified: false, error: e.message });
        }
    }

    if (req.method === 'GET' && isIpn) {
        try {
            const params = {};
            url.searchParams.forEach((value, key) => { params[key] = value; });

            const secureHash = params.vnp_SecureHash;
            delete params.vnp_SecureHash;
            delete params.vnp_SecureHashType;
            const sorted = sortObject(params);
            const signData = queryStringNoEncode(sorted);
            const signed = hmacSHA512(VNP_HASH_SECRET, signData);

            if (secureHash !== signed) {
                return sendJson(res, 200, { RspCode: '97', Message: 'Invalid Checksum' });
            }

            return sendJson(res, 200, { RspCode: '00', Message: 'Confirm Success' });
        } catch (e) {
            return sendJson(res, 200, { RspCode: '99', Message: e.message });
        }
    }

    return sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log(`[VNPAY] API server listening on http://localhost:${PORT}`);
    console.log('[VNPAY] Use IPN URL: http://<your-domain-or-ip>:' + PORT + '/api/vnpay/ipn');
});
