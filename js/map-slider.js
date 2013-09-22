var slider = window.slider = {};

/* **********************************************
     Begin alt-markers.js
********************************************** */

L.SquareMarker = L.Polyline.extend({
	options: {
		size: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Polyline.prototype.initialize.call(this, latlng, options);
		this._size = this.options.size;
	},

	projectLatlngs: function () {
		var
			center = this._map.latLngToLayerPoint(this._latlngs[0]),
			halfSize = Math.round(this._size / 2)
		;
		this._originalPoints = [
			{ x: center.x - halfSize, y: center.y - halfSize },
			{ x: center.x + halfSize, y: center.y - halfSize },
			{ x: center.x + halfSize, y: center.y + halfSize },
			{ x: center.x - halfSize, y: center.y + halfSize },
			{ x: center.x - halfSize, y: center.y - halfSize }
		];
	},

	setSize: function (size) {
		this._size = size;
		return this.redraw();
	}
});

L.squareMarker = function (latlng, options) {
	return new L.SquareMarker(latlng, options);
};

L.TriangleMarker = L.Polyline.extend({
	options: {
		size: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Polyline.prototype.initialize.call(this, latlng, options);
		this._size = this.options.size;
	},

	projectLatlngs: function () {
		var
			center = this._map.latLngToLayerPoint(this._latlngs[0]),
			halfSize = Math.round(this._size / 2)
		;
		this._originalPoints = [
			{ x: center.x , y: center.y },
			{ x: center.x - halfSize, y: center.y - this._size },
			{ x: center.x + halfSize, y: center.y - this._size },
			{ x: center.x, y: center.y }
		];
	},

	setSize: function (size) {
		this._size = size;
		return this.redraw();
	}
});

L.triangleMarker = function (latlng, options) {
	return new L.TriangleMarker(latlng, options);
};

/* **********************************************
     Begin models.js
********************************************** */

slider.models = {};

/* **********************************************
     Begin data.js
********************************************** */

slider.models.Data = function (config) {
  var data = {
    label: config.label,
    name: config.name,
    layer: config.type(
      config.url || config.github, 
      config.options || {}
    ),
    active: config.active ? true : false
  };
  
  return data;
};

/* **********************************************
     Begin map.js
********************************************** */

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
  
  // Mixin options and events
  _.extend(map, options, Backbone.Events);
  
  // Generate a label for the map
  map.label = slider.models.Label(map);
  
  // Generate info for the map
  map.info = slider.models.Info(map);
  
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

/* **********************************************
     Begin label.js
********************************************** */

slider.models.Label = function (map) {
  var id = 'label-for-' + map.id,
      label = {
        id: id,
        selector: '#' + id, 
        name: map.name,
        description: map.description | '',
        map: map
      };
  
  map.on('shown', function () {
    d3.select(label.selector)
      .classed('active', true);
  });
  
  map.on('hidden', function () {
    d3.select(label.selector)
      .classed('active', false);
  });
  
  return label;
};

/* **********************************************
     Begin info.js
********************************************** */

slider.models.Info = function (map) {
  var id = 'info-for-' + map.id,
      info = {
        id: id,
        selector: '#' + id, 
        name: map.name,
        map: map
      };
  
  map.on('shown', function () {
    d3.select(info.selector)
      .classed('active', true);
  });
  
  map.on('hidden', function () {
    d3.select(info.selector)
      .classed('active', false);
  });
  
  return info;
};

/* **********************************************
     Begin layers.js
********************************************** */

slider.layers = {};

/* **********************************************
     Begin base.js
********************************************** */

slider.layers.Base = function (url, options) {
  return L.tileLayer(url, options);
}

/* **********************************************
     Begin geojson.js
********************************************** */

slider.layers.GeoJSON = function (url, options) {
  var GeoJSON = L.GeoJSON.extend({
    initialize: function (url, options) {
      L.GeoJSON.prototype.initialize.call(this, null, options);
      _.bindAll(this, 'gotData');
      d3.json(url, this.gotData);
    },
    
    processData: function (json) {
      return json;  
    },
      
    gotData: function (err, json) {
      if (!err) {
        var geojson = this.processData(json);
        if (geojson) {
          this.addData(geojson);
        }
      }
    },
    
    onAdd: function (map) {
      L.GeoJSON.prototype.onAdd.call(this, map);
      if (options.domId && _.keys(this._layers).length > 0) {
        this.getLayers()[0]._container.parentNode.setAttribute('id', options.domId);  
      }
    }
  });
  
  return new GeoJSON(url, options);  
};

/* **********************************************
     Begin tiles.js
********************************************** */

slider.layers.Tiles = function (url, options) {
  return L.tileLayer(url, options);  
};

/* **********************************************
     Begin github.js
********************************************** */

slider.layers.GitHub = function (config, options) {
  var url = 'https://api.github.com/repos/' + [config.user, config.repo, 'contents', config.path].join('/'),
      layer = slider.layers.GeoJSON(url, options);
  
  layer.processData = function (json) {
    if (json.content === '') {
      d3.json(json._links.git, this.gotData);
    } else {
      var content = json.content.replace(/\s/g, ''),
          data = atob(content),
          geojson = JSON.parse(data);
      this.addData(geojson);
    }
  };
  
  return layer;
};

/* **********************************************
     Begin wms.js
********************************************** */

slider.layers.Wms = function (url, options) {
  return L.tileLayer.wms(url, options);  
};

/* **********************************************
     Begin config.js
********************************************** */

