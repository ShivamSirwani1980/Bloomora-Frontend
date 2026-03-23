const http = require('http');

http.get('http://127.0.0.1:8000/api/v1/main/Bloomora/OrderHistory/?email=co2023.shivam.sirwani@ves.ac.in', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log('GET Output:', data));
});
