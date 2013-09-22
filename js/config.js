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
      active: true
    }
  ],
  topLayers: [
    {
      name: 'Subdued Roads',
      label: 'roads',
      url: 'http://a.tiles.mapbox.com/v3/rclark.map-t7ep1mrm/{z}/{x}/{y}.png',
      active: true
    }
  ]
};