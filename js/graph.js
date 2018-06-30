(function () {
//$("div#Resumen").append($("<div>", {id:"pie", class: "col-sm-4"}));

var width = $("div#Resumen").width() * 0.75;
var height = $("div#Resumen").height() * 0.75;
var radius = Math.min(width, height) /2;

const svg = d3.select("div#Resumen").append("svg")
	.attr("id","spie")
	.attr("width", '40%')
    .attr("height", '100%')
	.attr('viewBox',-1*Math.min(width,height)/1.75 +' '+-1*Math.min(width,height)/1.75+ ' '+Math.min(width,height)*1.25 +' '+Math.min(width,height)*1.25 )
    .attr('preserveAspectRatio','xMinYMin')
	//.attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
    ,g = svg.append("g");

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

const pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.Ingresos; });

const path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius/3);

const label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

d3.csv("../data/dat1.csv", function(d) {
  d.population = +d.population;
  return d;
}, function(error, data) {
  if (error) throw error;
	
	var tots = d3.sum(data, function(d) { 
            	return d.values; 
            });

    data.forEach(function(d) {
        d.percentage = d.values  / tots;
    });

	var arc = g.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc");
	
	arc.append("path")
		.attr("d", path)
		.attr("fill", function(d) { return color(d.data.Sector); });
	
	arc.append("text")
		.attr("transform", function(d) {  
			var c = label.centroid(d);
			return "translate(" + c[0]*1.5 +"," + c[1]*1.5 + ")";
		})
		.attr("dy", "0.35em")
		.text(function(d) { return d.data.Sector; });
});

})();