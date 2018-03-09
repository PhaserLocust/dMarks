function roundTo(decimalPlaces, number) {
	var factor = Math.pow(10, decimalPlaces),
		tempNum = number * factor,
		roundedTempNum = Math.round(tempNum);
	return roundedTempNum / factor;
}

function ptsToMM(points, decimalPlaces) {
	return roundTo(decimalPlaces, points / 2.83464567);
}

function ptsToInches(points, decimalPlaces) {
	return roundTo(decimalPlaces, 0.01388889 * points);
}

// return 'mm:hh am' time given date obj
function getTime(date) {
	var hr = date.getHours() === 0 ? 12 : date.getHours();
	var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); 
	if (hr > 12) {
		hr = hr - 12;
	}
	var m = date.getHours() < 12 ? 'am' : 'pm';
	
	return hr + ':' + min + m;
}

// repostition point text via anchor coords:
function anchorAt(txt,x,y) {
	txt.position=[x-(txt.anchor[0]-txt.position[0]),(txt.position[1]-txt.anchor[1])+y];
}

// get size of selection, returns object of width & height in points
function getSelSize(sel) {
	var selCount = sel.length;
	if (selCount === 0) {
		return {w: 0, h: 0};
	}
	var i, thisObjGB;
	var left = sel[0].geometricBounds[0],
			top = sel[0].geometricBounds[1],
			right = sel[0].geometricBounds[2],
			bottom = sel[0].geometricBounds[3];
	for (i = 1; i < selCount; i++) {
		thisObjGB = sel[i].geometricBounds;
		if (thisObjGB[0] < left) {left = thisObjGB[0]}
		if (thisObjGB[1] > top) {top = thisObjGB[1]}
		if (thisObjGB[2] > right) {right = thisObjGB[2]}
		if (thisObjGB[3] < bottom) {bottom = thisObjGB[3]}
	}
	
	var w = Math.abs(right - left) 
	var h = Math.abs(top - bottom);
	
	return {w: w, h: h};
}

// returns the count of characters visible in a given text frame
// does not include paragraph characters!
function getVisChars(frame) {
	var visChars = 0;
	var i;
	for (i=0; i < frame.lines.length; i++) {
		visChars += frame.lines[i].length;
	}
	return visChars;
}