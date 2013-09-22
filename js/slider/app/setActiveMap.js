slider.app.setActiveMap = function (map) {
  if (_.isString(map)) {
    map = slider.app.maps[map];
  }
  
  slider.app.activeMap = map;
  slider.app.trigger('activeMapChanged', map);  
};