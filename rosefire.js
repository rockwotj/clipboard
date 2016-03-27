(function(exports) {
  var getRosefireToken = function(registryToken, callback) {
    var token = encodeURIComponent(registryToken);
    var origin = encodeURIComponent(location.origin);
    var rosefireWindow = window.open('https://rosefire.csse.rose-hulman.edu/webview/login?platform=web&registryToken=' + token + '&referrer=' + origin, '_blank');
    // Hacky, but seems to be the only method.
    var intervalId = setInterval(function() {
      if (rosefireWindow.closed) {
          clearInterval(intervalId);
          console.log('rosefire window closing');
          if (callback) {
            callback(new Error('Login cancelled'));
            callback = null;
          }
      }
    }, 500);
    window.addEventListener('message', function(event) {
      var origin = event.origin || event.originalEvent.origin;
      if (origin !== 'https://rosefire.csse.rose-hulman.edu') {
        console.error('Invalid origin:' + origin);
        return;
      }
      var cb = callback;
      callback = null;
      event.source.close();
      if (cb) {
        cb(null, event.data);                     
      }
    });
  };
  if (typeof Firebase !== "undefined") {
    Firebase.prototype.authWithRoseHulman = function(registryToken, callback) {
      getRosefireToken(registryToken, function(err, token) {
        if (err) {
          callback(err);
        } else {
          this.authWithCustomToken(token, callback);
        }          
      }.bind(this));
    };
  }
  exports.Rosefire = {};
  exports.Rosefire.getToken = getRosefireToken;
})(this);