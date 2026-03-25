const http = require('http');
const fs = require('fs');

http.get('http://127.0.0.1:8000/api/v1/main/Bloomora/Dashboard/SavedBouquets/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      fs.writeFileSync('fetch_output.json', JSON.stringify(JSON.parse(data), null, 2), 'utf8');
    } catch(e) {
      fs.writeFileSync('fetch_output.json', data, 'utf8');
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
