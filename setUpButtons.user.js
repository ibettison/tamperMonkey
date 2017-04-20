// ==UserScript==
// @name         setUpButtons
// @namespace    http://tampermonkey.net/
// @version      0.9
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// the below link is the default details contained in a hosted file. 
// @require      https://raw.githubusercontent.com/ibettison/tamperMonkey/master/headerDetails.user.js
// @description  when creating a new incident or Service request setup some buttons to help with the creation of the ticket. Allows default details to be entered and also canned answers\responses
// @author       Ian Bettison
// @updateURL    https://raw.githubusercontent.com/ibettison/tamperMonkey/master/setUpButtons.user.js
// @downloadURL  https://raw.githubusercontent.com/ibettison/tamperMonkey/master/setUpButtons.user.js
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/wd/object/create.rails?class_name=IncidentManagement*
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/wd/object/create.rails?class_name=RequestManagement*
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/wd/object/invokeFunction.rails?class_name=RequestManagement.Request*
// @match        http://crf-psrv:81/user.aspx?username=*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(document).ready(function() {
    /*setup global variables*/
    var summaryArray            = [];
    var detailArray             = [];
    
    /*get existing canned answers*/
    var summaryCAs              = GM_getValue ("summary", "");
    var detailCAs               = GM_getValue("detail", "");
    
   
    /*setup temporary holding variables for the canned Answers*/
    if (summaryCAs) {
        /*convert string to array*/
        summaryArray            = JSON.parse (summaryCAs);
    }
    
    if (detailCAs) {
        /*convert string to array*/
        detailArray             = JSON.parse (detailCAs);
    }
        
    /*The buttons added to the incident page*/
    $('#contentHeader').append($('<span style="padding-top: 4px;">' +
      '<select id="cannedAnswers" style="width: 200px;"><option disabled selected>Select a canned Answer</option></select></span>' +
      '<input type="button" class="pushButton" id="addCannedAnswer" value="New Canned Answer ^">&nbsp;'));
    
    /*add the values of the canned answers set above to the dropdown box */
    for (var i=0;i<cannedAnswersSummary.length;i++){
        $('#cannedAnswers').append($('<option/>', {
            value: cannedAnswersDetail[i],
            text: cannedAnswersSummary[i]
        }));
    }
        
    /*if there are additional canned answers saved then add them to the drop down list*/
    if(summaryArray.length){
        /*add the values from the additional canned answers */
        for (var i=0;i<summaryArray.length;i++){
            $('#cannedAnswers').append($('<option/>', {
                value: detailArray[i],
                text: summaryArray[i]
            }));
        }
    }
    

    
    $.fn.createAddDiv = function() {
        /*create hidden div to show when add new canned button is pressed*/
        $('<div/>',{
            id: 'divCannedAnswer',
            class: 'groupBox',
            css: {
                display: 'none',
                color: '#000',
                width: '350px',
                padding: '0px 4px'
            },
            html: '<div class="groupBoxHeader">Add new canned Answer</div><div class="groupBoxContent" style="background-color: rgb(230,231,232); padding: 4px; min-height: 190px;">' +
            '<div style="padding: 2px 4px;"><input class="textField" style="width: 90%; padding: 2px 4px;" type="text" id="addCannedSummary" placeholder="Canned Summary" /></div>' +
            '<div style="padding: 2px 4px;"><textarea style="width: 90%; height: 80px; padding: 2px 4px;" id="addCannedDetail" placeholder="Canned Detail"></textarea></div>' +
            '<div style="padding: 0 9px;"><input type="button" class="pushButton" id="saveCannedAnswer" value="Save"> <input type="button" class="pushButton" id="copyCannedAnswer" value="Copy">' + 
            '&lt;&lt;Add Signature&gt;&gt></div>' +
            '<div id="messageArea" style="padding: 0 9px; color: blue; display: none;">Saved</div></div>'
        }).appendTo('#contentHeader');
        return true;
    }
    
    $(this).createAddDiv();
    
    $.fn.createDelDiv = function(listOfAnswers) {
        /*setup the partial html for the deletion of a canned answer*/
        var deleteCanned = "";
        $.each(listOfAnswers, function(index, item) {
            deleteCanned += "<input type='checkbox' class='delCannedClass' id='del"+index+"' value='"+index+"'> " + item.substring(0, 35)+"<BR/>";
        });
        /*create hidden div to show when delete new canned button is pressed*/
        $('<div/>',{
            id: 'divDelCannedAnswer',
            class: 'groupBox',
            css: {
                display: 'none',
                color: '#000',
                width: '350px',
                padding: '0px 4px'
            },
            html: "<div class='groupBoxHeader'>Delete canned Answer</div><div class='groupBoxContent' style='background-color: rgb(230,231,232); padding: 4px; min-height: 160px;'>" +
            "<div id='delContentWrapper'><div id='delContent' style='padding: 2px 4px;'>" + deleteCanned + "</div></div><div style='padding: 4px 9px;'><strong>Select the answers to delete</strong></div>" +
            "<div style='padding: 0 9px;'><input type='button' class='pushButton' id='deleteCannedAnswer' value='delete'>" +
            "</div><div id='messageDelArea' style='padding: 0 9px; color: blue; display: none;'>Deleted</div></div>"
        }).appendTo('#contentHeader');
        return $('#divDelCannedAnswer').html();
    }
    $(this).createDelDiv(summaryArray);
    
    $.fn.alterDelDiv = function(listOfAnswers) {
        /*setup the partial html for the deletion of a canned answer*/
        var deleteCanned = "<div id='delContent' style='padding: 2px 4px;'>";
        $.each(listOfAnswers, function(index, item) {
            deleteCanned += "<input type='checkbox' class='delCannedClass' id='del"+index+"' value='"+index+"'> " + item.substring(0, 35)+"<BR/>";
        });
        deleteCanned += "</div>";
        return deleteCanned;
    }

    
    $.fn.clickDefault = function(ddValue, dropdownDiv, className) {
        className = className || ".dropdownItem";
        console.log("className = "+(className));
        $(dropdownDiv).find(className+":contains('"+ddValue+"')").trigger('click');
        if(className !== ".dropdownItem") {
            var Value = $(dropdownDiv).find(className+":contains('"+ddValue+"')").parent().attr("value");  
        }else{
            var Value = $(dropdownDiv).find(className+":contains('"+ddValue+"')").attr("value"); 
        }
        console.log(dropdownDiv);
        console.log(Value);
        console.log(ddValue);    
    }

    /*When the selection is made in the canned answers drop down*/
    $('#cannedAnswers').change(function() {
        //get the text and the value from the dropdown list
        var textAns = $('#cannedAnswers option:selected').text();
        var valueAns = $('#cannedAnswers option:selected').val();
        //set the values of the fields equal to the drop down canned answers
        $("textarea").val(valueAns);
        // get the value of the index of the selected dropdown
        var Index = $('#cannedAnswers').prop('selectedIndex');
    });
    
    $('#cannedAnswers').click(function() { 
        // get the value of the index of the selected dropdown
        var Index = $('#cannedAnswers').prop('selectedIndex');
        console.log(Index);
       
    });
    
    /*prevent the right click context menu displaying when clicking the button*/
    $('#addCannedAnswer').bind('contextmenu', function(e) {
        e.preventDefault();
    });
    
    /*check right click on addCannedAnswer button*/
    $('#addCannedAnswer').mousedown(function(event) {
        switch (event.which) {
            //left click of the button
            case 1:
                if($('#addCannedAnswer').val() == "New Canned Answer ^") {
                    $('#divCannedAnswer').slideToggle('slow');
                }else{
                    $(this).createDelDiv(summaryArray);
                    $('#divDelCannedAnswer').slideToggle('slow');
                }
                break;
            // right click of the button
            case 3:
                if($('#addCannedAnswer').val() == 'New Canned Answer ^') {
                    $('#addCannedAnswer').val("Del Canned Answer ^");
                }else{
                    $('#addCannedAnswer').val("New Canned Answer ^");
                }
                break;
            default:
                alert('You have a strange Mouse!');
        }
    });
   
   /* copy the values that have been typed into the form and copy them to the canned answers form
      the values can then be saved as a canned answer */
   $('#copyCannedAnswer').click(function() {
       $("#addCannedSummary").val("Add a name");
       $("#addCannedDetail").val($("#contentBody").find("textarea").eq(0).val());
   });
   
   /* save the canned answer and also add the new canned answer to the dropdown box.*/
   $('#saveCannedAnswer').click(function() {
       $('#messageArea').fadeIn(1000);
       setTimeout(function() {
           $('#messageArea').fadeOut(1000);
           /*check if the signature is required*/
           $('#addCannedDetail').val($('#addCannedDetail').val().replace('<<Add Signature>>', signOff));
           //add the values and categories to the value monitoring arrays
           summaryArray.push($('#addCannedSummary').val());
           detailArray.push($('#addCannedDetail').val());
           console.log(summaryArray);
           console.log(detailArray);
           //set the global variables to the new array values
           GM_setValue("summary", JSON.stringify(summaryArray));
           GM_setValue("detail", JSON.stringify(detailArray)); 
           //add the new values to the drop down list
           $('#cannedAnswers').append($('<option/>', {
                value: $('#addCannedDetail').val(),
                text: $('#addCannedSummary').val()
            }));
           //reset the values in the canned answers form
           $('#addCannedDetail').val("");
           $('#addCannedSummary').val("");
           //add the new canned answer to the delete option on the delete div
           var htmlForDiv = $(this).alterDelDiv(summaryArray);
           $('#delContent').remove();
           $('#delContentWrapper').html(htmlForDiv);
       }, 1000);
       
   });
    
   $('#deleteCannedAnswer').click(function() {
       $('#messageDelArea').fadeIn(1000);
       setTimeout(function() {
           /*check to see if user wants to delete something*/
           var checked = $('input:checkbox:checked.delCannedClass').map(function() {
               return this.value;
           }).get();
           console.log(checked);
           if(checked.length) {
               /*save item descriptions to remove from array*/
               var summaryDescription   = [];
               var detailDescription    = [];

               $.each(checked, function(index, item) {
                   summaryDescription.push(summaryArray[item]);
                   detailDescription.push(detailArray[item]);
               });
               $.each(summaryDescription, function(index, item) {
                   /*remove the element in the summaryArray array*/
                   summaryArray = summaryArray.filter(function(list) {
                       return( list !== item);
                   });
                   /*remove the element in the detailArray array*/
                   detailArray = detailArray.filter(function(list) {
                       return ( list !== detailDescription[index]);
                   });
                   /*remove the option from the dropdown list*/
                   $("#cannedAnswers option:contains('"+item+"')").remove();
               });
               GM_setValue("summary", JSON.stringify(summaryArray));
               GM_setValue("detail", JSON.stringify(detailArray));
           }
           $('#messageDelArea').fadeOut(1000);
           var htmlForDiv = $(this).alterDelDiv(summaryArray);
           $('#divDelCannedAnswer').slideToggle('slow');
           $('#delContent').html(htmlForDiv);
       }, 1000);

   });

});
