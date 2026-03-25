const http = require('http');

http.get('http://127.0.0.1:8000/api/v1/main/Bloomora/Dashboard/SavedBouquets/', (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log("Raw response:", data);
    }
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
