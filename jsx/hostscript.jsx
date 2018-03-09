/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global app, alert, 
	CMYKColor, SpotColor, NoColor, StrokeJoin, StrokeCap, Justification, textFonts, ElementPlacement, Transformation, InkPrintStatus,
	ptsToMM, ptsToInches, getTime, anchorAt, getSelSize, getVisChars,
	prepLayer, prereqCheck,
	newCMYKcolor, colorExists, inksList
*/

/* note functions used in main.js with csInterface.evalScript() begin with 'eval' */


//// Below @includes add funtions listed in above global statement ////
//// functions listed as globals for eslinting                     ////

// adds JSON functionality to .jsx, for formatting complex objects to return:
//@include "json2.jsx";

// helper functions
//@include 'helpers.jsx'

// user interaction functions
//@include 'dialogs.jsx'

// prep functions
//@include 'prepFunctions.jsx'

// color functions
//@include 'colors.jsx'

// preflight Stamp
//@include 'preflightStamp.jsx'

//////////////////////////////////////////

// job/GtG variable, used in Preflight stamp, persists as default prompt value
var jobNumber = '';

// returns bool as string
function eval_docIsOpen() {
  return app.documents.length > 0 ? 'true' : 'false';
}

function layerExists(layerName) {
  var layerList = app.activeDocument.layers;
  var i;
  for (i = 0; i < layerList.length; i++) {
    if (layerList[i].name === layerName) {
      return true;
    }
  }
  return false;
}

// creates a new path item using given info
function addPath(layerRef, pathPts, pathProps, rotation, pathPos, pathName) {
  var newPath = layerRef.pathItems.add();
  newPath.setEntirePath(pathPts);
  var theProp;
  for (theProp in pathProps) {
    if (pathProps.hasOwnProperty(theProp)) {
      newPath[theProp] = pathProps[theProp];
    }
  }
  if (rotation !== '') {
    newPath.rotate(rotation);
  }
  if (pathPos !== '') {
    newPath.position = pathPos;
  }
  newPath.name = pathName;
  return newPath;
}

// returns object with only relevant properties of given pathRef
function selObj(pathRef) {
  var selectedObj = {
    pos: pathRef.position,
    x: pathRef.position[0],
    y: pathRef.position[1],
    ht: pathRef.height,
    wd: pathRef.width,
    lyr: pathRef.layer
  };
  return selectedObj;
}

function eval_cornerCut(type) {
  var doc = app.activeDocument;
  var sel = doc.selection;
  var alertRef, groupName;
  if (type === "") {
    alertRef = "|) Marks - Corner Cut Marks";
    groupName = "|) Corner Cut";
  } else if (type === "InvL") {
    alertRef = "|) Marks - Corner Cut Marks, Landscape";
    groupName = "|) Corner Cut, Landscape";
  } else if (type === "InvP") {
    alertRef = "|) Marks - Corner Cut Marks, Portrait";
    groupName = "|) Corner Cut, Portrait";
  }
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', ["Job Finishing Marks - CL&D Digital"], ["Indigo Die"])) {
    return;
  }
  sel = selObj(sel[0]);
  var dieColor = new SpotColor();
  dieColor.spot = doc.spots.getByName("Indigo Die");
  dieColor.tint = 100;
  var cornerPts = [[-1, 1], [9, 1], [9, 0], [0, 0], [0, -9], [-1, -9]];
  var cornerProps = {
    closed: true,
    stroked: false,
    filled: true,
    fillColor: dieColor,
    fillOverprint: false
  };
  var mkLayer = prepLayer("Job Finishing Marks - CL&D Digital");
  
  var newGroup = mkLayer.groupItems.add();
  newGroup.name = groupName;
  
  if (type === "") {
    addPath(newGroup, cornerPts, cornerProps, -180, [sel.x + sel.wd - 9, sel.y - sel.ht + 9], "bottom right");
    addPath(newGroup, cornerPts, cornerProps, -270, [sel.x - 1, sel.y - sel.ht + 9], "bottom left");
    addPath(newGroup, cornerPts, cornerProps, -90, [sel.x + sel.wd - 9, sel.y + 1], "top right");
    addPath(newGroup, cornerPts, cornerProps, '', [sel.x - 1, sel.y + 1], "top left");
  } else if (type === "InvL") {
    addPath(newGroup, cornerPts, cornerProps, -90, [sel.x + sel.wd - 9, sel.y - sel.ht], "bottom right");
    addPath(newGroup, cornerPts, cornerProps, '', [sel.x - 1, sel.y - sel.ht], "bottom left");
    addPath(newGroup, cornerPts, cornerProps, -180, [sel.x + sel.wd - 9, sel.y + 10], "top right");
    addPath(newGroup, cornerPts, cornerProps, -270, [sel.x - 1, sel.y + 10], "top left");
  } else if (type === "InvP") {
    addPath(newGroup, cornerPts, cornerProps, -270, [sel.x + sel.wd, sel.y - sel.ht + 9], "bottom right");
    addPath(newGroup, cornerPts, cornerProps, -180, [sel.x - 10, sel.y - sel.ht + 9], "bottom left");
    addPath(newGroup, cornerPts, cornerProps, '', [sel.x + sel.wd, sel.y + 1], "top right");
    addPath(newGroup, cornerPts, cornerProps, -90, [sel.x - 10, sel.y + 1], "top left");
  }
  doc.selection = null;
}

