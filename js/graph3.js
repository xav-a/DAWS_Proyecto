(function() {
var margin3 = {top: 30, right: 20, bottom: 70, left: 50},
    width = $("div#Resumen").width() * 0.75 - margin3.left - margin3.right,
    height = $("div#Resumen").height() * 0.75 - margin3.top - margin3.bottom;

// Parse the date / time
var parseDate = d3.timeParse("%b %Y");

// Set the ranges
const x3 = d3.scaleTime().range([0, width]);  
const y3 = d3.scaleLinear().range([height, 0]);

// Define the line
const priceline = d3.line()	
    .x(function(d) { return x3(d.date); })
    .y(function(d) { return y3(d.price); });
    
// Adds the svg canvas
const svg3 = d3.select("div#Resumen")
    .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
		.attr('viewBox',-1*margin3.left+' '+-1*margin3.top + ' '+Math.max(width,height)+' '+Math.min(width,height)*1.9)
		.attr('preserveAspectRatio','xMinYMin')
    .append("g");

// Get the data
d3.json("../data/dat3.json", function(error, data) {
    data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    x3.domain(d3.extent(data, function(d) { return d.date; }));
    y3.domain([0, d3.max(data, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(data);

    // set the colour scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 

        svg3.append("path")
            //.attr("class", "line")
			.style("fill", "none")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("d", priceline(d.values));

        // Add the Legend
        svg3.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin3.bottom/2)+ 5)
            //.attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .text(d.key); 

    });

  // Add the X Axis
  svg3.append("g")
      //.attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x3));

  // Add the Y Axis
  svg3.append("g")
      //.attr("class", "y axis")
      .call(d3.axisLeft(y3));

});
})();