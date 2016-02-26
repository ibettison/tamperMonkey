// ==UserScript==
// @name         getHeskData
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @description  store the value of the ticket inside variables
// @author       Ian Bettison
// @match        https://internal.ncl.ac.uk/crcsupport/hesk/admin/edit_post.php*
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/wd/object/create.rails?class_name=IncidentManagement*
// @match        https://nuservice.ncl.ac.uk/LDSD.WebAccess.Integrated/ss/object/createInCart.rails?class_name=RequestManagement*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
$(document).ready(function() {
    GM_setValue("UserName", "nib8");
    if($('textarea[name="message"]').length){ 
        var subject = $('input[name="subject"]').val();
        GM_setValue("subjectHesk", subject);
        var name = $('input[name="name"]').val();
        GM_setValue("nameHesk", name);
        var email = $('input[name="email"]').val();
        GM_setValue("emailHesk", email);
        var phone = $('input[name="custom1"]').val();
        GM_setValue("phoneHesk", phone)
        var message = $('textarea[name="message"]').val();
        GM_setValue("messageHesk", message);
        var location = $('select[name="custom2"]').val();
        GM_setValue("locationHesk", location);
    }else{
       if($('textarea[name="Description"]').length) {
           $('input[id="mainForm-_LoggedOnBehalfOfDisplay"]').val(GM_getValue("nameHesk", ""));
           $('textarea[name="Description"]').val(GM_getValue("messageHesk", ""));
           $('input[id="mainForm-_OnBehalfOfEmail"]').val(GM_getValue("emailHesk", ""));
           $('input[id="mainForm-_BehalfOfPhone"]').val(GM_getValue("phoneHesk", ""));
           $('input[id="mainForm-RaiseUserTitleDisplay"]').val(GM_getValue("UserName", ""));
           $('input[id="mainForm-Title"]').val(GM_getValue("subjectHesk", ""));
           $('input[id="mainForm-_Location"]').val(GM_getValue("locationHesk", ""));
       }
    }
    
})