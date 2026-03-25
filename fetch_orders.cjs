const http = require('http');

const postData = JSON.stringify({ email: 'co2023.shivam.sirwani@ves.ac.in' });

const options = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/v1/main/Bloomora/OrderHistory/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 405) {
       console.log("POST not allowed. Trying GET...");
       http.get('http://127.0.0.1:8000/api/v1/main/Bloomora/OrderHistory/', (res2) => {
           let data2 = '';
           res2.on('data', c => data2 += c);
           res2.on('end', () => console.log('GET Output:', data2));
       });
    } else {
       console.log('POST Output:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
