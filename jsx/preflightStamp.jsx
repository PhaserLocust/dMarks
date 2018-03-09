/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global app, alert, jobNumber:true, 
	CMYKColor, SpotColor, NoColor, StrokeJoin, StrokeCap, Justification, textFonts, ElementPlacement, Transformation, InkPrintStatus,
	ptsToMM, ptsToInches, getTime, anchorAt, getSelSize, getVisChars,
	prepLayer, prereqCheck,
	newCMYKcolor, colorExists, inksList,
	pfDialog
*/

/* note functions used in main.js with csInterface.evalScript() begin with 'eval' */


//// Below @includes add funtions listed in above global statement ////
//// functions listed as globals for eslinting                     ////

// adds custom dialog function:
//@include "preflightStamp_ui.jsx";

//////////////////////////////////////////

// return printing inks from the current document, to be used in preflight stamp
function eval_InksForStamp() {
	var doc = app.activeDocument;
	var sel = doc.selection;
	var selCt = sel.length
	var txt = (selCt > 1) ? "layer" : "layers";
	var message = "|) Marks - Preflight Stamp\n\n Ignore " + txt + " of current selection?"

	if (selCt === 0 || !confirm(message))  {
		return JSON.stringify(inksList(doc));
	}
	
	// hide layers to ignore
	var i;
	var layers = [];
	for (i = 0; i < selCt; i++) {
		layers.push(sel[i].layer);
		layers[i].visible = false;
	}
	
	// get those lil' inks
	var inks = JSON.stringify(inksList(doc));
	
	// make ignored layers visible, restore selection
	for (i = 0; i < selCt; i++) {
		layers[i].visible = true;
	}
	doc.selection = sel;
	
	return inks;
}

