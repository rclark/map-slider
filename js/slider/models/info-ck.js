slider.models.Info=function(e){var t="info-for-"+e.id,n={id:t,selector:"#"+t,name:e.name,map:e};e.on("shown",function(){d3.select(n.selector).classed("active",!0)});e.on("hidden",function(){d3.select(n.selector).classed("active",!1)});return n};