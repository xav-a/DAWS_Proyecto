
$("div#home").append($("<div>", {id:"chart", class: "img-responsive"}));

var width = $("div#chart").parent().width() * 0.75;
var height = $("div#chart").parent().height() * 0.75;
var radius = Math.min(width, height) /2;

var svg = d3.select("div#chart").append("svg")
    .attr("width",width)
    .attr("height",height),
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.Ingresos; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

d3.csv("../data/dat1.csv", function(d) {
  d.population = +d.population;
  return d;
}, function(error, data) {
  if (error) throw error;

	var arc = g.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc");
	
	arc.append("path")
		.attr("d", path)
		.attr("fill", function(d) { return color(d.data.Sector); });
	
	arc.append("text")
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.text(function(d) { return d.data.Sector; });
});