function eval_preflightStamp(data) {
	//var alertRef = "|) Marks - Preflight Stamp";
  var doc = app.activeDocument;
  var sel = doc.selection;
	var gBounds = doc.geometricBounds;
  //if (!prereqCheck(alertRef, sel, '', 'PathItem', [''], [])) { return; }
	
	// get information from user via custom dialog box
	
	
	
	
	var theResult = new pfDialog().run();
	
	
	
	
	alert("dialog success!");
	alert(theResult);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// get job ref from user
	do {
		jobNumber = prompt("|) Marks - Preflight Stamp\n\nGtG or Job#: ", jobNumber.substring(0, 6));
		if (jobNumber === null) {  // cancel
			jobNumber = "";
			return;
		}
	} while (jobNumber.length > 6);
	
	// get note from user
	var note = prompt("|) Marks - Preflight Stamp\n\Note: ", "");
  if (note === null) { return; } // cancel
	
	// make new layer, maybe use com.rps.dlayers for proper placement?
	var newLayer = doc.layers.add();
  newLayer.name = 'Preflight - CL&D Digital';
	
	// make new group
	var stampGroup = prepLayer('Preflight - CL&D Digital').groupItems.add();
  stampGroup.name = '|) Preflight Stamp';
	var textGroup = stampGroup.groupItems.add();
	textGroup.name = 'File Information';
	
	// make file name text
  var nameText = textGroup.textFrames.add();
	var name = doc.name;
	var linesAdded = 0;
	if (name.length > 25) {
		// add line breaks every 25 characters
		var splitName = name.substr(0, 25);
		for (i = 25; i < name.length; i += 25) {
			splitName += "\n" + name.substr(i, i + 25);
			linesAdded++;
		}
		nameText.contents = splitName;
	} else {
		nameText.contents = name;
	}
	anchorAt(nameText, 85, -13.5);
  nameText.textRange.paragraphAttributes.justification = Justification.CENTER;
  nameText.textRange.characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
  nameText.textRange.characterAttributes.size = 14;
  nameText.textRange.characterAttributes.textFont = textFonts.getByName("Avenir-Heavy");
	nameText.textRange.characterAttributes.autoLeading = false;
	nameText.textRange.characterAttributes.leading = 14;
	while (nameText.width > 170) {
		nameText.textRange.characterAttributes.size = nameText.textRange.characterAttributes.size - .5;
		nameText.textRange.characterAttributes.leading = nameText.textRange.characterAttributes.leading - .5;
	}
	
	// set next pos by nameText height
	var yPos = -13.5 - (linesAdded * nameText.textRange.characterAttributes.size) - 14.5;
	
	// make date text
	var now = new Date();
	var dateText = textGroup.textFrames.add();
  dateText.contents = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear().toString().slice(-2) + ' ' + getTime(now);
	anchorAt(dateText, 164, yPos);
  dateText.paragraphs[0].paragraphAttributes.justification = Justification.RIGHT;
  dateText.paragraphs[0].characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
  dateText.paragraphs[0].characterAttributes.size = 12;
  dateText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
	
	dateText.move(nameText, ElementPlacement.PLACEAFTER);
	
	// make job/gtg text
	var preText = textGroup.textFrames.add();
  preText.contents = 'Job#' + jobNumber;
	anchorAt(preText, 6, yPos);
  preText.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
  preText.paragraphs[0].characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
  preText.paragraphs[0].characterAttributes.size = 12;
  preText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
	
	preText.move(nameText, ElementPlacement.PLACEAFTER);
		
	// make initial text - to do
	
	// make dimensions text
	var dimGroup = textGroup.groupItems.add();
  dimGroup.name = 'Dimensions';
	var size = getSelSize(sel);
	var dimText;
	if (size.w != 0 && size.h != 0) {
		// mm
		dimText = dimGroup.textFrames.add();
		dimText.contents = '(' + ptsToMM(size.w, 3) + 'mm x ' + ptsToMM(size.h, 3) + 'mm)';
		anchorAt(dimText, 85, yPos - 26.5);
		dimText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
		dimText.paragraphs[0].characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
		dimText.paragraphs[0].characterAttributes.size = 12;
		dimText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
		// inches
		dimText = dimGroup.textFrames.add();
		dimText.contents = ptsToInches(size.w, 4) + '" x ' + ptsToInches(size.h, 4) + '"';
		anchorAt(dimText, 32, yPos - 14.5);
		dimText.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
		dimText.paragraphs[0].characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
		dimText.paragraphs[0].characterAttributes.size = 12;
		dimText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
		
		dimText = dimGroup.textFrames.add();
		dimText.contents = 'Size:';
		anchorAt(dimText, 6, yPos - 14.5);
		dimText.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
		dimText.paragraphs[0].characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
		dimText.paragraphs[0].characterAttributes.size = 12;
		dimText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Medium");

		dimGroup.move(preText, ElementPlacement.PLACEAFTER);
	} else {
		yPos += 26.5; // adjust for shorter textGroup section height
	}
	
	// make background rectangle
	var rectRef = textGroup.pathItems.rectangle(0, 0, 170, -yPos + 32);
	rectRef.name = 'background';
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(0, 0, 0, 0);
	rectRef.fillOverprint = false;
	rectRef.opacity = 75.0;
	rectRef.move(textGroup, ElementPlacement.PLACEATEND);
		
	// make color art
	if (data.length > 0) {
		var colorsGroup = stampGroup.groupItems.add();
		colorsGroup.name = 'Color Information';
	}
	
	var i, thisColor;
	yPos += -32;
	for (i = 0; i < data.length; i++) {
		thisColor = preflightCol(doc, colorsGroup, data[i]);
		thisColor.position = [0, yPos];
		if (thisColor.height < 20) {
			yPos = yPos - 5 - 12;
		} else {
			yPos = yPos - 5 - 26;
		}
	}
	
	// preflight checkboxes
	
	
	
	// make note text & background
	// if no user input, leave blank for manual entry
	var noteGroup = stampGroup.groupItems.add();
	noteGroup.name = 'Notes';
		
	rectRef = noteGroup.pathItems.rectangle(yPos - 5, 6, 158, 14.5);
	var noteText = noteGroup.textFrames.areaText(rectRef);
	(note != '') ? noteText.contents = note : noteText.contents = "                                               ";
	noteText.name = 'Note Contents';
	noteText.textRange.paragraphAttributes.justification = Justification.LEFT;
	noteText.textRange.characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 100);
	noteText.textRange.characterAttributes.size = 12;
	noteText.textRange.characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
	noteText.textRange.characterAttributes.autoLeading = false;
	noteText.textRange.characterAttributes.leading = 13;
	
	var visChars = getVisChars(noteText);
	var lastCount = 0;
	// character count minus paragraph chars
	var totalChars = noteText.contents.length - (noteText.paragraphs.length - 1);
	
	while (visChars < totalChars && visChars != lastCount) {
		alert('vis=' + visChars + '  total=' + totalChars);
		rectRef.height += 13;
		lastCount = visChars;
		visChars = getVisChars(noteText);
	}
	
	var pathRef = noteGroup.pathItems.add(); // divider
	pathRef.setEntirePath([[0, yPos], [170, yPos]]);
	pathRef.stroked = true;
	pathRef.filled = false;
	pathRef.strokeColor = newCMYKcolor(0, 0, 0, 100);
	pathRef.strokeWidth = .5;
	
	rectRef = noteGroup.pathItems.rectangle(yPos, 0, 170, (rectRef.height + 5));
	rectRef.name = 'background';
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(0, 0, 0, 0);
	rectRef.fillOverprint = false;
	rectRef.opacity = 75.0;
	rectRef.move(noteText, ElementPlacement.PLACEAFTER);
	
	noteGroup.move(stampGroup, ElementPlacement.PLACEATBEGINNING);
	
	// scale stamp to correct size for legibility when printed at reduced size
	var gW = gBounds[2] - gBounds[0];
	var gH = gBounds[1] - gBounds[3];

	var scaleBy;
	if (gW > gH) {
		// hor.
		scaleBy = (612 / gH > 792 / gW) ? (1 / (792 / gW)) * 100 : (1 / (612 / gH)) * 100;
		if (scaleBy > 100) {
			stampGroup.resize(scaleBy, scaleBy)
		}
	} else if (gH > gW) {
		// vert.
		scaleBy = (792 / gH > 612 / gW) ? (1 / (612 / gW)) * 100 : (1 / (792 / gH)) * 100;
		if (scaleBy > 100) {
			stampGroup.resize(scaleBy, scaleBy)
		}
	}
	
	// position stamp
	stampGroup.position = [gBounds[0] - stampGroup.width - 25, gBounds[1]];
	
	doc.selection = stampGroup;
}

