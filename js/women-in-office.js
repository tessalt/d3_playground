// sizing vars
var viewportWidth  = $(".graph").width(), 
    viewportHeight = document.documentElement.clientHeight,
    margin = 50,
    w = viewportWidth - margin,
    h = viewportHeight - margin*2;

// create svg element
var svg = d3.select(".graph")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// set scales 
var colorScale = d3.scale.category10();

var xScale = d3.time.scale()
  .range([0 + margin, w - margin]);

var yScale = d3.scale.linear() 
  .range([0 + margin, h - margin]);

// set axes
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")  
  .tickPadding(margin / 4)
  .tickSize(-h  + margin * 2, 0);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .tickPadding(margin / 4)
  .tickSize(-w + margin * 2, 0)
  .orient("left");

// define line method
var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d){return xScale(d.date);})
  .y(function(d){return 1 * yScale(d.age);});

// define parse data method
var parseDate = d3.time.format("%Y").parse;

// load and parse data
d3.csv("../data/women-in-office.csv", function(error, data){
  
  // set domain for color scale based on values for countries
  colorScale.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
 
 // parse year values
  data.forEach(function(d){  
    d.date = parseDate(d.Year);
  });

  // map data from countries to object
  var countries = colorScale.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, age: +d[name]};
      })
    };
  });

  var max = d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.age; }); });
  var min = d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.age; }); });
  
  max = Math.ceil(max);
  min = Math.floor(min);

  // set y scale domain based on range of ages
  yScale.domain([max, min]);

  // set x scale domain based on rage of years
  xScale.domain(
    d3.extent(data, function(d) { return d.date; })
  );
  
  // create y axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin + ",0)")
    .call(yAxis);

 // create x axis   
  svg.append("g")
    .attr("class", "axis")
    .call(xAxis)
    .attr("transform", "translate(0," + (h - margin) + ")");

  var legend = d3.select(".legend");

  // create paths for countries
  var country = svg.selectAll(".country")
    .data(countries)
    .enter()
    .append("g")
    .attr("class", "country");

  var countryLegend = legend.selectAll(".countryLegend")
    .data(countries)
    .enter()
    .append("p")
    .text(function(d){return d.name})    
    .append("span")
    .style("background-color", function(d){return colorScale(d.name)});

  // plot paths to data, style paths with colour scale
  country.append("path")
    .attr("class", "line")
    .attr("d", function(d){return line(d.values); })
    .style("stroke", function(d){return colorScale(d.name); });

});
