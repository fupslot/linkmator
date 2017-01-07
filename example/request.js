const request = require('request');
const url = 'https://cms-assets.tutsplus.com/uploads/users/71/courses/1005/preview_image/RxJS400.png';

request.get({
  url,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36'
  }
}).on('response', ({status, statusMessage}) => {
  console.log(`status ${status}`);
  console.log(`statusMessage: ${statusMessage}`);
});
