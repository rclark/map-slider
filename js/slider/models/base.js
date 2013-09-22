slider.models.Base = function (label, name, url, options) {
  var active = false;
  
  if (_.isObject(label) && _.intersection(_.keys(label), ['label', 'name', 'url']).length === 3) {
    var config = _.clone(label);
    label = config.label;
    name = config.name;
    url = config.url;
    options = config.options || {};
    active = config.active ? true : false;
  }
  
  var base = {
    label: label,
    name: name,
    layer: slider.layers.Base(url, options),
    active: active
  };
  
  return base;
};