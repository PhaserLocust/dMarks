/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

$(document).ready(function () {
	'use strict';
    
    var csInterface = new CSInterface();
    
    function init() {
        themeManager.init();
    }
    
    function closeNotifier(divID) {
        $('#' + divID).hide();
        $('#' + divID + 'Text').text('');
    }
    
    function onDocSaved(event) {
        console.log(Date() + ' doc saved');
        console.log(event.data);
    }
    
    function onDocDeactivated(event) {
    }
       
    function setEnabled(name) {
        // disables ui if passed ''
        if (name === '') {
            $('button').prop('disabled', true);
            $("#controls").addClass("disabled");
            return;
        }
        $('button').prop('disabled', false);
        $("#controls").removeClass("disabled");
    }
    
    function onDocActivated(event) {
        var name;
        if (event === '') {
            csInterface.evalScript('docIsOpen()', function (res) {
                //console.log("the result: " + res);
                if (res === 'true') {
                    setEnabled('enable');
                } else {
                    setEnabled('');
                }
            });
            return;
        } else {
            name = $(event.data).find("name").text();
            setEnabled(name);
        }
    }
    
    //////////////////////////////////
    
    $('#cornerCut').click(function () {
        csInterface.evalScript('cornerCut("")');
    });
    
    $('#cornerCutInvL').click(function () {
        csInterface.evalScript('cornerCut("InvL")');
    });
    
    $('#cornerCutInvP').click(function () {
        csInterface.evalScript('cornerCut("InvP")');
    });
    
    $('#cameraMarks').click(function () {
        csInterface.evalScript('cameraMarks()');
    });
    
    $('#encloseRect').click(function () {
        csInterface.evalScript('encloseRect()');
    });
    
    $('#cutterGuides').click(function () {
        csInterface.evalScript('cutterGuides()');
    });
    
    $('#sleeveInfoLeft').click(function () {
        csInterface.evalScript('sleeveInfo("Left")');
    });
    
    $('#sleeveInfoRight').click(function () {
        csInterface.evalScript('sleeveInfo("Right")');
    });
    
    $('#cutLand').click(function () {
        csInterface.evalScript('cutMarks("Landscape")');
    });
    
    $('#cutPort').click(function () {
        csInterface.evalScript('cutMarks("Portrait")');
    });
    
    $('#slitLand').click(function () {
        csInterface.evalScript('slitMarks("Landscape", true)');
    });
    
    $('#slitPort').click(function () {
        csInterface.evalScript('slitMarks("Portrait", true)');
    });
    
    //////////
    
    $('#deny').click(function () {
        closeNotifier('confirmation');
    });
        
    $('#confirm').click(function () {
        console.log('confirmed');
    });
     
    $('#notifierClose').click(function () {
        closeNotifier('notifier');
    });
    
    $('#retryButton').click(function () {
        console.log(Date() + ' Retry');

        closeNotifier('retry');
    });
    
    //////////////////////////////////
    
    //themeManager:
    init();
    
    //listen for ai document deactivations
    //csInterface.addEventListener("documentAfterDeactivate", onDocDeactivated);
    
    //listen for ai document activations
    csInterface.addEventListener("documentAfterActivate", onDocActivated);
    
    //listen for ai document save
    //csInterface.addEventListener("documentAfterSave", onDocSaved);
    
    //listen for dlayers event, call relevant methods
    csInterface.addEventListener("com.rps.dlayers", function (e) {
        if (e.data === 'substrateArt') {
            csInterface.evalScript('substrateArt()');
        }
    });
    
    $(window).load(function () {
        console.log(Date() + ' window loaded');
        onDocActivated('');
    });
});