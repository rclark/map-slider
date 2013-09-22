slider.app.start = function (config) {
  config = config || slider.config;
  
  // Add event handling to the app
  _.extend(slider.app, Backbone.Events);
  
  // Build base layers
  slider.app.bases = _.map(config.baseLayers, function (baseConfig) {
    var base = slider.models.Data(baseConfig);
    if (baseConfig.active) {
      slider.app.activeBase = base.layer;
    }
    return base;
  });
  
  // Build top layers
  slider.app.tops = _.map(config.topLayers || [], function (topConfig) {
    var top = slider.models.Data(topConfig);
    if (topConfig.active) {
      slider.app.activeTop = top.layer;
    }
    return top;
  });
  
  // Generate maps
  var maps = _.map(config.maps, function (mapConfig) {
    var data = _.map(mapConfig.data, function(dataConfig) {
      return slider.models.Data(dataConfig);
    });
    
    return slider.models.Map(mapConfig.name, data, mapConfig.info || {});
  });
  
  // Generate labels
  d3.select('#labels').selectAll('li')
    .data(_.pluck(maps, 'label'))
    .enter().append('li')
    .text(function (d) { return d.name; })
    .attr('id', function (d) { return d.id; })
    .classed('map-label', true)
    .on('click', function (d) { 
      slider.app.setActiveMap(d.map);
    });
  
  // Generate the Leaflet map
  d3.select('#map-container').append('div')
    .attr('id', 'map')
    .classed('slider-map', true);
  
  var mapOptions = _.extend({
    center: L.latLng(34.243594729697406, -111.46728515624999 ),
    zoom: 6
  }, config.mapOptions || {});
  
  slider.app.map = L.map('map', mapOptions);
  if (slider.app.activeBase) { slider.app.activeBase.addTo(slider.app.map); }
  if (slider.app.activeTop) {
    slider.app.activeTop.addTo(slider.app.map);
    slider.app.activeTop.setZIndex(400);
  }
  
  // Stash maps so that they can be looked up
  slider.app.maps = _.object(
    _.map(maps, function(map) {
      return map.id
    }),
    maps
  );
};