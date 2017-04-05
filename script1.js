var myarray = new vietbando.MVCArray();

var hanoi = new vietbando.LatLng(21.051181240269386, 105.8148193359375);
var nghean = new vietbando.LatLng(19.36297613334183, 105.435791015625);
var quangbinh = new vietbando.LatLng(17.486911100806864, 106.6058349609375); 
var danang = new vietbando.LatLng(16.056371485561684, 108.2098388671875);
var khanhhoa = new vietbando.LatLng(12.297068292853808, 109.15191650390625);
var saigon = new vietbando.LatLng(10.860281096281653, 106.754150390625);
var camau = new vietbando.LatLng(9.221404620134237, 105.1446533203125);

/*MVCarray version*/
myarray.push(khanhhoa);
myarray.push(saigon);
myarray.push(danang);
myarray.push(hanoi);
console.log("length is " + myarray.getLength());
for (var i=0; i<myarray.getLength(); i++) {
	console.log("value of cell " + i + " is " + myarray.getAt(i));
}
console.log("***********");
myarray.removeAt(1);
console.log("length is " + myarray.getLength());
for (var j=0; j<myarray.getLength(); j++) {
	console.log("value of cell " + j + " is " + myarray.getAt(j));
}


/*array version*/
//myarray = [khanhhoa, saigon, danang, hanoi];
/*this first declaration statement changes MVCarray back to array*/
/*myarray = [khanhhoa]; 
myarray.push(saigon, danang, hanoi);
console.log("length is " + myarray.length);
for (var i=0; i<myarray.length; i++) {
	console.log("value of cell " + i + " is " + myarray[i]);
}
console.log("***********");
myarray.splice(1,1);
for (var j=0; j<myarray.length; j++) {
	console.log("value of cell " + j + " is " + myarray[j]);
}
*/