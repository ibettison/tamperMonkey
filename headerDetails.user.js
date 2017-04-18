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
    var FMSLocation             = "Clinical Research Platforms";
    var FMSTelephone            = "T: 0191 20 84650";
    var FMSEmail                = "E: ian.bettison@ncl.ac.uk";
    var signOff                 = "\n\nThanks for your attention,\n\n"+raisedUserFull+"\n"+FMSLocation+"\n"+FMSTelephone+"\n"+FMSEmail+"\n";

    /*setup the default responses to your canned answers here*/
    var cannedAnswersSummary    = [];
    var cannedAnswersDetail     = [];
    
