export default function(method, url, body) {
  if (!url) {
    url = method;
    method = 'GET';
  }

  const headers = {
    'Accept': 'application/json'
  };

  if (method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  const init = {
    method: method,
    headers: new Headers(headers),
    mode: 'same-origin',
    credentials: 'same-origin'
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  return new Request(url, init);
}
