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
        
    function onDocActivated(event) {
        //disable if doc not open
        var name = $(event.data).find("name").text();
        if (name === '') {
            $('button').prop('disabled', true);
            $("#controls").addClass("disabled");
            return;
        }
        $('button').prop('disabled', false);
        $("#controls").removeClass("disabled");
    }
    
    //////////////////////////////////
    
    $('#addSlit').click(function () {
        console.log(Date() + ' addSlit');
        csInterface.evalScript('addSlit()');
    });
    
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
    
    /*
    
    csInterface.evalScript('docURL()');
    
    */
    
});