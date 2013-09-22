slider.models.Map = function (name, data, options) {
  // id for this map's DOM element, and pointer to its container
  var id = name.toLowerCase().replace(/ /g, '-'),
      selector = '#' + id,
      container = d3.select('#map-container');
  
  // Generate the map object
  var map = {
    name: name,
    id: id,
    data: data,
    active: false
  };
  
  // Mixin events
  _.extend(map, Backbone.Events);
  
  // Generate a label for the map
  map.label = slider.models.Label(map);
  
  // Build an array of layers to be drawn on this map
  var mapLayers = _.map(data, function (data) {
    return data.layer;  
  });
  
  // Function to show this map
  function show() {
    _.each(mapLayers, function (layer) {
      slider.app.map.addLayer(layer);
    });
    map.active = true;
    map.trigger('shown');
  }
  
  // Function to hide this map
  function hide() {
    _.each(mapLayers, function (layer) {
      slider.app.map.removeLayer(layer);  
    });
    map.active = false;
    map.trigger('hidden');
  }
  
  // Listen for instruction to show/hide this map
  slider.app.on('activeMapChanged', function (activeMap) {
    if (activeMap.id === map.id && !map.active) { show(); }
    else if (map.active) { hide(); }
  });
  
  return map;
};