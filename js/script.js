var mypath;
var array; //to keep track of 
function init() {
	/*create map properties*/
	var mapProp = {
		center: new vbd.LatLng (10.8152328, 106.680505),
		zoom: 10
	};

	/*create new map*/
	var map_demo = new vbd.Map(document.getElementById("map"), mapProp);

	/*create new markers when click on the map*/
	$("#marker").click(function(){
		console.log("marker button clicked");
		mypath = new vbd.MVCArray();
		vbd.event.addListener(map_demo, 'click', function(e) {
			addMarker(mypath, e.LatLng, map_demo);
		});	
	});
	
	/*create polyline*/
	$("#polyline").click(function(){
		console.log("polyline button clicked");
		var mypath1 = new vbd.MVCArray();
		addPolyline(mypath1, map_demo);
	});

	/*create polygon*/
	$("#polygon").click(function(){
		console.log("polygon button clicked");
		var mypath2 = new vbd.MVCArray();
		addPolygon(mypath2, map_demo);
	});

	$("#rectangle").click(function(){
		console.log("rectangle button clicked");
		var mypath3 = new vbd.MVCArray();
		addRect(mypath3, map_demo);
	});

	$("#circle").click(function(){
		console.log("circle button clicked");
		var mypath4 = new vbd.MVCArray();
		addCir(mypath4, map_demo);
	});

	$("#layer").click(function(){
		console.log("circle button clicked");
		// var mypath5 = new vbd.MVCArray();
		addLayer(map_demo);
	});

	/*show cursor's coordinates*/ 
	vbd.event.addListener(map_demo, 'mousemove', function (param) {
		document.getElementById("LatLng").value = param.LatLng.toString();
	});
}

vbd.event.addDomListener(window, 'load', init);

/*create a draggable marker*/
function addMarker(path, position, map) {
	var oPos;
	var fiPos;
	var marker = new vbd.Marker({
			position: position,
			draggable: true
	});
	marker.setMap(map);
	path.push(position);
	for (var i=0; i<path.getLength(); i++) {
		console.log("value of cell " + i + " is " + path.getAt(i));
	}
	vbd.event.addListener(marker, 'drag', function(){

	});
	getOriginalPos(marker);
	getFinalPos(marker);

}

/*get the original position before dragging starts*/
function getOriginalPos(marker) {
	vbd.event.addListener(marker, 'dragstart', function(){
		console.log("old position is " + this.getPosition());
		this.getPosition();
	});
}

/*get position where the marker moved to*/
function getFinalPos(marker) {
	vbd.event.addListener(marker, 'dragend', function(){
		console.log("new position is " + this.getPosition());
		this.getPosition()
	});
}

function addPolyline(path, map) {	
	//var path = new vbd.MVCArray();
	vbd.event.addListener(map, 'click', function(e) {
		addMarker(path, e.LatLng, map);
		// console.log("polyline statement");
		// for (var i=0; i<path.getLength(); i++) {
		// console.log("value of cell " + i + " is " + path.getAt(i));
		// }
		var polyline = new vbd.Polyline ({
			path: path,
			strokeOpacity: 0.5,
		});
		// vbd.event.addListener(map,'dblclick', function(){
		// 	return;
		// });
		polyline.setMap(map);
	});
	vbd.event.addListener(map, 'dblclick', function() {
		console.log("just dblclick");
		return;
	});	
}

function addPolygon(path,map) {
	vbd.event.addListener(map, 'click', function(e) {
		addMarker(path, e.LatLng, map);
		for (var i=0; i<path.getLength(); i++) {
			console.log("value of cell " + i + " is " + path.getAt(i));
		}
		if (path.getLength()>=2) {
			var polygon= new vbd.Polygon ({
				paths: path,
				strokeOpacity: 0.5,
			});
			polygon.setMap(map);
		}
	});
		
}

/*create multiple rect from every 2 point click (SW, NE)*/
function addRect(path, map) {
	var rect;
	var bounds;
	var j = 0;
	vbd.event.addListener(map, 'click', function(e) {
		addMarker(path, e.LatLng, map);
		// for (var i=0; i<path.getLength(); i++) {
		// 	console.log("value of cell " + i + " is " + path.getAt(i));
		// }
		if (path.getLength()%2==0) {	
			// console.log("path.getLength is " + path.getLength());			
			bounds = new vbd.LatLngBounds(path.getAt(j), path.getAt(j+1));	
			// console.log("bounds of cell " + j + " and " + (j+1) + " are " + bounds);
			j = j+2;
			// console.log("new j is " + j);
			rect = new vbd.Rectangle ({
				bounds: bounds,
				strokeOpacity: 0.3
			});
			rect.setMap(map);
		}
	});
}

function addCir (path, map) {
	vbd.event.addListener(map, 'click', function(e) {
		addMarker(path, e.LatLng, map);
		var circle = new vbd.Circle({
			center: e.LatLng,
			radius: 500 //gotta let the user choose the radius
		});
		circle.setMap(map);
	});	
}

function addLayer (map) {
	var layer = new vbd.Layer({url:""});
	layer.createTile = function (coords) {
		var canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		var ctx = canvas.getContext('2d');
		ctx.textAlign = "center";
		ctx.font="40px Arial";
		ctx.fillSyle = "#dc8989";
		ctx.fillText(coords.x + ", " + coords.y, 128, 128);
		return canvas;
	}
	layer.setMap(map);
}