/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global app, alert, 
	CMYKColor, SpotColor, NoColor, StrokeJoin, StrokeCap, Justification, textFonts, ElementPlacement, Transformation, InkPrintStatus,
	ptsToMM, ptsToInches, getTime, anchorAt, getSelSize,
	prepLayer, prereqCheck,
	newCMYKcolor, colorExists
*/

function prepLayer(layerName) {
  var layerRef = app.activeDocument.layers.getByName(layerName);
  layerRef.locked = false;
  layerRef.visible = true;
  return layerRef;
}

// takes & compares prerequisites, displays message, returns bool
function prereqCheck(alertRef, selected, selectionCount, selectionTypeName, layersNeeded, colorsNeeded) {
  var message = '';
  var plural = '';
  var i, thisItem, thisLayer, thisColor;
  
  //selection
  if (selected !== '') {
    //selection count
    if (selectionCount !== '') {
      if (selectionCount > 1) {
        plural = 's';
      }
      if (selected.length !== selectionCount) {
        message = message + '\n\n Please select exactly ' + selectionCount + ' item' + plural + '.';
      }
    }
    
    //selection typeName
    for (i = 0; i < selected; i++) {
      thisItem = selected[i];
      if (thisItem.typename !== selectionTypeName) {
        message = message + '\n\n Please select only ' + selectionTypeName + ' objects.';
      }
    }
  }

  //layers exist
  for (i = 0; i < layersNeeded.length; i++) {
    thisLayer = layersNeeded[i];
    if (!layerExists(thisLayer)) {
      message = message + '\n\n Please create a "' + thisLayer + '" layer.';
    }
  }
  //colors exist
  for (i = 0; i < colorsNeeded.length; i++) {
    thisColor = colorsNeeded[i];
    if (!colorExists(thisColor)) {
      message = message + '\n\n Please create a "' + thisColor + '" swatch.';
    }
  }
  
  if (message === '') {
    return true;
  } else {
    alert(alertRef + message);
    return false;
  }
}