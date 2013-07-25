var viewportWidth  = document.documentElement.clientWidth
  , viewportHeight = document.documentElement.clientHeight

var w = viewportWidth,
    h = viewportHeight - 100,
    margin = 50;


var parseDate = d3.time.format("%Y").parse;

d3.tsv("data/life-expectancy.tsv", function(error, data){
 
  data.forEach(function(d){
    d.date = parseDate(d.year);
    d.canada = d.canada;
    d.australia = d.australia;
    d.us = d.us;
  });

  var yScale = d3.scale.linear()
    .domain([d3.max(data.map(function(d) { return d.australia; })), d3.min(data.map(function(d) { return d.us; }))])
    .range([0 + margin, h - margin]);

  var xScale = d3.time.scale()
    .domain([d3.min(data.map(function(d) { return d.date; })), d3.max(data.map(function(d) { return d.date; }))])
    .range([0 + margin, w - margin]);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickPadding(margin / 4)
    .tickSize(-w + margin * 2, 0)
    .orient("left");

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(data.length/4)
    .orient("bottom");

  var svg = d3.select(".container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin + ",0)")
    .call(yAxis);

  svg.append("g")
    .attr("class", "axis")
    .call(xAxis)
    .attr("transform", "translate(0," + (h - margin) + ")");

  d3.selectAll(".axis text")
    .attr("fill", "#ecf0f1");

  d3.selectAll(".axis path, .axis path")
    .attr("stroke", "none")
    .attr("fill", "none");

  var canG = svg.append("g"),
      ausG = svg.append("g"),
      usG = svg.append("g");

  var canLine = d3.svg.line()
    .x(function(d){return xScale(d.date);})
    .y(function(d){return 1 * yScale(d.canada);})

  var ausLine = d3.svg.line()
    .x(function(d){return xScale(d.date);})
    .y(function(d){return 1 * yScale(d.australia);})

  var usLine = d3.svg.line()
    .x(function(d){return xScale(d.date);})
    .y(function(d){return 1 * yScale(d.us);})

  canG.append("path")
    .attr("class", "can plot")
    .attr("d", canLine(data));

  ausG.append("path")
    .attr("class", "aus plot")
    .attr("d", ausLine(data));

  usG.append("path")
    .attr("class", "usa plot")
    .attr("d", usLine(data));


});
