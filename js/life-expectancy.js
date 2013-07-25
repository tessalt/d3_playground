var viewportWidth  = document.documentElement.clientWidth
  , viewportHeight = document.documentElement.clientHeight

var w = viewportWidth,
    h = viewportHeight - 100,
    margin = 50;

var color = d3.scale.category10();

var parseDate = d3.time.format("%Y").parse;



d3.tsv("data/life-expectancy.tsv", function(error, data){

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
 
  data.forEach(function(d){
    d.date = parseDate(d.year);
  });

  var countries = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, age: +d[name]};
      })
    };
  });

  var yScale = d3.scale.linear()
    .domain([
      d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.age; }); }),
      d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.age; }); })
    ])
    .range([0 + margin, h - margin]);

  var xScale = d3.time.scale()
    .domain(d3.extent(data, function(d) { return d.date; }))
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

  var country = svg.selectAll(".country")
    .data(countries)
    .enter()
    .append("g")
    .attr("class", "country");


var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d){return xScale(d.date);})
  .y(function(d){return 1 * yScale(d.age);});

  country.append("path")
    .attr("class", "line")
    .attr("d", function(d){
      return line(d.values);
    })
    .style("stroke", function(d){
      return color(d.name);
    });


});
