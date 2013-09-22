slider.models.Label = function (map) {
  var id = 'label-for-' + map.id,
      label = {
        id: id,
        selector: '#' + id, 
        name: map.name,
        map: map
      };
  
  map.on('shown', function () {
    d3.select(label.selector)
      .classed('active', true)
      .append('div')
      .classed('info-arrow', true);
  });
  
  map.on('hidden', function () {
    d3.select(label.selector)
      .classed('active', false)
      .select('.info-arrow')
      .remove();
  });
  
  return label;
};