slider.config = {
  maps: [
    {
      name: 'Earthquake Epicenters',
      data: [
        {
          label: 'earthquakes',
          name: 'Earthquake Epicenters',
          type: slider.layers.GeoJSON,
          url: 'http://data.azgs.az.gov/arizona/wfs?request=GetFeature&version=1.0.0&typename=azgs:earthquakedata&outputFormat=json',
          options: {
            domId: 'earthquake-leaflet-layer',
            pointToLayer: function (feature, latlng) {
              var color, 
                  mag = feature.properties.calculated_magnitude, 
                  markerOptions = {
                    fillOpacity: 0.3,
                    weight: 0
                  };
              
              if (isNaN(Number(feature.properties.magnitude))) {
                markerOptions.size = 15;
                markerOptions.color = markerOptions.fill = "#ab4bf2";
                return L.triangleMarker([latlng], markerOptions);
              }
              
              if ((0 < mag && mag <= 1)) {
                markerOptions.fillColor = "#FFFF00";
              } else if ((1 < mag && mag <= 2)) {
                markerOptions.fillColor = "#FFDD00";
              } else if ((2 < mag && mag <= 3)) {
                markerOptions.fillColor = "#FFBF00";
              } else if ((3 < mag && mag <= 4)) {
                markerOptions.fillColor = "#FF9D00";
              } else if ((4 < mag && mag <= 5)) {
                markerOptions.fillColor = "#FF8000";
              } else if ((5 < mag && mag <= 6)) {
                markerOptions.fillColor = "#FF5E00";
              } else if ((6 < mag && mag <= 7)) {
                markerOptions.fillColor = "#FF4000";
              } else if ((7 < mag && mag <= 8)) {
                markerOptions.fillColor = "#FF0000";
              }
              
              markerOptions.radius = mag * 5;
              return L.circleMarker(latlng, markerOptions);
            }
          }
        }
      ]
    },
    {
      name: 'Active Faults',
      data: [
        {
          label: 'activefaults',
          name: 'Active Faults',
          type: slider.layers.GitHub,
          github: {
            user: 'azgs',
            repo: 'hazard-data',
            path: 'activefaults/activefaults.geojson'
          },
          options: {
            domId: 'faults-leaflet-layer',
            style: function(feature) {
              var defaultStyle = {
                weight: 2,
                fillOpacity: 0,
                opacity: 1
              };
              
              if (feature.properties.symbol === "2.13.2") {
                defaultStyle.color = "#FFA500";
              }
              if (feature.properties.symbol === "2.13.3") {
                defaultStyle.color = "#008000";
              }
              if (feature.properties.symbol === "2.13.4") {
                defaultStyle.color = "#800080";
              }
              
              return defaultStyle;
            }
          }
        }
      ]
    },
    {
      name: 'Earth Fissures',
      data: [
        {
          label: 'earthfisssures',
          name: 'Earth Fissures',
          type: slider.layers.GeoJSON,
          url: 'http://data.azgs.az.gov/arizona/wfs?request=GetFeature&version=1.0.0&typename=azgs:earthfissures&outputFormat=json',
          options: {
            //domId: 'fissures-leaflet-layer',
            style: function(feature) {
              var defaultStyle = {
                weight: 2,
                fillOpacity: 0,
                opacity: 1
              };
              
              if (feature.properties.fisstype === "Continuous") {
                defaultStyle.color = "black";
              }
              if (feature.properties.fisstype === "Discontinuous") {
                defaultStyle.color = "red";
              }
              if (feature.properties.fisstype === "Reported/Unconfirmed") {
                defaultStyle.color = "green";
                defaultStyle.dashArray = "10 4";
              }
              
              return defaultStyle;
            }
          }
        }
      ]
    },
    {
      name: 'Fire Risk Index',
      data: [
        {
          label: 'firerisk',
          name: 'Fire Risk Index',
          type: slider.layers.Tiles,
          url: 'http://{s}.tiles.usgin.org/fire-risk-index/{z}/{x}/{y}.png',
          options: {
            opacity: 0.5
          }
        }
      ]
    },
    {
      name: 'Flood Risk',
      data: [
        {
          label: 'floodrisk',
          name: 'Flood Risk',
          type: slider.layers.Wms,
          url: 'http://data.azgs.az.gov/arizona/gwc/service/wms',
          options: {
            layers: 'azgs:floods',
            format: 'image/png',
            transparent: true
          }
        }
      ]
    }
  ],
  baseLayers: [
    {
      name: 'Subdued Terrain',
      label: 'terrain',
      url: 'http://a.tiles.mapbox.com/v3/rclark.map-swcvfr1t/{z}/{x}/{y}.png',
      type: slider.layers.Tiles,
      active: true
    }
  ],
  topLayers: [
    {
      name: 'Subdued Roads',
      label: 'roads',
      url: 'http://a.tiles.mapbox.com/v3/rclark.map-t7ep1mrm/{z}/{x}/{y}.png',
      type: slider.layers.Tiles,
      active: true
    }
  ]
};

/* **********************************************
     Begin app.js
********************************************** */

slider.app = {};

/* **********************************************
     Begin start.js
********************************************** */

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
    
    return slider.models.Map(mapConfig.name, data, mapConfig.options || {});
  });
  
  // Generate labels
  d3.select('#labels').selectAll('li')
    .data(_.map(maps, function (map) {
      return map.label;
    }))
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
    center: L.latLng(34, -111),
    zoom: 7
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

/* **********************************************
     Begin setActiveMap.js
********************************************** */

slider.app.setActiveMap = function (map) {
  if (_.isString(map)) {
    map = slider.app.maps[map];
  }
  
  slider.app.activeMap = map;
  slider.app.trigger('activeMapChanged', map);  
};