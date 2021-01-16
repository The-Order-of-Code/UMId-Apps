const axios = require('axios')
const fs = require('fs');
const f1 = 'src/common/general/constants.ts' 


const auth = 'Basic ' + Buffer.from('f3233' + ':' + 'lourenco1234').toString('base64');
const ip_backend = '34.76.50.180:8000';
const url = 'http://' + ip_backend + '/general/cacert/';

axios.get(url, {
  headers: {
    'Authorization': auth
  }
})
.then((res) => {
    fs.readFile(f1, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var result = data.replace(/export const root_cert_pem = "*";/, 'export const root_cert_pem = ' + JSON.stringify(res.data) + ';');
        fs.writeFile(f1, result, 'utf8', function (err) {
          if (err) return console.log(err);
        });
      });
})
.catch((error) => {
  console.error(error)
})