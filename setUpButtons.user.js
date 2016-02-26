// ==UserScript==
// @name         setUpButtons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @description  setup the button to use when creating a new incident
// @author       Ian Bettison
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/wd/object/create.rails?class_name=IncidentManagement*
// @match        http://crf-psrv:81/user.aspx?username=*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/* jshint -W097 */
'use strict';

/**
* @function
* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
* @param {function} handler A function to execute at the time when the element is inserted
* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
* @example $(selector).waitUntilExists(function);
*/

$(document).ready(function() {
    /*setup global variables*/
    var summaryArray = [];
    var detailArray = [];
    /*get existing canned answers*/
    var summaryCAs = GM_getValue ("summary", "");
    var detailCAs = GM_getValue("detail", "");
    
    /*setup temporary holding variables for the canned Answers*/
    if (summaryCAs) {
        /*convert string to array*/
        summaryArray = JSON.parse (summaryCAs);
    }
    
    if (detailCAs) {
        /*convert string to array*/
        detailArray = JSON.parse (detailCAs);
    }
    
    /*default values for new incident creation */
    var raisedUser = "nib8";
    var raisedUserFull = "Ian Bettison";
    var location = "Clinical Platforms";
    var impact = "Low";
    var urgency = "Low";
    var level1Category = "Non-Central IT";
    var level2Category = "Non-IT Service Related incident";
    var linkToLanSweeper = "http://crf-psrv:81/user.aspx?username=<<userName>>&userdomain=CAMPUS";
    /*variables for the signOff signature*/
    var FMSLocation = "Clinical Platforms";
    var FMSTelephone = "T: 0191 20 81271";
    var FMSEmail = "E: ian.bettison@ncl.ac.uk";
    var signOff = "\n\nThanks for your attention,\n\n"+raisedUserFull+"\n\n"+FMSLocation+"\n\n"+FMSTelephone+"\n"+FMSEmail+"\n";

    /*setup the default responses to your canned answers here*/
    var cannedAnswersSummary = ["Wireless Access Required",
                                "Profile Reset",
                                "Rebuild PC",
                                "Folder Access",
                                "Apply Group Policy",
                                "Hardware Quotation"];
    var cannedAnswersDetail  = ["Please can I make a request for wireless access for a monitor who is visiting the {unitName} unit on {AddDate}.\n\n" + 
                                "They will be attending the unit for {noDays} day(s).The monitor's name is {monitorName}",
                               "I am having issues with my profile.",
                               "I have taken a look at {customerName}'s PC and it requires a rebuild.",
                               "Please can you provide access to the following list of {users}. They will need access to the following list of Folders.\n\n"+
                               "{folder list}",
                               "A request has been made for the installation of a group policy which will allow for the installation\setup of {policyOption}",
                               "Please will you provide a quotation for the purchase of IT equipment. The equipment required is as follows: \n\n{EquipmentList}"];
    
    /*The buttons added to the incident page*/
    $('#contentHeader').append($('<span style="padding-top: 4px;"><input type="button" class="pushButton" id="setDefaultValues" value="Default">' +
      ' Assign to Me:<input type="checkbox" class="pushButton" id="setAssignToMe" value=""> <select id="cannedAnswers" style="width: 250px;"><option>Select a canned Answer</option></select></span>' +
                               ' Resolve on Creation:<input type="checkbox" class="pushButton" id="setResolve" value="">' +
                                '<input type="button" class="pushButton" id="addCannedAnswer" value="New Canned Answer ^">&nbsp;'));
    
    /*add the values of the canned answers set above to the dropdown box */
    for (var i=0;i<cannedAnswersSummary.length;i++){
        $('#cannedAnswers').append($('<option/>', {
            value: cannedAnswersDetail[i],
            text: cannedAnswersSummary[i]
        }));
    }
    
    /*if there are additional canned answers saved then add them*/
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
            html: '<div class="groupBoxHeader">Add new canned Answer</div><div class="groupBoxContent" style="background-color: rgb(230,231,232); padding: 4px; min-height: 160px;">' +
            '<div style="padding: 2px 4px;"><input class="textField" style="width: 90%; padding: 2px 4px;" type="text" id="addCannedSummary" placeholder="Canned Summary" />' +
            '</div><div style="padding: 2px 4px;"><textarea style="width: 90%; height: 80px; padding: 2px 4px;" id="addCannedDetail" placeholder="Canned Detail"></textarea></div>' +
            '<div style="padding: 0 9px;"><input type="button" class="pushButton" id="saveCannedAnswer" value="save"> &lt;&lt;Add Signature&gt;&gt> adds your signature.</div><div id="messageArea" style="padding: 0 9px; color: blue; display: none;">Saved</div></div>'
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
            "<div id='delContent' style='padding: 2px 4px;'>" + deleteCanned + "</div><div style='padding: 4px 9px;'><strong>Select the answers to delete</strong></div>" +
            "<div style='padding: 0 9px;'><input type='button' class='pushButton' id='deleteCannedAnswer' value='delete'>" +
            "</div><div id='messageDelArea' style='padding: 0 9px; color: blue; display: none;'>Deleted</div></div>"
        }).appendTo('#contentHeader');
        return $('#divDelCannedAnswer').html();
    }
    $(this).createDelDiv(summaryArray);
    
    $.fn.alterDelDiv = function(listOfAnswers) {
        /*setup the partial html for the deletion of a canned answer*/
        var deleteCanned = "";
        $.each(listOfAnswers, function(index, item) {
            deleteCanned += "<input type='checkbox' class='delCannedClass' id='del"+index+"' value='"+index+"'> " + item.substring(0, 35)+"<BR/>";
        });
        
        return deleteCanned;
    }
    
    /*default button pressed so add the default values to the related fields*/
    $('#setDefaultValues').click(function() {
        
        $('#mainForm-RaiseUserTitleDisplay').val(raisedUser);
        $('#mainForm-_IncidentCategoryLevel11Display').trigger('click');
        var level1 = $("div.dropdownItem:contains('" + level1Category + "')").attr("value");
        console.log(level1);
        $('#mainForm-_IncidentCategoryLevel11Display').val(level1Category);
        $('#mainForm-_IncidentCategoryLevel11Display-Dropdown').val(level1);
        
        $('#mainForm-_IncidentCategoryLevel21Display').trigger('click');
        var level2 = $("div.dropdownItem:contains('" + level2Category + "')").attr("value");
        console.log(level2);
        $('#mainForm-_IncidentCategoryLevel21Display').val(level2Category);
        $('#mainForm-_IncidentCategoryLevel21Display-Dropdown').val(level2);
        
        $('#mainForm-_ImpactDisplay').val(impact);
        $('#mainForm-_IncidentUrgencyDisplay').val(urgency);
        $('#mainForm-_Location').val(location);
    });
    
    $('#setAssignToMe').click(function() {
        $('#mainForm-_AssignToMe').trigger('click');
    });
    
    $('#setResolve').click(function() {
        $('#mainForm-_ResolveOnCreation').trigger('click');
    });
    
    $('#cannedAnswers').change(function() {
        var textAns = $('#cannedAnswers option:selected').text();
        var valueAns = $('#cannedAnswers option:selected').val();
        $('#mainForm-Description').val(valueAns);
        $('#mainForm-Title').val(textAns);
    });
    
    /*prevent the right click context menu displaying when clicking the button*/
    $('#addCannedAnswer').bind('contextmenu', function(e) {
        e.preventDefault();
    });
    
    /*check right click on addCannedAnswer button*/
    $('#addCannedAnswer').mousedown(function(event) {
        switch (event.which) {
            case 1:
                if($('#addCannedAnswer').val() == "New Canned Answer ^") {
                    $('#divCannedAnswer').slideToggle('slow');
                }else{
                    $(this).createDelDiv(summaryArray);
                    $('#divDelCannedAnswer').slideToggle('slow');
                }
                break;
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
    
   $('#saveCannedAnswer').click(function() {
       $('#messageArea').fadeIn(1000);
       setTimeout(function() {
           $('#messageArea').fadeOut(1000);
           /*check if the signature is required*/
           $('#addCannedDetail').val($('#addCannedDetail').val().replace('<<Add Signature>>', signOff));
           summaryArray.push($('#addCannedSummary').val());
           detailArray.push($('#addCannedDetail').val());
           console.log(summaryArray);
           console.log(detailArray);
           GM_setValue("summary", JSON.stringify(summaryArray));
           GM_setValue("detail", JSON.stringify(detailArray));         
           $('#cannedAnswers').append($('<option/>', {
                value: $('#addCannedDetail').val(),
                text: $('#addCannedSummary').val()
            }));
           $('#addCannedDetail').val("");
           $('#addCannedSummary').val("");
           var htmlForDiv = $(this).alterDelDiv(summaryArray);
           $('#divDelCannedAnswer').remove().html(htmlForDiv);
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
               var summaryDescription = [];
               var detailDescription = [];
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
                   alert(item);
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





