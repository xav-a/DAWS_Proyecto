(function() {

function loadCanton(cantonXml) {
	
	let nombre = $(cantonXml).attr('nombre');	
	let info = $(cantonXml).find('info').text();
	
	$("div#canton-info").find('h3').text(nombre);
	$("div#canton-info").find('p').text(info);
	
	let jsonfile = $(cantonXml).find('archivo').attr('ruta');
	drawChart("../data/" + jsonfile);		
}

function drawChart(jsonfile) {
	console.log(jsonfile);
	var width = $("div#canton-chart").width();
	var height = $("div#canton-chart").height();
	var radius = Math.min(width, height) /2;
	
	const svg = d3.select("div#canton-chart").append("svg")
		.attr("width", '100%')
		.attr("height", '100%')
		.attr('viewBox',-1*Math.min(width,height)/1.75 +' '+-1*Math.min(width,height)/1.75+ ' '+Math.min(width,height)*1.25 +' '+Math.min(width,height)*1.25 )
		.attr('preserveAspectRatio','xMinYMin')
		,g = svg.append("g");
	
	var color = d3.scaleOrdinal(["#98abc2", "#8a89b1", "#7b6778", "#6b493b", "#a05d42", "#d0555c", "#ff8a11"]);
	
	const pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.Ingresos; });
	
	const path = d3.arc()
		.outerRadius(radius)
		.innerRadius(0);
	
	const label = d3.arc()
		.outerRadius(radius)
		.innerRadius(radius/3);
	
	d3.json(jsonfile, function(error, data) {
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

	
}

$("select#seleccion").on("change", function(){
	let seleccion = $(this).find(":selected").val();	
	
	$("div#canton-chart").find("svg").remove();
	$.ajax({
		url: "../data/cantones/cantones.xml",
		type: "GET",
		dataType: "xml",
		success: function(data) {
			let canton = $(data).find("canton[nombre='" + seleccion +"']");
			loadCanton(canton);
		}
	});
});

})();