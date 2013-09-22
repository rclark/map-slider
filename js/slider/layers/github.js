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