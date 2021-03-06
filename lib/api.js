/* global Buffer, exports */
var http  = require('q-io/http');
var reqId = 1;
var Q     = require('q');


var buildUrl = function(apiUrl, webshop, language, auth) {
  var delimeter = '?';

  if (apiUrl.indexOf('http') !== 0) {
    apiUrl = 'https://' + apiUrl;
  }

  if (webshop) {
    apiUrl += delimeter + 'webshop=' + webshop;
    delimeter = '&';
  }

  if (language) {
    apiUrl += delimeter + 'language=' + language;
    delimeter = '&';
  }

  if (auth) {
    apiUrl += delimeter + 'auth=' + auth;
  }
  return apiUrl;
};

var callApi = function(method, params, options) {
  options = options || {};
  if (!Array.isArray(params)) {
    params = [params];
  }
  var url  = options.url || buildUrl(options.apiUrl, options.webshop, options.language, options.auth);

  var body = JSON.stringify({
    jsonrpc: '2.0',
    id: reqId++,
    method: method,
    params: params
  });

  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'utf8')
  };

  if (options.headers) {
    Object.keys(options.headers).forEach(function(key) {
      headers[key] = options.headers[key];
    });
  }

  var request = {
    url: url,
    charset: 'UTF-8',
    method: 'POST',
    headers: headers,
    body: [body]
  };

  //console.log('Doing req',url, method, params);
  var start = Date.now();
  return http.request(request).then(function(response) {
    if (response.status !== 200) {
      console.log('Not 200', response);
      return Q.reject(response);
    }

    return response.body.read().then(function(r) {
      var res = JSON.parse(r);
      if (res.result) {
        //console.log('Took ', Date.now() - start);
        return res.result;
      }
      console.log('JSON RPC Error', method, params, res.error);
      return Q.reject(r.error);
    });
  });
};

exports.call = callApi;
