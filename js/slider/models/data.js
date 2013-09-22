slider.models.Data = function (config) {
  var data = {
    label: config.label,
    name: config.name,
    layer: config.type(
      config.url || config.github, 
      config.options || {}
    )
  };
  
  return data;
};