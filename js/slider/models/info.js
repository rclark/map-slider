slider.models.Info = function (map) {
  var id = 'info-for-' + map.id,
      info = {
        id: id,
        selector: '#' + id, 
        name: map.name,
        map: map
      };
  
  map.on('shown', function () {
    var infoPane = d3.selectAll('#info').selectAll('div')
      .data([info], function (d) { return d.id; }),
    thisInfo = infoPane.enter()
      .append('div'),
    textBlock = thisInfo.append('div')
      .classed('info-text', true)
    title = textBlock.append('h2')
      .text(function (d) { return d.name; }),
    summary = textBlock.append('p')
      .text(function (d) { return d.map.summary; });
    
    infoPane.exit()
      .remove();
  });
  
  return info;
};