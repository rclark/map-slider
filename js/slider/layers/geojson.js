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