function init() {
	/*create map properties*/
	var mapProp = {
		center: new vbd.LatLng (10.8152328, 106.680505),
		zoom: 10
	};
	/*create new map*/
	var map_demo = new vbd.Map(document.getElementById("map"), mapProp);

	//map_demo.overlays = []; //array containing all overlays

	var overlays = [];

	/*create states for map*/
	var stateEnum = {
		NONE: 1,
		CLEAR: 2,
		OVERLAYS: {
			MARKER: 3,
			POLYLINE: 4,
			POLYGON: 5,
			RECT: 6,
			CIR: 7,
			LAYER: 8
		}
	}
	var currentState = stateEnum.NONE; //set default state

	//var objDraw = new drawOvarlayObj({map:map_demo});

	/*change state when click button*/
	$('.btn.btn-default.btn-responsive').click(function() {
		switch (this.id) {
			case 'del':
				currentState = stateEnum.CLEAR;
				clearOVL(overlays);
				currentState = stateEnum.NONE; //return to default state
				break;
			case 'marker':
				currentState = stateEnum.OVERLAYS.MARKER;
				break;
			case 'polyline':
				currentState = stateEnum.OVERLAYS.POLYLINE;
				break;
			case 'polygon':
				currentState = stateEnum.OVERLAYS.POLYGON;
				break;
			case 'rectangle':
				currentState = stateEnum.OVERLAYS.RECT;
				break;
			case 'circle':
				currentState = stateEnum.OVERLAYS.CIR;
				break;
			case 'layer':
				currentState = stateEnum.OVERLAYS.LAYER;
				break;
		}
	});

	/*variables to used in overlay function*/
	var marker;
	var line = new vbd.MVCArray();
	var gon = new vbd.MVCArray();
	var rectArray = [];
	var polyline = null;
	var polygon = null;

	/*add overlays when click map*/
	vbd.event.addListener(map_demo,'click',function(e) {
		console.log("currentState in map click event is " + currentState);
		switch (currentState) {

			case stateEnum.OVERLAYS.MARKER:
				addMarker(map_demo, e.LatLng);
				for (var i=0; i<overlays.length; i++) {
					console.log("value of overlays cell " + i + " is " + overlays[i]);
				}
				break;

			case stateEnum.OVERLAYS.POLYLINE:
				if(!polyline){
					map_demo.disableDoubleClickZoom(true);
					polyline = new vbd.Polyline ({
						path: [e.LatLng],
						strokeOpacity: 0.5,
					});
					polyline.setMap(map_demo);
				}
				else{
					polyline.getPath().push(e.LatLng);
				}
				break;

			case stateEnum.OVERLAYS.POLYGON:
				if(!polygon){
					map_demo.disableDoubleClickZoom(true);
					gon.push(e.LatLng);
					// if(gon.getLength()==2) {
					// 	console.log("gon length is " + gon.getLength());
					// 	polygon = new vbd.Polyline ({
					// 		paths: [e.LatLng],
					// 		strokeOpacity: 0.5,
					// 		map: map_demo
					// 	});
					// 	polygon.setMap(map_demo);
					// }
					
				}
				// else{
				// 	polygon.getPath().push(e.LatLng);
				// }
				break;

			case stateEnum.OVERLAYS.RECT:
				addRect(map_demo, e.LatLng, rectArray);
				break;

			case stateEnum.OVERLAYS.CIR:
				addCir(map_demo, e.LatLng);
				for (var i=0; i<overlays.length; i++) {
					console.log("value of overlays cell " + i + " is " + overlays[i]);
				}
				break;

			case stateEnum.OVERLAYS.LAYER:
				addLayer(map_demo);
				break;

		}
	});

	/*double click to end drawing polyline and polygon*/
	vbd.event.addListener(map_demo,'dblclick', function(e){
		if(currentState === stateEnum.OVERLAYS.POLYLINE && polyline){
			console.log("ending polyline");
			console.log(polyline);
			/*create a copy of polyline and then set polyline to null*/
			var lineCopy = new vbd.Polyline({
				path: polyline.getPath(),
				map: map_demo,
				strokeColor:"#00FF00"
			});
			lineCopy.getPath().push(e.LatLng); //include the dblclick position
			
			polyline.setMap(null);
			polyline = null;
			
			// setTimeout(function (){
	  //           map_demo.disableDoubleClickZoom(false);
	  //       }, 70);

			currentState = stateEnum.NONE;
			console.log(currentState);
		}

		/*if (currentState === stateEnum.OVERLAYS.POLYGON && gon.getLength()>0) {
			currentState = stateEnum.NONE;
			console.log("currentState after dblclick is " + currentState);

		}*/
	});

	function addMarker(map, position) {
		console.log("add a marker");
		var marker = new vbd.Marker({
			position: position,
			// draggable: true
		});
		marker.setMap(map);
		overlays.push(marker);
	}

	// function addPoly(poly, array, position) {	
	// 	array = poly.getPath();
	// 	array.push(position);
	// 	poly.setPath(array);
	// }

	/*create multiple rect from every 2 point click (SW, NE)*/
	function addRect(map, position, array) {
		var rect;
		var bounds;
		
		addMarker(map, position);
		rectArray.push(position);
		console.log("rectArray.getLength is " + rectArray.length);			
		if (rectArray.length==2) {	
			bounds = new vbd.LatLngBounds(rectArray[0], rectArray[1]);	
			rect = new vbd.Rectangle ({
				bounds: bounds,
				strokeOpacity: 0.3
			});
			rect.setMap(map);
			overlays.push(rect);
			rectArray.splice(0, 2);
			return;
		}		
	}

	function addCir (map, position) {
		addMarker(map, position);
		var circle = new vbd.Circle({
			center: position,
			radius: 500
		});
		circle.setMap(map);
		overlays.push(circle);
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

	function clearOVL(array) {
		for (var i=0; i < array.length; i++) {
			console.log(array[i]);
			array[i].setMap(null);
		}
		array.splice(0, array.length);
	}

}

vbd.event.addDomListener(window, 'load', init);



