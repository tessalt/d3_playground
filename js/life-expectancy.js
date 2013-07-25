var w = 800,
    h = 400,
    margin = 30;

var parseDate = d3.time.format("%Y").parse;

d3.tsv("data/data.tsv", function(error, data){
 
  data.forEach(function(d){
    d.date = parseDate(d.date);
    d.age = d.age;
  });

  var yScale = d3.scale.linear()
    .domain([d3.max(data.map(function(d) { return d.age; })), d3.min(data.map(function(d) { return d.age; }))])
    .range([0 + margin, h - margin]);

  var xScale = d3.time.scale()
    .domain([d3.min(data.map(function(d) { return d.date; })), d3.max(data.map(function(d) { return d.date; }))])
    .range([0 + margin, w - margin]);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(10)
    .orient("left");

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(data.length/4)
    .orient("bottom");

  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var g = svg.append("g");

  var line = d3.svg.line()
    .x(function(d, i){return xScale(d.date);})
    .y(function(d){return 1 * yScale(d.age);})

  g.append("path")
    .attr("d", line(data));

  svg.append("g")
    .attr("transform", "translate(" + margin + ",0)")
    .call(yAxis);

  svg.append("g")
    .call(xAxis)
    .attr("transform", "translate(0," + (h - margin) + ")");

});
