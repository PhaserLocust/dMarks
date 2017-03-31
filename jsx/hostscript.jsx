/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

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

function addPath(layerRef, pathPoints, pathProps, theGroup, rotation, pathPosition, pathName) {
    var newPath = layerRef.pathItems.add();
    newPath.setEntirePath(pathPoints);
    var theProp;
    for (theProp in pathProps) {
        if (pathProps.hasOwnProperty(theProp)) {
            newPath[theProp] = pathProps[theProp];
        }
    }
    newPath.move(theGroup, ElementPlacement.PLACEATEND);
    newPath.rotate(rotation);
    newPath.position = pathPosition;
    newPath.name = pathName;
}

function addCircle() {
    
}

function addRectangle() {
    
}

function cornerCut() {
    var alertRef = "|) Marks - Corner Cut Marks";
    var doc = app.activeDocument;
    var selected = doc.selection;
    if (!prereqCheck(alertRef, selected, 1, 'PathItem', ["Job Finishing Marks - CL&D Digital"], ["Indigo Die"])) {
        return;
    }
    selected = doc.selection[0];
    var thePosition = selected.position;
    var x = thePosition[0] - 1;
    var y = thePosition[1] + 1;
    var theHeight = selected.height;
    var theWidth = selected.width;
    var dieColor = new SpotColor();
    dieColor.spot = doc.spots.getByName("Indigo Die");
    dieColor.tint = 100;
    var jobMkLayer = doc.layers.getByName("Job Finishing Marks - CL&D Digital");
    prepLayer(jobMkLayer);
    var pathProps = {
        closed: true,
        stroked: false,
        filled: true,
        fillColor: dieColor,
        fillOverprint: false
    };
    var pathPoints = [[x, y], [x + 10, y], [x + 10, y - 1], [x + 1, y - 1], [x + 1, y - 10], [x, y - 10]];
    var newGroup = doc.groupItems.add();
    newGroup.name = "|) Corner Cut";
    //newGroup.move(jobMkLayer, ElementPlacement.PLACEATEND);

    addPath(jobMkLayer, pathPoints, pathProps, newGroup, 0, [x, y], "top left");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -90, [x + theWidth - 8, y], "top right");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -270, [x, y - theHeight + 8], "bottom left");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -180, [x + theWidth - 8, y - theHeight + 8], "bottom right");
}

function cornerCutInvL() {
    var alertRef = "|) Marks - Corner Cut Marks, Landscape";
    var doc = app.activeDocument;
    var selected = doc.selection;
    if (!prereqCheck(alertRef, selected, 1, 'PathItem', ["Job Finishing Marks - CL&D Digital"], ["Indigo Die"])) {
        return;
    }
    selected = doc.selection[0];
    var thePosition = selected.position;
    var x = thePosition[0] - 1;
    var y = thePosition[1] + 1;
    var theHeight = selected.height;
    var theWidth = selected.width;
    var dieColor = new SpotColor();
    dieColor.spot = doc.spots.getByName("Indigo Die");
    dieColor.tint = 100;
    var jobMkLayer = doc.layers.getByName("Job Finishing Marks - CL&D Digital");
    prepLayer(jobMkLayer);
    var pathProps = {
        closed: true,
        stroked: false,
        filled: true,
        fillColor: dieColor,
        fillOverprint: false
    };
    var pathPoints = [[x, y], [x + 10, y], [x + 10, y - 1], [x + 1, y - 1], [x + 1, y - 10], [x, y - 10]];
    var newGroup = doc.groupItems.add();
    newGroup.name = "|) Corner Cut, Landscape";
    //newGroup.move(jobMkLayer, ElementPlacement.PLACEATEND);

    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -270, [x, y + 9], "top left");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -180, [x + theWidth - 10 + 2, y + 9], "top right");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, 0, [x, y - theHeight - 1], "bottom left");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -90, [x + theWidth - 10 + 2, y - theHeight - 1], "bottom right");
}

