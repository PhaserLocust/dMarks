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