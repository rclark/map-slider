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