function eval_cameraMarks() {
  var alertRef = "|) Marks - Camera Marks";
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', ["Camera Marks - CL&D Digital"], ["5Indigo", "IndigoK"])) {
    return;
  }
  sel = selObj(sel[0]);
  var wtColor = new SpotColor();
  wtColor.spot = doc.spots.getByName("5Indigo");
  wtColor.tint = 100;
  var blkColor = new SpotColor();
  blkColor.spot = doc.spots.getByName("IndigoK");
  blkColor.tint = 100;
  var camLayer = prepLayer("Camera Marks - CL&D Digital");
  var pathProps = {
    closed: true,
    stroked: false,
    filled: true,
    fillOverprint: true
  };
  var newGroup = camLayer.groupItems.add();
  newGroup.name = "|) Camera Marks";
  
  var positions = [
    [sel.x - 54, sel.y + 54],
    [sel.x + sel.wd + 9, sel.y + 54],
    [sel.x - 54, sel.y - sel.ht - 9],
    [sel.x + sel.wd + 9, sel.y - sel.ht - 9]
  ];
  
  var i, x, y;
  for (i = 0; i < positions.length; i++) {
    x = positions[i][0];
    y = positions[i][1];
    
    var markGroup = newGroup.groupItems.add();
    markGroup.name = "Camera Mark";

    var newRect = markGroup.pathItems.rectangle(y, x, 45, 45, false);
    var theProp;
    for (theProp in pathProps) {
      if (pathProps.hasOwnProperty(theProp)) {
        newRect[theProp] = pathProps[theProp];
      }
    }
    newRect.fillColor = wtColor;
    newRect.name = "White";
    
    var newCirc = markGroup.pathItems.ellipse(y - 13.5, x + 13.5, 18, 18, false);
    for (theProp in pathProps) {
      if (pathProps.hasOwnProperty(theProp)) {
        newCirc[theProp] = pathProps[theProp];
      }
    }
    newCirc.fillColor = blkColor;
    newCirc.name = "Circle";
  }
  doc.selection = null;
}

function eval_encloseRect() {
  var alertRef = "|) Marks - Enclosing Rectangle";
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', [], ["IndigoK"])) {
    return;
  }
  sel = selObj(sel[0]);
  var noColor = new NoColor();
  var blkColor = new SpotColor();
  blkColor.spot = doc.spots.getByName("IndigoK");
  blkColor.tint = 100;
  var pathProps = {
    closed: true,
    stroked: true,
    strokeColor: blkColor,
    strokeOverprint: false,
    strokeWidth: 0.5,
    strokeJoin: StrokeJoin.MITERENDJOIN,
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  
  var newRect = sel.lyr.pathItems.rectangle(sel.y, sel.x, sel.wd, sel.ht, false);
  newRect.move(doc.selection[0], ElementPlacement.PLACEBEFORE);
  var theProp;
  for (theProp in pathProps) {
    if (pathProps.hasOwnProperty(theProp)) {
      newRect[theProp] = pathProps[theProp];
    }
  }
  newRect.name = "|) Enclosing Rectangle";
  doc.selection = null;
}

function eval_cutterGuides() {
  var alertRef = "|) Marks - Cutter Guides";
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', ["Cutter Guide - CL&D Digital"], ["IndigoK"])) {
    return;
  }
  sel = selObj(sel[0]);
  var noColor = new NoColor();
  var blkColor = new SpotColor();
  blkColor.spot = doc.spots.getByName("IndigoK");
  blkColor.tint = 100;
  var guideLayer = prepLayer("Cutter Guide - CL&D Digital");
  var pathProps = {
    closed: true,
    stroked: true,
    strokeColor: blkColor,
    strokeOverprint: false,
    strokeWidth: 0.5,
    strokeJoin: StrokeJoin.MITERENDJOIN,
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var guideGroup = guideLayer.groupItems.add();
  guideGroup.name = "|) Cutter Guide";
  
  var newRect = guideGroup.pathItems.rectangle(sel.y + 4.5, sel.x - 4.5,
                         sel.wd + 9, sel.ht + 9, false);
  var theProp;
  for (theProp in pathProps) {
    if (pathProps.hasOwnProperty(theProp)) {
      newRect[theProp] = pathProps[theProp];
    }
  }
  newRect.name = "Rectangle Guide";
  
  var newPath = doc.selection[0].duplicate(guideGroup, ElementPlacement.INSIDE);
  doc.selection = [newPath];
  for (theProp in pathProps) {
    if (pathProps.hasOwnProperty(theProp)) {
      newPath[theProp] = pathProps[theProp];
    }
  }
  newPath.name = "Contour Guide";
  // apply offset effect, jntp 2 = mitre, 1 = bevel, 0 = round
  var xmlstring = '<LiveEffect name="Adobe Offset Path"><Dict data="R mlim 4 R ofst 4.5 I jntp 0"/></LiveEffect>';
  newPath.applyEffect(xmlstring);
  app.redraw();
  app.executeMenuCommand('expandStyle');
  doc.selection = null;
}

