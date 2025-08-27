// httpClient.js
const http = require('http');

/**
 * Perform a GET request
 * @param {string} url - The full URL to send the request to
 * @param {Object} [headers={}] - Optional request headers
 * @returns {Promise<Object>} - Response data
 */
function getRequest(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        options.method = 'GET';
        options.headers = headers;
        options.rejectUnauthorized = false;

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`GET request failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

/**
 * Perform a POST request
 * @param {string} url - The full URL to send the request to
 * @param {Object|string} body - Request body
 * @param {Object} [headers={}] - Optional request headers
 * @returns {Promise<Object>} - Response data
 */
function postRequest(url, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const postData = typeof body === 'string' ? body : JSON.stringify(body);

        const options = new URL(url);
        options.method = 'POST';
        options.headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            ...headers
        };
        options.rejectUnauthorized = false;

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`POST request failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

module.exports = { getRequest, postRequest };