(function() {
//$("div#Resumen").append($("<div>", {id:"bar", class: "col-sm-4"}));

var width = $("div#Resumen").width() * 0.75;
var height = $("div#Resumen").height() * 0.75;

//----

const svg2 = d3.select("div#Resumen").append("svg")
	.attr("id","sbar")
	.attr("width", '100%')
    .attr("height", '100%')
	.attr('viewBox',-1*Math.min(width,height)/3.5 +' '+-1*Math.min(width,height)/10+ ' '+Math.min(width,height) +' '+Math.min(width,height)*1.25 )
    .attr('preserveAspectRatio','xMinYMin')
	//.attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
    ,margin = {top: 20, right: 20, bottom: 30, left: 80};
  
const tooltip = d3.select("svg#sbar").append("div")
	.attr("class", "tooltip")
	.attr("height", "100%")
	.style("z-index", "1");
  
const x2 = d3.scaleLinear().range([0, width*0.6]);
const y2 = d3.scaleBand().range([height, 0]);

const g2 = svg2.append("g");
  
d3.json("../data/dat2.json", function(error, data) {
  	if (error) throw error;
  
  	data.sort(function(a, b) { return a.value - b.value; });
  
  	x2.domain([0, d3.max(data, function(d) { return d.value; })]);
    y2.domain(data.map(function(d) { return d.area; })).padding(0.1);

    g2.append("g")
        //.attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x2).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-height]));

    g2.append("g")
        //.attr("class", "y axis")
        .call(d3.axisLeft(y2));
	
	
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	
    g2.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y2.bandwidth())
        .attr("y", function(d) { return y2(d.area); })
        .attr("width", function(d) { return x2(d.value); })
		.attr("fill", function(d, i){ return color(i)})
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.area) + "<br>" + "£" + (d.value));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
});
})();