function eval_sleeveInfo(clearSide) {
  var alertRef = "|) Marks - Sleeve Info";
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', ["Info - CL&D Digital", "Slit - CL&D Digital", "Substrate - CL&D Digital"], ["5Indigo", "IndigoK", "Indigo Substrate"])) {
    return;
  }
  sel = selObj(sel[0]);
  var noColor = new NoColor();
  var wtColor = new SpotColor();
  wtColor.spot = doc.spots.getByName("5Indigo");
  wtColor.tint = 100;
  var blkColor = new SpotColor();
  blkColor.spot = doc.spots.getByName("IndigoK");
  blkColor.tint = 100;
  var dimColor = newCMYKcolor(75, 0, 100, 0);
  var dimPthProps = {
    closed: false,
    stroked: true,
    strokeOverprint: false,
    strokeWidth: 0.5,
    strokeColor: dimColor,
    strokeCap: StrokeCap.BUTTENDCAP,
    strokeDashes: [],
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var arwPthProps = {
    closed: true,
    stroked: false,
    strokeOverprint: false,
    filled: true,
    fillColor: dimColor,
    fillOverprint: false
  };
  var locColor = newCMYKcolor(0, 100, 0, 0);
  var locPthProps = {
    closed: false,
    stroked: true,
    strokeOverprint: false,
    strokeWidth: 0.5,
    strokeColor: locColor,
    strokeCap: StrokeCap.BUTTENDCAP,
    strokeDashes: [3, 2],
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var substColor = new SpotColor();
  substColor.spot = doc.spots.getByName("Indigo Substrate");
  substColor.tint = 100;
  var substProps = {
    closed: true,
    stroked: false,
    filled: true,
    fillColor: substColor,
    fillOverprint: false
  };
  var sltPth1Props = {
    closed: false,
    stroked: true,
    strokeOverprint: false,
    strokeWidth: 1,
    strokeColor: blkColor,
    strokeCap: StrokeCap.BUTTENDCAP,
    strokeDashes: [],
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var sltPth2Props = {
    closed: false,
    stroked: true,
    strokeOverprint: false,
    strokeWidth: 1,
    strokeColor: wtColor,
    strokeCap: StrokeCap.BUTTENDCAP,
    strokeDashes: [12],
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var infoLayer = prepLayer("Info - CL&D Digital");
  var sltLayer = prepLayer("Slit - CL&D Digital");
  var substLayer = prepLayer("Substrate - CL&D Digital");
  
  // calc info (1mm = 2.83464567pts)
  var layflat = (sel.wd - 5.66929134) / 2;
	
	//to determine mdo, read MDO property from Database or request info from other extension...
  var mdo = false;
  if (ptsToMM(layflat, 2) > 153.5) {
    mdo = true;
  }
  var dimY = sel.y + 14;
  var locY = sel.y - sel.ht;
  var lOffset, rOffset, offsetPts;
  if (clearSide === 'Left') {
    rOffset = layflat * 0.4; //short side offset
    lOffset = layflat - rOffset + 5.669; // long side offset, uses short side offset to calculate
  } else if (clearSide === 'Right') {
    lOffset = layflat * 0.4; //short side offset
    rOffset = layflat - lOffset + 5.669; // long side offset, uses short side offset to calculate
  }
  var sltX = sel.x + sel.wd + (4 * 2.83464567); // 4mm bleed
  var sltPts = [[sltX, sel.y], [sltX, sel.y - sel.ht]];
  var dims = [ptsToMM(rOffset, 2), ptsToMM(layflat, 2), ptsToMM(lOffset, 2)]; //right to left
  offsetPts = [[sel.x + sel.wd, dimY], [sel.x + lOffset + layflat, dimY],
         [sel.x + lOffset, dimY], [sel.x, dimY]]; //right to left
  
  var arwLeftPts = [[0, 0], [3.5, 1.75], [3.5, -1.75]];
  var arwRightPts = [[0, 0], [-3.5, 1.75], [-3.5, -1.75]];
  
  // build art:
  var slvInfoGroup = infoLayer.groupItems.add();
  slvInfoGroup.name = "|) Sleeve Info KEY";
  var dimGroup = slvInfoGroup.groupItems.add();
  dimGroup.name = "dimensions";
  
  var i;
  var hor1Pts, hor2Pts, vertPts, dimText, dimSubGroup;
  for (i = 0; i < 3; i++) {
    dimSubGroup = dimGroup.groupItems.add();
    dimSubGroup.name = 'width';
    dimText = dimSubGroup.textFrames.add();
    dimText.contents = i === 1 ? dims[i] + 'mm LayFlat' : dims[i] + 'mm';
    dimText.left = offsetPts[i][0] - ((offsetPts[i][0] - offsetPts[i + 1][0]) / 2);
    dimText.top = dimY + 6.25;
    dimText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
    dimText.paragraphs[0].characterAttributes.fillColor = dimColor;
    dimText.paragraphs[0].characterAttributes.size = 10;
    dimText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
    
    hor1Pts = [[offsetPts[i][0] - 2, dimY],
          [dimText.position[0] + dimText.width + 3, dimY]];
    hor2Pts = [[dimText.position[0] - 3, dimY],
          [offsetPts[i + 1][0] + 2, dimY]];
    vertPts = [[offsetPts[i][0], offsetPts[i][1] - 4], [offsetPts[i][0], offsetPts[i][1] + 4]];
    
    addPath(dimSubGroup, vertPts, dimPthProps, '', '', "end path");
    addPath(dimSubGroup, hor1Pts, dimPthProps, '', '', "right path");
    addPath(dimSubGroup, arwRightPts, arwPthProps, '',
        [offsetPts[i][0] - 3.5, dimY + 1.75], "right arrowhead");
    addPath(dimSubGroup, hor2Pts, dimPthProps, '', '', "left path");
    addPath(dimSubGroup, arwLeftPts, arwPthProps, '',
        [offsetPts[i + 1][0], dimY + 1.75], "left arrowhead");
    if (i === 2) {
      addPath(dimSubGroup, [[offsetPts[3][0], offsetPts[3][1] - 4],
                [offsetPts[3][0], offsetPts[3][1] + 4]], dimPthProps, '', '', "end path");
    }
  }
  
  var locGroup = slvInfoGroup.groupItems.add();
  locGroup.name = "fold locations";

  vertPts = [[offsetPts[1][0], locY], [offsetPts[1][0], locY - 14]];
  addPath(locGroup, vertPts, locPthProps, '', '', "right fold bottom");
  vertPts = [[offsetPts[1][0], sel.y], [offsetPts[1][0], sel.y + 10]];
  addPath(locGroup, vertPts, locPthProps, '', '', "right fold top");
  vertPts = [[offsetPts[2][0], locY], [offsetPts[2][0], locY - 14]];
  addPath(locGroup, vertPts, locPthProps, '', '', "left fold bottom");
  vertPts = [[offsetPts[2][0], sel.y], [offsetPts[2][0], sel.y + 10]];
  addPath(locGroup, vertPts, locPthProps, '', '', "left fold top");

  var foldText = locGroup.textFrames.add();
  foldText.contents = "Fold Locations(± 10mm)";
  foldText.left = offsetPts[2][0] + (layflat / 2);
  foldText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
  foldText.paragraphs[0].characterAttributes.fillColor = locColor;
  foldText.paragraphs[0].characterAttributes.size = 10;
  foldText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
  if (foldText.width > layflat - 6) {
    foldText.top = locY - 15;
  } else {
    foldText.top = locY - 3;
    var locSubGroup = locGroup.groupItems.add();
    locSubGroup.name = 'arrows';
    locPthProps.strokeDashes = [];
    arwPthProps.fillColor = locColor;
    addPath(locSubGroup, [[offsetPts[1][0] - 7, locY - 8], [foldText.left + foldText.width + 5, locY - 8]],
        locPthProps, '', '', "right path");
    addPath(locSubGroup, arwRightPts, arwPthProps, '',
        [offsetPts[1][0] - 5 - 3.5, locY - 8 + 1.75], "right arrowhead");
    addPath(locSubGroup, [[offsetPts[2][0] + 7, locY - 8], [foldText.left - 5, locY - 8]],
        locPthProps, '', '', "left path");
    addPath(locSubGroup, arwLeftPts, arwPthProps, '',
        [offsetPts[2][0] + 5, locY - 8 + 1.75], "left arrowhead");
  }
  
  // substrate:
  var substPts;
  if (!mdo) {
    if (clearSide === 'Left') {
      substPts = [[sel.x - 11.339, sel.y],
            [sel.x + sel.wd + 11.339, sel.y],
            [sel.x + sel.wd + 11.339, sel.y - sel.ht],
            [sel.x - 11.339, sel.y - sel.ht]];
    } else {
      substPts = [[sel.x - 11.339, sel.y],
            [sel.x + sel.wd + 11.339, sel.y],
            [sel.x + sel.wd + 11.339, sel.y - sel.ht],
            [sel.x - 11.339, sel.y - sel.ht]];
    }
  } else {
    if (clearSide === 'Left') {
      substPts = [[sel.x - 36.85, sel.y],
            [sel.x + sel.wd, sel.y],
            [sel.x + sel.wd, sel.y - sel.ht],
            [sel.x - 36.85, sel.y - sel.ht]];
    } else {
      substPts = [sel.pos,
            [sel.x + sel.wd + 36.85, sel.y],
            [sel.x + sel.wd + 36.85, sel.y - sel.ht],
            [sel.x, sel.y - sel.ht]];
    }
  }
  var subst = addPath(substLayer, substPts, substProps, '', '', "|) Substrate");
  
  // slit marks:
  if (!mdo) {
    var sltGroup = sltLayer.groupItems.add();
    sltGroup.name = "|) Slit Marks";

    // make vert slit lines w/o graphic styles:
    var sltSubGroup = sltGroup.groupItems.add();
    sltSubGroup.name = 'slit guide';
    addPath(sltSubGroup, sltPts, sltPth1Props, '', '', 'black line');
    addPath(sltSubGroup, sltPts, sltPth2Props, '', '', 'white dashes');
    sltSubGroup.translate(0.5);
    /*
    //make vert slit lines with graphic styles(named style must exist in document, not style library):
    var sltStyle = doc.graphicStyles.getByName("Slit Lines-Black & 5Indigo");
    var slt1 = addPath(sltGroup, sltPts, sltPth1Props, '', '', 'slit guide');
    sltStyle.applyTo(slt1);
    slt1.translate(0.5);
    */

    // make hor. marks for finishing w/o graphic styles
    sltSubGroup = sltGroup.groupItems.add();
    sltSubGroup.name = 'top repeat guides';
    sltPth2Props.strokeDashes = [9];
    addPath(sltSubGroup, [[sltPts[0][0] + 18, sltPts[0][1]], sltPts[0]], sltPth1Props, '', '', 'black line');
    addPath(sltSubGroup, [[sltPts[0][0] + 18, sltPts[0][1]], sltPts[0]], sltPth2Props, '', '', 'white dashes');
    sltSubGroup = sltGroup.groupItems.add();
    sltSubGroup.name = 'bottom repeat guides';
    addPath(sltSubGroup, [[sltPts[1][0] + 18, sltPts[1][1]], sltPts[1]], sltPth1Props, '', '', 'black line');
    addPath(sltSubGroup, [[sltPts[1][0] + 18, sltPts[1][1]], sltPts[1]], sltPth2Props, '', '', 'white dashes');
    /*
    //make hor. marks for finishing with graphic styles(named style must exist in document, not style library)
    sltStyle.applyTo(addPath(sltSubGroup, [[sltPts[0][0] + 14, sltPts[0][1]], sltPts[0]], sltPth1Props, '', '', 'top repeat guide'));
    sltStyle.applyTo(addPath(sltSubGroup, [[sltPts[1][0] + 14, sltPts[1][1]], sltPts[1]], sltPth1Props, '', '', 'bottom repeat guide'));
    */

    // make slit text
    sltSubGroup = sltGroup.groupItems.add();
    sltSubGroup.name = 'slit width';
    ///var sltText = sltSubGroup.textFrames.add();
    
    var rectRef;
    if (sel.ht < 121) {
      //position for 3 lines of text, wide frame
      rectRef = sltSubGroup.pathItems.rectangle(sel.y + 28, sltX + 1, sel.ht - 4, 30);
    } else if (sel.ht < 199) {
      //position for 2 lines of text
      rectRef = sltSubGroup.pathItems.rectangle(sel.y + 16, sltX + 1, sel.ht - 8, 20);
    } else {
      //position for 1 line of text
      rectRef = sltSubGroup.pathItems.rectangle(sel.y + 6, sltX + 1, sel.ht - 8, 10);
    }
    
    var sltText = sltSubGroup.textFrames.areaText(rectRef);
    
    sltText.contents = 'Slit width of art = ';
    sltText.name = 'actualDate:{SLITWIDTH}';
    sltText.textRange.characterAttributes.fillColor = blkColor;
    sltText.textRange.paragraphAttributes.justification = Justification.LEFT;
    sltText.textRange.characterAttributes.size = 10;
    sltText.textRange.characterAttributes.autoLeading = false;
    sltText.textRange.characterAttributes.leading = 10;
    sltText.textRange.characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
    
    sltText.rotate(-90, 1, 1, 1, 1, Transformation.BOTTOMLEFT);
    sltText = sltText.duplicate(sltText, ElementPlacement.PLACEAFTER);
    
    sltText.textRange.characterAttributes.fillColor = wtColor;
    sltText.textRange.characterAttributes.strokeColor = wtColor;
    sltText.textRange.characterAttributes.strokeWeight = 2;
    
    /*
    for (i = 0; i < sltText.paragraphs.length; i++) {
      sltText.paragraphs[i].paragraphAttributes.justification = Justification.LEFT;
      sltText.paragraphs[i].strokeMiterLimit = 1;
      sltText.paragraphs[i].characterAttributes.fillColor = blkColor;
      sltText.paragraphs[i].characterAttributes.size = 10;
      sltText.paragraphs[i].characterAttributes.leading = 10;
      sltText.paragraphs[i].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
    }
    sltText.rotate(-90, 1, 1, 1, 1, Transformation.BOTTOMLEFT);
    sltText = sltText.duplicate(sltText, ElementPlacement.PLACEAFTER);
    for (i = 0; i < sltText.paragraphs.length; i++) {
      sltText.paragraphs[i].characterAttributes.stroked = true;
      sltText.paragraphs[i].characterAttributes.strokeColor = wtColor;
      sltText.paragraphs[i].characterAttributes.strokeWeight = 2;
    }
    */

    // rotate slit group if needed:
    if (clearSide === 'Right') {
      sltGroup.rotate(180, 1, 1, 1, 1, Transformation.CENTER);
      sltGroup.translate(-(sel.wd + (8 * 2.83464567) + sltGroup.width));
    }
  } else {
    // select substrate art to build slit marks from
    doc.selection = [subst];
    eval_slitMarks("Landscape", true);
  }
    
  doc.selection = null;
}

function cutMarks(orientation) {
  var alertRef = "|) Marks - " + orientation + " Cut Marks";
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', ["Finishing Marks - CL&D Digital"], ["IndigoK"])) {
    return false;
  }
  sel = selObj(sel[0]);
	
  var wtColor;
  if (colorExists("5Indigo")) {
		wtColor = new SpotColor();
		wtColor.spot = doc.spots.getByName("5Indigo");
		wtColor.tint = 100;
		var dkWtProps = {
			closed: true,
			stroked: false,
			filled: true,
			fillColor: wtColor,
			fillOverprint: true
		};
		var ltWtProps = {
			closed: true,
			stroked: false,
			filled: true,
			fillColor: wtColor,
			fillOverprint: true,
			opacity: 100
		};
  } else {
		wtColor = newCMYKcolor(0, 0, 0, 0);
  }
  var dkColor = new SpotColor();
  dkColor.spot = doc.spots.getByName("IndigoK");
  dkColor.tint = 60;
  var dkProps = {
		closed: true,
		stroked: false,
		filled: true,
		fillColor: dkColor,
		fillOverprint: true
  };
  var ltColor = newCMYKcolor(0, 0, 0, 0);
  var ltProps = {
    closed: true,
    stroked: false,
    filled: true,
    fillColor: ltColor,
    fillOverprint: false,
    opacity: 75
  };
	
  var cutPts = [[0, 0], [0, 0.5], [22.5, 0.5], [22.5, 0]];
  var mkLayer = prepLayer("Finishing Marks - CL&D Digital");
  
  var rot, pos;
  if (orientation === 'Landscape') {
    rot = 90;
    pos = [[sel.x + sel.wd - 0.5, sel.y + 9], [sel.x + sel.wd - 0.5, sel.y - sel.ht + 13.5],
           [sel.x, sel.y - sel.ht + 13.5], [sel.x, sel.y + 9]];
  } else if (orientation === 'Portrait') {
    rot = '';
    pos = [[sel.x + sel.wd - 13.5, sel.y - sel.ht + 0.5], [sel.x - 9, sel.y - sel.ht + 0.5],
          [sel.x + sel.wd - 13.5, sel.y], [sel.x - 9, sel.y]];
  }
  
  var newGroup = mkLayer.groupItems.add();
  newGroup.name = "|) Cut Marks";
	if (colorExists("5Indigo")) {
		addPath(newGroup, cutPts, dkProps, rot, pos[0], "dark 2");
		addPath(newGroup, cutPts, dkWtProps, rot, pos[0], "dark 2 white");
		addPath(newGroup, cutPts, dkProps, rot, pos[1], "dark 1");
		addPath(newGroup, cutPts, dkWtProps, rot, pos[1], "dark 1 white");
		addPath(newGroup, cutPts, ltProps, rot, pos[2], "light 2");
		addPath(newGroup, cutPts, ltWtProps, rot, pos[2], "light 2 white");
		addPath(newGroup, cutPts, ltProps, rot, pos[3], "light 1");
		addPath(newGroup, cutPts, ltWtProps, rot, pos[3], "light 1 white");
	} else {
		addPath(newGroup, cutPts, dkProps, rot, pos[0], "dark 2");
		addPath(newGroup, cutPts, dkProps, rot, pos[1], "dark 1");
		addPath(newGroup, cutPts, ltProps, rot, pos[2], "light 2");
		addPath(newGroup, cutPts, ltProps, rot, pos[3], "light 1");
	}
  
  doc.selection = null;
  
  return true;
}

function eval_slitMarks(orientation, cutTrue) {
  var layersNeeded = ["Slit - CL&D Digital"];
  var alertRef = "|) Marks - " + orientation + " Slit Marks";
  if (cutTrue) {
    layersNeeded = ["Slit - CL&D Digital", "Finishing Marks - CL&D Digital"];
    alertRef = "|) Marks - " + orientation + " Slit & Cut Marks";
  }
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, 1, 'PathItem', layersNeeded, ["IndigoK"])) {
    return;
  }
  sel = selObj(sel[0]);
  var noColor = new NoColor();
  
  var wtColor;
  if (colorExists("5Indigo")) {
    wtColor = new SpotColor();
    wtColor.spot = doc.spots.getByName("5Indigo");
    wtColor.tint = 100;
  } else {
    wtColor = newCMYKcolor(0, 0, 0, 0);
  }
  
  var blkColor = new SpotColor();
  blkColor.spot = doc.spots.getByName("IndigoK");
  blkColor.tint = 100;
  var sltPth1Props = {
    closed: false,
    stroked: true,
    strokeOverprint: false,
    strokeWidth: 1,
    strokeColor: blkColor,
    strokeCap: StrokeCap.BUTTENDCAP,
    strokeDashes: [],
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var sltPth2Props = {
    closed: false,
    stroked: true,
    strokeOverprint: false,
    strokeWidth: 1,
    strokeColor: wtColor,
    strokeCap: StrokeCap.BUTTENDCAP,
    strokeDashes: [12],
    filled: false,
    fillColor: noColor,
    fillOverprint: false
  };
  var sltLayer = prepLayer("Slit - CL&D Digital");
  
  // build art:

  if (cutTrue) {
    if (!cutMarks(orientation)) {
      return;
    }
  }
  
  var sltGroup = sltLayer.groupItems.add();
  sltGroup.name = "|) Slit Marks";
  
  var lftSltPts, rtSltPts, tpReptPts, btmReptPts, reptTrans, txtPos;
		// var sltTrans;
  if (orientation === "Portrait") {
    lftSltPts = [[sel.x - 9, sel.y], [sel.x - 9, sel.y - sel.ht]];
    rtSltPts = [[sel.x + sel.wd + 9, sel.y], [sel.x + sel.wd + 9, sel.y - sel.ht]];
    //sltTrans = [[0.5, 0], [-0.5, 0]];
    tpReptPts = [rtSltPts[0], [rtSltPts[0][0] + 18, rtSltPts[0][1]]];
    btmReptPts = [rtSltPts[1], [rtSltPts[1][0] + 18, rtSltPts[1][1]]];
    reptTrans = [-sel.wd - 18 - 18, 0];
    txtPos = [sel.x + sel.wd + 9 + 1, sel.y + 8];
  } else if (orientation === "Landscape") {
    lftSltPts = [[sel.x, sel.y + 9], [sel.x + sel.wd, sel.y + 9]];
    rtSltPts = [[sel.x, sel.y - sel.ht - 9], [sel.x + sel.wd, sel.y - sel.ht - 9]];
    //sltTrans = [[0, -0.5], [0, 0.5]];
    tpReptPts = [rtSltPts[0], [rtSltPts[0][0], rtSltPts[0][1] - 18]];
    btmReptPts = [rtSltPts[1], [rtSltPts[1][0], rtSltPts[1][1] - 18]];
    reptTrans = [0, sel.ht + 18 + 18];
    txtPos = [sel.x + 5, sel.y + 9 + 15];
  }
  
  // make slit lines w/o graphic styles:
  var sltSubGroup = sltGroup.groupItems.add();
  sltSubGroup.name = 'right slit guide'; // right, top
  addPath(sltSubGroup, rtSltPts, sltPth1Props, '', '', 'black line');
  addPath(sltSubGroup, rtSltPts, sltPth2Props, '', '', 'white dashes');
  //sltSubGroup.translate(sltTrans[0][0], sltTrans[0][1]);
  
  sltSubGroup = sltGroup.groupItems.add();
  sltSubGroup.name = 'left slit guide'; // left, bottom
  addPath(sltSubGroup, lftSltPts, sltPth1Props, '', '', 'black line');
  addPath(sltSubGroup, lftSltPts, sltPth2Props, '', '', 'white dashes');
  //sltSubGroup.translate(sltTrans[1][0], sltTrans[1][1]);
  
  // make marks for finishing w/o graphic styles
  sltSubGroup = sltGroup.groupItems.add();
  sltSubGroup.name = 'top repeat guides';
  sltPth2Props.strokeDashes = [9];
  var thisPath;
  thisPath = addPath(sltSubGroup, tpReptPts, sltPth1Props, '', '', 'black line');
  thisPath.duplicate(sltSubGroup, ElementPlacement.INSIDE).translate(reptTrans[0], reptTrans[1]);
  thisPath = addPath(sltSubGroup, tpReptPts, sltPth2Props, '', '', 'white dashes');
  thisPath.duplicate(sltSubGroup, ElementPlacement.INSIDE).translate(reptTrans[0], reptTrans[1]);
  thisPath.rotate(180, 1, 1, 1, 1, Transformation.CENTER);
  
  sltSubGroup = sltGroup.groupItems.add();
  sltSubGroup.name = 'bottom repeat guides';
  thisPath = addPath(sltSubGroup, btmReptPts, sltPth1Props, '', '', 'black line');
  thisPath.duplicate(sltSubGroup, ElementPlacement.INSIDE).translate(reptTrans[0], reptTrans[1]);
  thisPath = addPath(sltSubGroup, btmReptPts, sltPth2Props, '', '', 'white dashes');
  thisPath.duplicate(sltSubGroup, ElementPlacement.INSIDE).translate(reptTrans[0], reptTrans[1]);
  thisPath.rotate(180, 1, 1, 1, 1, Transformation.CENTER);

  // make slit point text
  sltSubGroup = sltGroup.groupItems.add();
  sltSubGroup.name = 'slit width';
  var sltText = sltSubGroup.textFrames.add();
  sltText.contents = 'Slit width = ()';
  sltText.name = 'actualDate:{SLITWIDTH}';
  sltText.left = txtPos[0];
  sltText.top = txtPos[1];
  sltText.paragraphs[0].paragraphAttributes.justification = Justification.LEFT;
  sltText.paragraphs[0].characterAttributes.fillColor = blkColor;
  sltText.paragraphs[0].characterAttributes.size = 10;
  sltText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
  if (orientation === 'Portrait') {
    sltText.rotate(-90, 1, 1, 1, 1, Transformation.BOTTOMLEFT);
  }
  sltText = sltText.duplicate(sltText, ElementPlacement.PLACEAFTER);
  sltText.paragraphs[0].characterAttributes.stroked = true;
  sltText.paragraphs[0].characterAttributes.strokeColor = wtColor;
  sltText.paragraphs[0].characterAttributes.strokeWeight = 2;

  doc.selection = null;
}

function eval_substrateArt() {
  var alertRef = "|) Marks - Substrate Art";
  var doc = app.activeDocument;
  var sel = doc.selection;
  if (!prereqCheck(alertRef, sel, '', 'PathItem', ["Substrate - CL&D Digital"], ["Indigo Substrate"])) {
    return;
  }
  //sel = selObj(sel[0]);
  
  var substColor = new SpotColor();
  substColor.spot = doc.spots.getByName("Indigo Substrate");
  substColor.tint = 100;

  //var substPts = [[-1, 1], [9, 1], [9, 0], [0, 0], [0, -9], [-1, -9]]
  
  var substProps = {
    name: '|) Substrate',
    closed: true,
    stroked: false,
    filled: true,
    fillColor: substColor,
    fillOverprint: false
  };
  
  var substLayer = prepLayer("Substrate - CL&D Digital");
  
  // build art:
  // duplicate selection
  var i;
  for (i = 0; i < sel.length; i++) {
    var substArt = sel[i].duplicate(substLayer, ElementPlacement.INSIDE);
    // apply properties
    var theProp;
    for (theProp in substProps) {
      if (substProps.hasOwnProperty(theProp)) {
        substArt[theProp] = substProps[theProp];
      }
    }
  }
  
  doc.selection = null;
}

/*
function tearMarks(orientation) {
  // ask for distance from edge
  
  //check finishing marks layer exists, make if needed
  //if layer existed, delete existing tear marks
  
  //check info layer exists, make if needed
  //if layer existed, delete existing tear marks
  
  // create marks on finsishing layer
  
  // create marks on info layer
}

function foldSingle(orientation) {
  // ask for distance from top edge
  
  //check finishing marks layer exists, make if needed
  //if layer existed, delete existing fold marks
  
  // create marks on finsishing layer
}

function foldDouble(orientation) {
  // ask for distance from top edge
  
  //check finishing marks layer exists, make if needed
  //if layer existed, delete existing fold marks
  
  // create marks on finsishing layer, one set from 1st edge, 2nd set from opposite edge
}

function foldTriple(orientation) {
  // for quad seal bag
}

function foldQuad(orientation) {
  // for side gusset bag
}
*/