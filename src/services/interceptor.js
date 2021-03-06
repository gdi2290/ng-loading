angular.module('ngLoading.interceptor', [])
.factory('Interceptor', ['$document', '$injector', '$q', 'loading', '$log', function($document, $injector, $q, loading, $log) {
  var defer = $q.defer();
  var overlay, loadConfig;
  return {
    start: function() {
      $injector.invoke(function(compileFactory) {
        compileFactory.append();
        compileFactory.fadeIn();
        // defer.resolve(config);
      });
    },
    end: function() {
      $injector.invoke(function(compileFactory) {
        compileFactory.remove();
      });
    },
    request: function(config) {
      //disable loading screen for a per request basis
      if(config.showLoading === false) return config;

      if(config.loadingConfig) {
        loadConfig = _.extend(loading.config, loading.verify(config.loadingConfig));
        if(config.loadingConfig.overlay.display === true){
          overlay = _.extend(loading.config.overlay, loading.verify(config.loadingConfig.overlay, 'overlay'));
        }
        loading.config = loadConfig;
        loading.config.overlay = overlay;
      }

      $injector.invoke(function(compileFactory) {
        compileFactory.append();
        compileFactory.fadeIn();
        defer.resolve(config);
      });
      return defer.promise;
    },
    response: function(response) {
      $injector.invoke(function(compileFactory) {
        compileFactory.remove();
      });
      return response;
    }
  };
}]);