// creates info section for given color
function preflightCol(doc, stampGroup, data) {
	var cmykogv = [
		newCMYKcolor(100, 0, 0, 0),
		newCMYKcolor(0, 100, 0, 0),
		newCMYKcolor(0, 0, 100, 0),
		newCMYKcolor(0, 0, 0, 100),
		newCMYKcolor(0, 50, 100, 0),
		newCMYKcolor(100, 0, 100, 0),
		newCMYKcolor(100, 100, 0, 0)
	];
	
	// make new group
	var colGroup = stampGroup.groupItems.add()
	colGroup.name = data.name;
	
	// make divider line
	var pathRef = colGroup.pathItems.add();
	pathRef.setEntirePath([[0, 0], [170, 0]]);
	pathRef.stroked = true;
	pathRef.filled = false;
	pathRef.strokeColor = cmykogv[3];
	pathRef.strokeWidth = .5;
	
	var swatchColor;
	var spotErr = false;
	if (data.swatch === 'Process Cyan') {
		swatchColor = cmykogv[0];
		makeCirc('Cyan', swatchColor, colGroup);
	} else if (data.swatch === 'Process Magenta') {
		swatchColor = cmykogv[1];
		makeCirc('Magenta', swatchColor, colGroup);
	} else if (data.swatch === 'Process Yellow') {
		swatchColor = cmykogv[2];
		makeCirc('Yellow', swatchColor, colGroup);
	} else if (data.swatch === 'Process Black') {
		swatchColor = cmykogv[3];
		makeCirc('Black', swatchColor, colGroup);
	} else {
		swatchColor = new SpotColor();
		try {
			swatchColor.spot = doc.spots.getByName(data.swatch);
			swatchColor.tint = 100;
			makeRecOGV(data, colGroup);
		} catch (e) { // catch deleted global colors
			//alert(e);
			spotErr = true;
			swatchColor = cmykogv[3];
			makeTxtCirc(colGroup, newCMYKcolor(0, 100, 100, 0), '!', cmykogv[2]);
		}
	}
	
	// make color name point text
  var nameText = colGroup.textFrames.add();
  nameText.contents = data.swatch;
  nameText.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
  nameText.paragraphs[0].characterAttributes.fillColor = cmykogv[3];
  nameText.paragraphs[0].characterAttributes.size = 12;
  nameText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Medium");
	nameText.resize(85.0, 100.0);
	anchorAt(nameText, 16, -12.5);
	while (nameText.width > 142) {
		nameText.paragraphs[0].characterAttributes.size = nameText.paragraphs[0].characterAttributes.size - 1;
	}
	
	// make pantone color build information
	var recHt = 12;
	if (data.scrapeData) {
		var i, thisVal, val, op, valText;
		var x = 15;
		var y = -22.25 - 2.5;
		recHt = 26;
		if (data.scrapeData.c_cmyk) {
			for (i = 0; i < 4; i++) {
				thisVal = data.scrapeData.c_cmyk[i];
				valText = colGroup.textFrames.add();
				val = (thisVal < 10) ? '0' + thisVal : thisVal;
				valText.contents = val;
				op = (thisVal === 0) ? 50 : 100;
				valText.opacity = op;
				valText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
				valText.paragraphs[0].characterAttributes.fillColor = cmykogv[3];
				valText.paragraphs[0].characterAttributes.size = 10;
				valText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Monaco");
				if (thisVal === 100) {valText.resize(75.0, 100.0)}
				anchorAt(valText, x, y);
				rectRef = colGroup.pathItems.rectangle(y - 1, x - 6, 12, 2.75);
				rectRef.stroked = false;
				rectRef.filled = true;
				rectRef.fillColor = cmykogv[i];
				rectRef.fillOverprint = false;
				rectRef.opacity = 100.0;
				x += 14;
			}
		}
		x += 6;
		if (data.scrapeData.xgc_cmykogv) {
			for (i = 0; i < 7; i++) {
				thisVal = data.scrapeData.xgc_cmykogv[i];
				valText = colGroup.textFrames.add();
				val = (thisVal < 10) ? '0' + thisVal : thisVal;
				valText.contents = val;
				op = (thisVal === 0) ? 50 : 100;
				valText.opacity = op;
				valText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
				valText.paragraphs[0].characterAttributes.fillColor = cmykogv[3];
				valText.paragraphs[0].characterAttributes.size = 10;
				valText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Monaco");
				if (thisVal === 100) {valText.resize(75.0, 100.0)}
				anchorAt(valText, x, y);
				rectRef = colGroup.pathItems.rectangle(y - 1, x - 6, 12, 2.75);
				rectRef.stroked = false;
				rectRef.filled = true;
				rectRef.fillColor = cmykogv[i];
				rectRef.fillOverprint = false;
				rectRef.opacity = 100.0;
				x += 14;
			}
		}
	}
	
	// make color rectangle
	var rectRef = colGroup.pathItems.rectangle(-2.5, 0, 2, recHt);
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = swatchColor;
	rectRef.fillOverprint = false;
	rectRef.opacity = 100.0;
	
	// make trailing color rect
	if (!spotErr) {
		rectRef = rectRef.duplicate(rectRef, ElementPlacement.PLACEAFTER);
		rectRef.width = 12 + (142 - nameText.width) - 3;
		rectRef.height = 12;
		rectRef.translate(nameText.position[0] + nameText.width + 3);
	}
	
	/*
	// make error text if needed
	if (spotErr) {
		var errText = colGroup.textFrames.add();
		errText.contents = ':(';
		errText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
		errText.paragraphs[0].characterAttributes.fillColor = newCMYKcolor(0, 0, 0, 0);
		errText.paragraphs[0].characterAttributes.size = 10;
		errText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Medium");
		errText.resize(85.0, 100.0);
		anchorAt(errText, 170 - (rectRef.width / 2), -12);
	}
	*/
	
	// make background rect
	rectRef = colGroup.pathItems.rectangle(0, 0, 170, recHt + 5);
	rectRef.name = 'background';
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(0, 0, 0, 0);
	rectRef.fillOverprint = false;
	rectRef.opacity = 75.0;
	rectRef.move(pathRef, ElementPlacement.PLACEAFTER);
	
	return colGroup;
}

