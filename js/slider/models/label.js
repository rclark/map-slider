slider.models.Label = function (map) {
  var id = 'label-for-' + map.id,
      label = {
        id: id,
        selector: '#' + id, 
        name: map.name,
        map: map.id,
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