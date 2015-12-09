angular.module('starter.services', [])

.factory('Datas', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var datas = [{
    id: 0,
    airquality1: '0',
    airquality2: '0',
    temperature: '0°C',
    humidity: '0%'
  }, {
    id: 1,
    airquality1: '0',
    airquality2: '0',
    temperature: '0°C',
    humidity: '0%'
  }, {
    id: 3,
    airquality1: '0',
    airquality2: '0',
    temperature: '0°C',
    humidity: '0%'
  }, {
    id: 4,
    airquality1: '0',
    airquality2: '0',
    temperature: '0°C',
    humidity: '0%'
  }, {
    id: 5,
    airquality1: '0',
    airquality2: '0',
    temperature: '0°C',
    humidity: '0%'
  }];

  return {
    all: function() {
      return datas;
    },
    remove: function(data) {
      datas.splice(datas.indexOf(data), 1);
    },
    get: function(dataId) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].id === parseInt(dataId)) {
          return datas[i];
        }
      }
      return null;
    }
  };
});
