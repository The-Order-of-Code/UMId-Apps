export async function requestPermission() {
  cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations(
    function (response) {
      console.log('IsIgnoringBatteryOptimizations: ' + response);
      if (response == 'false') {
        cordova.plugins.DozeOptimize.RequestOptimizations(
          function (response) {
            console.log(response);
          },
          function (error) {
            console.error('BatteryOptimizations Request Error' + error);
          }
        );
      } else {
        console.log('Application already Ignoring Battery Optimizations');
      }
    },
    function (error) {
      console.error('IsIgnoringBatteryOptimizations Error' + error);
    }
  );
}
