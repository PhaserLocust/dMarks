/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

function cornerCut() {
    var selected = app.activeDocument.selection;
    
    var thePosition = selected.position;
    var x = thePosition[0] - 1;
    var y = thePosition[1] + 1;
    var theHeight = selected.height;
    var theWidth = selected.width;
    var theFill = {class:spot color info, tint:100.0, spot:spot "Indigo Die"};
    var theLayer = app.activeDocument.layers.getByName("Job Finishing Marks - CL&D Digital")
    
    var pathPoints = [];

    var newPath = app.activeDocument.pathItems.add();
    newPath.setEntirePath(pathPoints);
    newPath.name = "corner 1";
    
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