function cornerCutInvP() {
    var alertRef = "|) Marks - Corner Cut Marks, Portrait";
    var doc = app.activeDocument;
    var selected = doc.selection;
    if (!prereqCheck(alertRef, selected, 1, 'PathItem', ["Job Finishing Marks - CL&D Digital"], ["Indigo Die"])) {
        return;
    }
    selected = doc.selection[0];
    var thePosition = selected.position;
    var x = thePosition[0] - 1;
    var y = thePosition[1] + 1;
    var theHeight = selected.height;
    var theWidth = selected.width;
    var dieColor = new SpotColor();
    dieColor.spot = doc.spots.getByName("Indigo Die");
    dieColor.tint = 100;
    var jobMkLayer = doc.layers.getByName("Job Finishing Marks - CL&D Digital");
    prepLayer(jobMkLayer);
    var pathProps = {
        closed: true,
        stroked: false,
        filled: true,
        fillColor: dieColor,
        fillOverprint: false
    };
    var pathPoints = [[x, y], [x + 10, y], [x + 10, y - 1], [x + 1, y - 1], [x + 1, y - 10], [x, y - 10]];
    var newGroup = doc.groupItems.add();
    newGroup.name = "|) Corner Cut, Portrait";
    //newGroup.move(jobMkLayer, ElementPlacement.PLACEATEND);

    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -90, [x - 9, y], "top left");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, 0, [x + theWidth + 1, y], "top right");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -180, [x - 9, y - theHeight + 8], "bottom left");
    addPath(jobMkLayer, pathPoints, pathProps, newGroup, -270, [x + theWidth + 1, y - theHeight + 8], "bottom right");
}

function cameraMarks() {
    var alertRef = "|) Marks - Camera Marks";
    var doc = app.activeDocument;
    var selected = doc.selection;
    if (!prereqCheck(alertRef, selected, 1, 'PathItem', ["Camera Marks - CL&D Digital"], ["5Indigo", "IndigoK"])) {
        return;
    }
    selected = doc.selection[0];
    var thePosition = selected.position;
    var x = thePosition[0];
    var y = thePosition[1];
    var theHeight = selected.height;
    var theWidth = selected.width;
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
        [x - 54, y + 54],
        [x + theWidth + 9, y + 54],
        [x - 54, y - theHeight - 9],
        [x + theWidth + 9, y - theHeight - 9]
    ];
    
    var i;
    for (i = 0; i < positions.length; i++) {
        x = positions[i][0];
        y = positions[i][1];
        
        var markGroup = newGroup.groupItems.add();
        markGroup.name = "Camera Mark";

        var newRect = markGroup.pathItems.rectangle(y, x, 45, 45, false);
        for (theProp in pathProps) {
            if (pathProps.hasOwnProperty(theProp)) {
                newRect[theProp] = pathProps[theProp];
            }
        }
        newRect.fillColor = wtColor;
        newRect.name = "White";
        
        var newCirc = markGroup.pathItems.ellipse(y - 13.5, x + 13.5, 18, 18, false);
        var theProp;
        for (theProp in pathProps) {
            if (pathProps.hasOwnProperty(theProp)) {
                newCirc[theProp] = pathProps[theProp];
            }
        }
        newCirc.fillColor = blkColor;
        newCirc.name = "Circle";
    }
}

function addSlit(orientation, cutTrue, whiteTrue) {
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

function addTear(orientation) {
    // ask for distance from edge
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing tear marks
    
    //check info layer exists, make if needed
    //if layer existed, delete existing tear marks
    
    // create marks on finsishing layer
    
    // create marks on info layer
}

function add1Fold(orientation) {
    // ask for distance from top edge
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing fold marks
    
    // create marks on finsishing layer
}

function add2Fold(orientation) {
    // ask for distance from top edge
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing fold marks
    
    // create marks on finsishing layer, one set from 1st edge, 2nd set from opposite edge
}

function add3Fold(orientation) {
    // for quad seal bag
}

function add4Fold(orientation) {
    // for side gusset bag
}

