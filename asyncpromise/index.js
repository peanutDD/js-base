/* jshint esversion: 6 */

const http = require('http');

let getURL = function(url) {
    return new Promise(function(resolve, reject) {
        http.get(url, function(res) {
            let html = '';
            res.on('data', function(chunk) {
                html += chunk;
            });

            res.on('end', function() {
                resolve(html);
            });
            
            res.on('error', function(err) {
                reject(err);
            });
        });
    });
};

let urls = [
    'http://baidu.com/a.html',
    'http://baidu.com/b.html',
    'http://cnodejs.org/?tab=all&page=2'
];

let res = Promise.resolve();

urls.forEach(function(url) {
    res = res.then(function(res) {
        return getURL(url).then(console.log);
    });
});