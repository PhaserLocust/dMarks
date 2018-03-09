/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global app, alert, 
	CMYKColor, SpotColor, NoColor, StrokeJoin, StrokeCap, Justification, textFonts, ElementPlacement, Transformation, InkPrintStatus, ColorModel,
	ptsToMM, ptsToInches, getTime, anchorAt, getSelSize,
	prepLayer, prereqCheck,
	newCMYKcolor, colorExists
*/

// returns new cmyk color given cmyk values
function newCMYKcolor(c, m, y, k) {
  var newCMYKColor = new CMYKColor();
  newCMYKColor.black = k;
  newCMYKColor.cyan = c;
  newCMYKColor.magenta = m;
  newCMYKColor.yellow = y;
  return newCMYKColor;
}

// check if given color exists, returns bool
function colorExists(colorName) {
  var colorList = app.activeDocument.swatches;
  var i;
  for (i = 0; i < colorList.length; i++) {
    if (colorList[i].name === colorName) {
      return true;
    }
  }
  return false;
}

// return list of all separation inks used by current document's current state
// filters inks by printingStatus property, inks on non-printing and hidden layers are ignored
// returned list will include process CMY&K inks...
function inksList(doc) {
	var inkCount = doc.inkList.length;
	var i, thisInk, inkList = [];
	for(i = 0; i < inkCount; i++) {
		thisInk = doc.inkList[i];
		if (thisInk.inkInfo.printingStatus === InkPrintStatus.ENABLEINK) {
			inkList.push(thisInk.name);
		}
  }
	return inkList;
}

// return list of all global process colors in document
// list includes all in doc, if they are used or not
function globalProcessList(doc) {
	var spotCount = doc.spots.length;
	var i, thisSpot, spotList = [];
	for(i = 0; i < spotCount; i++) {
		thisSpot = doc.spots[i];
		if (thisSpot.colorType === ColorModel.PROCESS) {
			spotList.push(thisSpot.name);
		}
  }
	return spotList;
}