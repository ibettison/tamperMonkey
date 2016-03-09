// ==UserScript==
// @name         setUpButtons
// @namespace    http://tampermonkey.net/
<<<<<<< HEAD
// @version      0.6
=======
// @version      0.5
>>>>>>> origin/master
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @description  when creating a new incident setup some buttons to help with the creation of the ticket. Allows default details to be entered and also canned answers\responses
// @author       Ian Bettison
// @updateURL    https://raw.githubusercontent.com/ibettison/tamperMonkey/master/setUpButtons.user.js
// @downloadURL  https://raw.githubusercontent.com/ibettison/tamperMonkey/master/setUpButtons.user.js
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/wd/object/create.rails?class_name=IncidentManagement*
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
    var category1Array          = [];
    var category2Array          = [];
    
    /*get existing canned answers*/
    var summaryCAs              = GM_getValue ("summary", "");
    var detailCAs               = GM_getValue("detail", "");
    var cat1CAs                 = GM_getValue("category1", "");
    var cat2CAs                 = GM_getValue("category2", "");
    
    /*setup temporary holding variables for the canned Answers*/
    if (summaryCAs) {
        /*convert string to array*/
        summaryArray            = JSON.parse (summaryCAs);
    }
    
    if (detailCAs) {
        /*convert string to array*/
        detailArray             = JSON.parse (detailCAs);
    }
    
    if (cat1CAs) {
        /*convert string to array*/
        category1Array          = JSON.parse (cat1CAs);
    }
    
    if (cat2CAs) {
        /*convert string to array*/
        category2Array          = JSON.parse (cat2CAs);
    }
    console.log(category1Array);
    console.log(category2Array);
    /*default values for new incident creation */
    var raisedUser              = "nib8";
    var raisedUserFull          = "Ian Bettison";
    var location                = "Clinical Platforms";
    var impact                  = "Low";
    var urgency                 = "Low";
    var responseLevel           = "Priority 4 - Low";
    var suggestedGroup          = "FMS IT SUPPORT";
    var ticketSource            = "Email";
    var linkToLanSweeper        = "http://crf-psrv:81/user.aspx?username=<<userName>>&userdomain=CAMPUS";
    /*variables for the signOff signature*/
    var FMSLocation             = "Clinical Platforms";
    var FMSTelephone            = "T: 0191 20 81271";
    var FMSEmail                = "E: ian.bettison@ncl.ac.uk";
    var signOff                 = "\n\nThanks for your attention,\n\n"+raisedUserFull+"\n"+FMSLocation+"\n"+FMSTelephone+"\n"+FMSEmail+"\n";

    /*setup the default responses to your canned answers here*/
    var cannedAnswersSummary    = ["Wireless Access Required",
                                "Wireless Access Patient Request",
                                "New User Access",
                                "Software Installation",
                                "Hardware Quotation"];
    var cannedAnswersDetail     = ["Please can I make a request for wireless access for a monitor who is visiting the {unitName} unit on {AddDate}.\n\n" + 
                                "They will be attending the unit for {noDays} day(s).The monitor's name is {monitorName}" + signOff,
                                "Please can I make a request for wireless access for a patient visiting the {unitName} unit on {AddDate} and will require access for {n} day(s)."+signOff,
                                "Please can you provide access for the following new user {name}. \n\nThey will require the same access as the {groupName}."+signOff,
                                "I would like to make a request for a software Installation. The software I require installing is {SoftwarePackage}.\n\n"+
                                "The package is to be installed on {My Current Computer Name} / {Another computer name} / {List of Computer Names}."+signOff,
                                "Please will you provide a quotation for the purchase of IT equipment. The equipment required is as follows: \n\nUniversity Standard Desktop PC."+signOff];
    var cannedAnswersCat1       = ["Access and Accounts",
                                  "Access and Accounts",
                                  "Filestore",
                                  "Software",
                                  "Hardware"];
    var cannedAnswersCat2       = ["Guest Wireless",
                                  "Guest Wireless",
                                  "Shared Filestore",
                                  "Software Installation",
                                  "Desktop PC"];
    /*The buttons added to the incident page*/
    $('#contentHeader').append($('<span style="padding-top: 4px;"><input type="button" class="pushButton" id="setDefaultValues" value="Default">' +
      ' Assign to Me:<input type="checkbox" class="pushButton" id="setAssignToMe" value=""> <select id="cannedAnswers" style="width: 200px;"><option disabled>Select a canned Answer</option></select></span>' +
                               ' Resolve on Creation:<input type="checkbox" class="pushButton" id="setResolve" value="">' +
                                '<input type="button" class="pushButton" id="addCannedAnswer" value="New Canned Answer ^">&nbsp;'));
    
    /*add the values of the canned answers set above to the dropdown box */
    for (var i=0;i<cannedAnswersSummary.length;i++){
        $('#cannedAnswers').append($('<option/>', {
            value: cannedAnswersDetail[i],
            text: cannedAnswersSummary[i]
        }));
    }
    /* Add a class name to the option in the select sa that a chack for when they are clicked can be performed NOT USED
    $('#cannedAnswers option').each(function() {
       $(this).addClass("ddOption"); 
    });*/
    
    
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
    
    /*if there are additional canned answers saved then add them*/
    if(category1Array.length){
        /*add the values from the additional canned answers */
        for (var i=0;i<category1Array.length;i++){
           cannedAnswersCat1.push(category1Array[i]); 
        }
    }
    
    /*if there are additional canned answers saved then add them*/
    if(category2Array.length){
        /*add the values from the additional canned answers */
        for (var i=0;i<category2Array.length;i++){
           cannedAnswersCat2.push(category2Array[i]); 
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
            '<div style="padding: 2px 4px;"><input class="textField" style="width: 90%; padding: 2px 4px;" type="text" id="addCannedCat1" placeholder="Incident Category Level 1" /></div>' +
            '<div style="padding: 2px 4px;"><input class="textField" style="width: 90%; padding: 2px 4px;" type="text" id="addCannedCat2" placeholder="Incident Category Level 2" /></div>' +
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
    
    /*default button pressed so add the default values to the related fields*/
    $('#setDefaultValues').click(function() {
        $('#mainForm-_ImpactDisplay').trigger('click'); 
        $('#mainForm-_IncidentUrgencyDisplay').trigger('click');
        $('#mainForm-_SuggestedGroupDisplay').trigger('click');
        $('#mainForm-_TicketSource1Display').trigger('click');
        $(this).clickDefault(impact, '#mainForm-_ImpactDisplay', '#mainForm-_Impact-Dropdown');     
        $(this).clickDefault(urgency, '#mainForm-_IncidentUrgencyDisplay', '#mainForm-_IncidentUrgency-Dropdown');       
        $('#mainForm-_Location').val(location);        
        $(this).clickDefault(suggestedGroup, '#mainForm-_SuggestedGroupDisplay', '#mainForm-_SuggestedGroup-Dropdown');        
        $(this).clickDefault(ticketSource,'#mainForm-_TicketSource1Display','#mainForm-_TicketSource1-Dropdown'); 
        $('#mainForm-ResponseLevelTitleDisplay').trigger('click');       
        $(this).clickDefault(responseLevel, '#mainForm-ResponseLevelTitleDisplay', '#mainForm-ResponseLevelTitle-Dropdown');
        $('#mainForm-RaiseUserTitleDisplay').val(raisedUser);
        $('#mainForm-RaiseUserTitleDisplay').focus();
  });
    
    $.fn.clickDefault = function(ddValue, displayDiv, dropdownDiv) {
        $(dropdownDiv).find(".dropdownItem:contains('"+ddValue+"')").trigger('click');
        var Value = $(dropdownDiv).find(".dropdownItem:contains('"+ddValue+"')").attr("value");                 
        console.log(Value);
        console.log(ddValue);    
    }
    
    /*toggle the click of the Assign to me checkbox*/
    $('#setAssignToMe').click(function() {
        $('#mainForm-_AssignToMe').trigger('click');
    });
    
    /*toggle the click of the Resolve on creation checkbox*/
    $('#setResolve').click(function() {
        $('#mainForm-_ResolveOnCreation').trigger('click');
    });
    
    /*When the selection is made in the canned answers drop down*/
    $('#cannedAnswers').change(function() {
        //get the text and the value from the dropdown list
        var textAns = $('#cannedAnswers option:selected').text();
        var valueAns = $('#cannedAnswers option:selected').val();
        //set the values of the fields equal to the drop down canned answers
        $('#mainForm-Description').val(valueAns);
        $('#mainForm-Title').val(textAns);
        // get the value of the index of the selected dropdown
        var Index = $('#cannedAnswers').prop('selectedIndex');
        //force a click on the Category level 1 Display to force a population of the dropdown div
        $('#mainForm-_IncidentCategoryLevel11Display').trigger('click');
        //send the canned answer and dropdown identifier and populate the value by simulating a click on the dropdown
        $(this).clickDefault(cannedAnswersCat1[Index-1], "#mainForm-_IncidentCategoryLevel11Display", "#mainForm-_IncidentCategoryLevel11-Dropdown");
        //force a click on the Category level 2 Display to force a population of the dropdown div
        $('#mainForm-_IncidentCategoryLevel21Display').trigger('click');
        //send the canned answer and dropdown identifier and populate the value by simulating a click on the dropdown
        $(this).clickDefault(cannedAnswersCat2[Index-1],"#mainForm-_IncidentCategoryLevel21Display", "#mainForm-_IncidentCategoryLevel21-Dropdown");                
    });
    
    $('#cannedAnswers').click(function() { 
        //continue the function until all fields are populated.
        var Index = $('#cannedAnswers').prop('selectedIndex');
        console.log(Index);
        if(Index !== 0){
            $('#mainForm-_IncidentCategoryLevel11Display').trigger('click');
            $(this).clickDefault(cannedAnswersCat1[Index-1], "#mainForm-_IncidentCategoryLevel11Display", "#mainForm-_IncidentCategoryLevel11-Dropdown");
            $('#mainForm-_IncidentCategoryLevel21Display').trigger('click');
            $(this).clickDefault(cannedAnswersCat2[Index-1],"#mainForm-_IncidentCategoryLevel21Display", "#mainForm-_IncidentCategoryLevel21-Dropdown"); 
        }
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
       $("#addCannedSummary").val($("#mainForm-Title").val());
       $("#addCannedDetail").val($("#mainForm-Description").val());
       $("#addCannedCat1").val($("#mainForm-_IncidentCategoryLevel11Display").val());
       $("#addCannedCat2").val($("#mainForm-_IncidentCategoryLevel21Display").val());
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
           category1Array.push($('#addCannedCat1').val());
           category2Array.push($('#addCannedCat2').val());
           console.log(summaryArray);
           console.log(detailArray);
           console.log(category1Array);
           console.log(category1Array);
           //set the global variables to the new array values
           GM_setValue("summary", JSON.stringify(summaryArray));
           GM_setValue("detail", JSON.stringify(detailArray)); 
           GM_setValue("category1", JSON.stringify(category1Array));
           GM_setValue("category2", JSON.stringify(category2Array));
           //add the new values to the drop down list
           $('#cannedAnswers').append($('<option/>', {
                value: $('#addCannedDetail').val(),
                text: $('#addCannedSummary').val()
            }));
           //reset the values in the canned answers form
           $('#addCannedDetail').val("");
           $('#addCannedSummary').val("");
           $('#addCannedCat1').val("");
           $('#addCannedCat2').val("");
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
               var category1Description = [];
               var category2Description = [];
               $.each(checked, function(index, item) {
                   summaryDescription.push(summaryArray[item]);
                   detailDescription.push(detailArray[item]);
                   category1Description.push(category1Array[item]);
                   category2Description.push(category2Array[item]);                           
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
                   /*remove the element in the category1Array array*/
                   category1Array = category1Array.filter(function(list) {
                       return ( list !== category1Description[index]);
                   });
                   /*remove the element in the category2Array array*/
                   category2Array = category2Array.filter(function(list) {
                       return ( list !== category2Description[index]);
                   });
                   /*remove the option from the dropdown list*/
                   alert(item);
                   $("#cannedAnswers option:contains('"+item+"')").remove();
               });
               GM_setValue("summary", JSON.stringify(summaryArray));
               GM_setValue("detail", JSON.stringify(detailArray));
               GM_setValue("category1", JSON.stringify(category1Array));
               GM_setValue("category2", JSON.stringify(category2Array));
           }
           $('#messageDelArea').fadeOut(1000);
           var htmlForDiv = $(this).alterDelDiv(summaryArray);
           $('#divDelCannedAnswer').slideToggle('slow');
           $('#delContent').html(htmlForDiv);
       }, 1000);
       
   });
    
   /*click on the machineName and open Lansweeper searching for username
   depends if logged on Behalf of user name is entered */
   $('#mainForm-_MachineName').click(function() {
       if(GM_getValue('machineName', "").length) {
           $('#mainForm-_MachineName').val(GM_getValue('machineName', ""));
           GM_setValue('machineName', "");
       }else{
           if(linkToLanSweeper !== "" && $('#mainForm-_MachineName').val() == ""){
               if($('#mainForm-_LoggedOnBehalfOfDisplay').val() !== "") {
                   window.open(linkToLanSweeper.replace("<<userName>>", $('#mainForm-_LoggedOnBehalfOfDisplay').val()), '_blank');
               }else{
                   window.open(linkToLanSweeper.replace("<<userName>>", $('#mainForm-RaiseUserTitleDisplay').val()), '_blank');
               }
           }
       }
          
   });
   
   /*searches lansweeper if the containing table and class containing the Computer name in lansweeper*/
   if($('table.wrapa').length) { //ignore if not found
       var linkText = [];
       $('table.wrapa').find('a').each(function() {
           console.log($(this).text());
           linkText.push($(this).text());
       });
       GM_setValue('machineName', linkText[1]);
   };
});