// create the circle showing color build recommemdation
function makeRecOGV(data, colGroup) {
	if (data.recommendOrange) {
		makeCirc('Orange', newCMYKcolor(0, 50, 100, 0), colGroup);
	} else if (data.recommendGreen) {
		makeCirc('Green', newCMYKcolor(100, 0, 100, 0), colGroup);
	} else if (data.recommendViolet) {
		makeCirc('Violet', newCMYKcolor(100, 100, 0, 0), colGroup);
	} else if (data.kind) {
		// color matched in database, so CMYK known
		makeCMYKcirc(colGroup);
	} else {
		// color not in database, no recommendation
		makeTxtCirc(colGroup, newCMYKcolor(0, 0, 0, 66), '?', newCMYKcolor(0, 0, 0, 0));
	}
}

function makeCirc(name, color, colGroup) {
	var ellipsRef = colGroup.pathItems.ellipse(-3, 3.5, 11, 11);
	ellipsRef.name = name
	ellipsRef.stroked = false;
	ellipsRef.filled = true;
	ellipsRef.fillColor = color;
	ellipsRef.fillOverprint = false;
	ellipsRef.opacity = 100.0;
	return ellipsRef;
}

function makeCMYKcirc(colGroup) {
	var circGroup = colGroup.groupItems.add()
	circGroup.name = 'CMYK';
	
	var rectRef = circGroup.pathItems.rectangle(-3, 3.5, 5.5, 5.5);
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(100, 0, 0, 0);
	rectRef.fillOverprint = false;
	rectRef.opacity = 100.0;
	
	rectRef = circGroup.pathItems.rectangle(-3, 9, 5.5, 5.5);
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(0, 100, 0, 0);
	rectRef.fillOverprint = false;
	rectRef.opacity = 100.0;
	
	rectRef = circGroup.pathItems.rectangle(-8.5, 3.5, 5.5, 5.5);
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(0, 0, 100, 0);
	rectRef.fillOverprint = false;
	rectRef.opacity = 100.0;
	
	rectRef = circGroup.pathItems.rectangle(-8.5, 9, 5.5, 5.5);
	rectRef.stroked = false;
	rectRef.filled = true;
	rectRef.fillColor = newCMYKcolor(0, 0, 0, 100);
	rectRef.fillOverprint = false;
	rectRef.opacity = 100.0;
	
	var ellipsRef = circGroup.pathItems.ellipse(-3, 3.5, 11, 11);
	ellipsRef.stroked = false;
	ellipsRef.filled = false;
	
	circGroup.clipped = true;
	
	return circGroup;
}

function makeTxtCirc(colGroup, color, text, textColor) {
	var circGroup = colGroup.groupItems.add()
	circGroup.name = text;
	
	makeCirc('Circle', color, circGroup);
	
	var qMarkText = circGroup.textFrames.add();
  qMarkText.contents = text;
  qMarkText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
  qMarkText.paragraphs[0].characterAttributes.fillColor = textColor;
  qMarkText.paragraphs[0].characterAttributes.size = 12;
  qMarkText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Medium");
	anchorAt(qMarkText, 9, -12.75);
	qMarkText.createOutline();
	
	return circGroup;
}