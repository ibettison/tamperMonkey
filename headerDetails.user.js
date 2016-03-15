    /*default values for new incident creation */
    var raisedUser              = "ndw28";
    var raisedUserFull          = "David Whiteoak";
    var location                = "Clinical Platforms";
    var impact                  = "Low";
    var urgency                 = "Low";
    var responseLevel           = "Priority 4 - Low";
    var suggestedGroup          = "FMS IT SUPPORT";
    var ticketSource            = "Email";
    var linkToLanSweeper        = "http://crf-psrv:81/user.aspx?username=<<userName>>&userdomain=CAMPUS";
    /*variables for the signOff signature*/
    var FMSLocation             = "Clinical Research Platforms";
    var FMSTelephone            = "T: 0191 20 81280";
    var FMSEmail                = "E: david.whiteoak@ncl.ac.uk";
    var signOff                 = "\n\nThanks for your attention,\n\n"+raisedUserFull+"\n"+FMSLocation+"\n"+FMSTelephone+"\n"+FMSEmail+"\n";

    /*setup the default responses to your canned answers here*/
    var cannedAnswersSummary    = ["IN:Wireless Access Required",
                                "IN:Wireless Access Patient Request",
                                "IN:New User Access",
                                "IN:Software Installation",
                                "IN:Hardware Quotation"];
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
