/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, app, CMYKColor, SpotColor, NoColor, StrokeJoin, roundTo, StrokeCap, Justification, textFonts*/

// returns bool
function docIsOpen() {
    return app.documents.length > 0 ? 'true' : 'false';
}

function newCMYKcolor(c, m, y, k) {
    var newCMYKColor = new CMYKColor();
    newCMYKColor.black = k;
    newCMYKColor.cyan = c;
    newCMYKColor.magenta = m;
    newCMYKColor.yellow = y;
    return newCMYKColor;
}

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

function prepLayer(layerRef) {
    layerRef.locked = false;
    layerRef.visible = true;
}

//takes array of needed names, displays message, returns bool
function prereqCheck(alertRef, selected, selectionCount, selectionTypeName, layersNeeded, colorsNeeded) {
    var message = '';
    var plural = '';
    var i, thisItem, thisLayer, thisColor;
    
    //selection
    if (selected !== '') {
        //selection count
        if (selectionCount > 1) {
            plural = 's';
        }
        if (selected.length !== selectionCount) {
            message = message + '\n\n Please select exactly ' + selectionCount + ' item' + plural + '.';
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

function selObj(pathRef) {
    var selectedObj = {
        pos: pathRef.position,
        x: pathRef.position[0],
        y: pathRef.position[1],
        ht: pathRef.height,
        wd: pathRef.width
    };
    return selectedObj;
}

function cornerCut(type) {
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
    var mkLayer = doc.layers.getByName("Job Finishing Marks - CL&D Digital");
    prepLayer(mkLayer);
    
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
}

function cameraMarks() {
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
    var camLayer = doc.layers.getByName("Camera Marks - CL&D Digital");
    prepLayer(camLayer);
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
}

function cutterGuides() {
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
    var guideLayer = doc.layers.getByName("Cutter Guide - CL&D Digital");
    prepLayer(guideLayer);
    var pathProps = {
        closed: true, stroked: true, strokeOverprint: false,
        strokeWidth: 0.5, strokeJoin: StrokeJoin.MITERENDJOIN,
        filled: false, fillColor: noColor, fillOverprint: false
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
    newRect.strokeColor = blkColor;
    newRect.name = "Rectangle Guide";
}

function roundTo(decimalPlaces, number) {
    var factor = Math.pow(10, decimalPlaces);
    var tempNum = number * factor;
    var roundedTempNum = Math.round(tempNum);
    return roundedTempNum / factor;
}

function ptsToMM(points, decimalPlaces) {
    return roundTo(decimalPlaces, points / 2.83464567);
}

function sleeveInfo(clearSide) {
    var alertRef = "|) Marks - Sleeve Info";
    var doc = app.activeDocument;
    var sel = doc.selection;
    if (!prereqCheck(alertRef, sel, 1, 'PathItem', ["Info - CL&D Digital"], [])) {
        return;
    }
    sel = selObj(sel[0]);
    var noColor = new NoColor();
    var wtColor = newCMYKcolor(0, 0, 0, 0);
    var dimColor = newCMYKcolor(75, 0, 100, 0);
    var dimPthProps = {
        closed: false, stroked: true, strokeOverprint: false, strokeWidth: 0.5,
        strokeColor: dimColor, strokeCap: StrokeCap.BUTTENDCAP, strokeDashes: [],
        filled: false, fillColor: noColor, fillOverprint: false
    };
    var dimBoxProps = {name: 'box',
        closed: true, stroked: false, strokeOverprint: false,
        filled: true, fillColor: wtColor, fillOverprint: false
    };
    var locColor = newCMYKcolor(0, 100, 0, 0);
    var locPthProps = {
        closed: false, stroked: true, strokeOverprint: false, strokeWidth: 0.5,
        strokeColor: locColor, strokeCap: StrokeCap.BUTTENDCAP, strokeDashes: [3, 2],
        filled: false, fillColor: noColor, fillOverprint: false
    };
    var infoLayer = doc.layers.getByName("Info - CL&D Digital");
    prepLayer(infoLayer);
    
    //calc info (1mm = 2.83464567pts)
    var layflat = (sel.wd - 5.66929134) / 2;
    var dimY = sel.y + 14;
    var locY = sel.y - sel.ht;
    var lOffset, rOffset, offsetPts;
    if (clearSide === 'Left') {
        rOffset = layflat * 0.4; //short side offset
        lOffset = layflat - rOffset; // long side offset
    } else if (clearSide === 'Right') {
        lOffset = layflat * 0.4; //short side offset
        rOffset = layflat - lOffset; // long side offset
    }
    var dims = [ptsToMM(rOffset, 2), ptsToMM(layflat, 2), ptsToMM(lOffset, 2)]; //right to left
    offsetPts = [[sel.x + sel.wd, dimY], [sel.x + lOffset + layflat, dimY],
                 [sel.x + lOffset, dimY], [sel.x, dimY]]; //right to left

    //build art:
    var slvInfoGroup = infoLayer.groupItems.add();
    slvInfoGroup.name = "|) Sleeve Info KEY";
    
    var dimGroup = slvInfoGroup.groupItems.add();
    dimGroup.name = "dimensions";
    
    var i, horPts, vertPts, dimBox, theProp;
    for (i = 0; i < 3; i++) {
        horPts = [offsetPts[i], offsetPts[i + 1]];
        vertPts = [[offsetPts[i][0], offsetPts[i][1] - 4], [offsetPts[i][0], offsetPts[i][1] + 4]];
        addPath(dimGroup, horPts, dimPthProps, '', '', "width");
        addPath(dimGroup, vertPts, dimPthProps, '', '', "end");
        if (i === 2) {
            addPath(dimGroup, [[offsetPts[3][0], offsetPts[3][1] - 4],
                               [offsetPts[3][0], offsetPts[3][1] + 4]], dimPthProps, '', '', "end");
        }
        var dimText = dimGroup.textFrames.add();
        dimText.contents = i === 1 ? dims[i] + 'mm LayFlat' : dims[i] + 'mm';
        dimText.left = offsetPts[i][0] - ((offsetPts[i][0] - offsetPts[i + 1][0]) / 2);
        dimText.top = dimY + 6.25;
        dimText.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
        dimText.paragraphs[0].characterAttributes.fillColor = dimColor;
        dimText.paragraphs[0].characterAttributes.size = 10;
        dimText.paragraphs[0].characterAttributes.textFont = textFonts.getByName("Avenir-Roman");
        
        dimBox = dimGroup.pathItems.rectangle(dimText.position[1], dimText.position[0] - 3,
                                              dimText.width + 6, dimText.height, false);
        for (theProp in dimBoxProps) {
            if (dimBoxProps.hasOwnProperty(theProp)) {
                dimBox[theProp] = dimBoxProps[theProp];
            }
        }
        dimBox.move(dimText, ElementPlacement.PLACEAFTER);
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
    }
}

function slitMarks(orientation, cutTrue, whiteTrue) {
    //get selected path
    
    //if path not valid, return
    
    //get dims, calc slit line location by dims and orientation
    
    //check slit layer exists, make if needed
    //if layer exitst, delete existing slit marks
    
    //make slit lines and press marks, if whiteTrue then 5indigo dashes
    
    //make slit width text
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing cut marks
    
    //if cutTrue, create cut marks
}

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

