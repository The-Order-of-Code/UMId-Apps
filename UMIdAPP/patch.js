const fs = require('fs');
const f1 = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
const f2 = 'node_modules/aes-ccm/lib/index.js';
const f3 = 'node_modules/@ionic-native/bluetooth-le/ngx/index.d.ts'
const cose_sign_file = 'node_modules/cose-js/lib/common.js'


fs.readFile(f1, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {fs: \'empty\', stream: true, global: true, crypto: true, tls: \'empty\', net: \'empty\', process: true, module: false, clearImmediate: false, setImmediate: false}');

  fs.writeFile(f1, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

fs.readFile(f2, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    
    var result = data.replace(/module.exports/, '\/\/module.exports');
  
    fs.writeFile(f2, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

fs.readFile(f3, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  var result = data.replace(/'notified';/, '\'notified\' \| \'notificationReady\' \| \'notificationSent\';');
  result = result.replace('isAdvertising(): Promise<{', 'isAdvertising(): Promise<{\n\t\tisAdvertising: boolean;');
  fs.writeFile(f3, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

/* 
* para adicionar as restantes codificações de possiveis algoritmos (ES384 e ES512) e o x5chain como unprotected header
*/
fs.readFile(cose_sign_file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  var result = data.replace(/'counter_signature': 7/, '\'counter_signature\': 7,\n\t\'x5chain\': 33');
  result = result.replace(/'ES256': -7\,/,'\'ES256\': -7,\n\t\'ES384\': -35,\n\t\'ES512\': -36,')
  fs.writeFile(cose_sign_file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

