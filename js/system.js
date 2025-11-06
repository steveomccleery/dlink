/* System page */

var domainNameExt = new Array('.com', '.net', '.aero', '.asia', '.cat', '.jobs', '.org', '.biz', '.coop', '.info', '.museum', '.name', '.pro', '.tel', '.travel', '.edu', '.gov', '.int', '.mil', '.mobi', '.ac', '.ad', '.ae', '.af', '.ag', '.ai', '.al', '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw', '.ax', '.az', '.ba', '.bb', '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm', '.bn', '.bo', '.br', '.bs', '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc', '.cd', '.cf', '.cg', '.ch', '.ci', '.ck', '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cx', '.cy', '.cz', '.de', '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.er', '.es', '.et', '.eu', '.fi', '.fj', '.fk', '.fm', '.fo', '.fr', '.ga', '.gb', '.gd', '.ge', '.gf', '.gg', '.gh', '.gi', '.gl', '.gm', '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gw', '.gy', '.hk', '.hm', '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io', '.iq', '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki', '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li', '.lk', '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.me', '.mg', '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt', '.mu', '.mv', '.mw', '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng', '.ni', '.nl', '.no', '.np', '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf', '.pg', '.ph', '.pk', '.pl', '.pm', '.pn', '.pr', '.ps', '.pt', '.pw', '.py', '.qa', '.re', '.ro', '.rw', '.ru', '.sa', '.sb', '.sc', '.sd', '.se', '.sg', '.sh', '.si', '.sj', '.sk', '.sl', '.sm', '.sn', '.so', '.sr', '.st', '.sv', '.sy', '.sz', '.tc', '.td', '.tf', '.tg', '.th', '.tj', '.tk', '.tm', '.tn', '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz', '.ua', '.ug', '.uk', '.um', '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi', '.vn', '.vu', '.ws', '.wf', '.ye', '.yt', '.yu', '.za', '.zm', '.zw');

function system_default() {
	datatable('tf1_inboxTbl');
}

function system_about() {
	system_config_get();
	//showTabs();
	cp_about_sys();
	//cp_nw_usage();
	cp_up_5s();	
	system_about_template();
}

function system_about_template() {
	system_firmwareupgrade_get();
	sys_uptime = ui_config.Dyn_Status["up_5s"]["system_uptime"];
	
	var tmpl_about_data = {
					"SW_ver":ui_config["fw_info"]["curr_ver"],	
					"hw_ver":ui_config.Dyn_Status["about_sys"]["hw_ver"],
					"imei":ui_config.Dyn_Status["about_sys"]["imei"],
					"imsi":ui_config.Dyn_Status["about_sys"]["imsi"],
					"iccid":ui_config.Dyn_Status["wan_status"]["iccid"],
					"modelname":ui_config["modelinfo"]["SKU"]["model_name"],
					"capacity":ui_config.Dyn_Status["up_5s"]["battery"]["capacity"],
					"uptime":sys_uptime
	};   
	   
   var pagefn = doT.template(document.getElementById('aboutTemplate').text);
   $("#tf1_tmpl_sys_information").html(pagefn(tmpl_about_data));
   
}

/* System Management Settings */
function systemManagement_onloadImportProfiles() {
	showTabs();
	$.cachedScript( "js/ajaxfileupload.js" ).done(function( script, textStatus ) {
		//console.log( textStatus);
	});

}

/* System Management Settings */
function systemManagement_onloadExportProfiles() {
	showTabs();
}

/**
 * function for validate form when user clicks on submit button
 * OnSubmit event
 * @method system_userAccountValidate
 * @param frmId - Form ID
 */
function system_userAccountValidate(frmId) {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_userName,"+ global_lang['validation_msgs']['pls_enter_valid_user_name'];	

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;

	var pwdObj = document.getElementById('tf1_passwd');
	var cnfmPwdObj = document.getElementById('tf1_cnfPassword');

	if (pwdObj.value != cnfmPwdObj.value) {
		dialogAlert(global_lang['validation_msgs']['cfpwd_not_match']);
		document.getElementById('tf1_passwd').focus();
		return false;
	}
	
	//setHiddenChks(frmId);
 	var old_psw = $("#tf1_oldPassword").val();
    var new_paw = $("#tf1_passwd").val();
    var auto_timeout = $("#tf1_auto_logout").val();
	for(var i = 0;i < new_paw.length; i++) {
		 if(new_paw.charCodeAt(i) > 127){
			alert(global_lang["system_popup"]["passwd_nonEnglish"]);
			return;
		}
	        else if(new_paw.charCodeAt(i) == 34){
			alert(global_lang["system_popup"]["passwd_incQuota"]);
			return;
		}
	}
   // auto_timeout = auto_timeout * 60;
	var Hashpass =  CryptoJS.MD5(new_paw);
	var Hashuname = CryptoJS.MD5(old_psw);
    systemApi_accountSet(Hashuname,Hashpass,auto_timeout);
}

function system_updateTimeOut() {

    var auto_timeout = $("#tf1_auto_logout").val();
    UpdateTimeout(auto_timeout);
}

/**
 * uploading the file
 * @method  system_settingsProfilefileUploadCheck
 * @param fileId - Form field ID
 * @param errMsg - Error message to alert
 */
function system_settingsProfilefileUploadCheck(fileId, errMsg) {
	var obj = document.getElementById(fileId);
	var ret = obj.value.match(/\.sav$/);
	if(!ret)
	{
		dialogAlert(global_lang['alerts_set']['restore_error']);
		return ;
	}
	if (!obj || obj.disabled)
		return false;
	if (obj.value == "")
		dialogAlert(errMsg);
	if (obj.value.length > 0)
		//dialogAlert("This mock-up version does not support form actions", "Information", "info");
		system_restore();
}

/**
 * function for validate form when user clicks on submit button
 * OnSubmit event
 * @method system_settingsProfileConfig
 * @param frmId - Form ID
 */
function system_settingsProfileConfig() {
	var proceed = confirm(global_lang['alerts_set']['factory_default_settings'] + global_lang['alerts_set']['warning_msg'], '');
	if (proceed) {
		//dialogAlert("This mock-up version does not support form actions", "Information", "info");
	}

}

/* Network Statistics starts */

function system_onloadNetworkStatsPacketData() {
	//system_netstat_get2();
	system_packetdat_template();
	showTabs();	
	//$("#tf1_btnBlock").hide();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
}

function system_NetworkStatsPacketDataValidate(frmId) {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_maxlimitPacketdata,"+ global_lang['validation_msgs']['pls_enter_max_limit_packet_data'];
	txtFieldIdArr[1] = "tf_dataUsage,"+ global_lang['validation_msgs']['pls_enter_data_usage'];

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;

	maxlimit = $("#tf1_maxlimitPacketdata").val();
	systemApi_packetdata_set(maxlimit);

}

function system_NetworkStatsPacketDataReset(frmId) {
	$("#" + frmId).reset();
}

function system_onloadNetworkStatistics() {
	showTabs();
	system_networkstat_template();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
}

function system_onloadNetworkStatsReports() {
	showTabs();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	datatable('tf1_systemNetworkStatsReports');
}

/* Network Statistics Ends */

/*Advanced Options starts */

function system_onloadAdvancedOptUpnp() {

	showTabs();
	//$("#tf1_btnBlock").hide();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());

	onloadCall();
	system_Upnp_get();
	system_Upnpstatus_template();
}



function system_advancedOptUpnpReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
}

function system_advancedOptUpnpvalidate(frmId) {
	var status;
	if ($("#css_tf1_Upnpenabledisable").attr("class") == "enable-disable-on")
		status = 1;
	else
		status = 2;
	systemApi_UpnpSet(status);
}

function system_onloadAdvancedOptPowerSaving() {
	
	system_powersaving_get();
	system_powersaving_template();
	system_powersavingMode();
	showTabs();
	//$("#tf1_btnBlock").hide();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	onloadCall();
}

/**
 * This function calls when user selects drop down item from "powersaving Mode" select box
 * Select box onchange event
 * @method system_powersavingMode
 */
function system_powersavingMode() {
	/* This function is Global from globalMgmt.js */
	var powersavingMode = parseInt(comboSelectedValueGet('tf1_batteryidleTime'), 10);
	
	if (powersavingMode == 0) {//Disable
		$("#tf1_deepsleepTime").val(0);
		vidualDisplay('tf1_deepsleepTime', 'hide');
		vidualDisplay('break_deepsleepTime', 'hide');
	}else {// After [1,3,5 Minutes]
		vidualDisplay('tf1_deepsleepTime', 'configRow');
		vidualDisplay('break_deepsleepTime', 'break');
			
	}


}

function system_advancedOptPowerSavingReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
	system_powersavingMode();
}

function system_advancedOptPowerSavingvalidate(frmId) {
	suspendst =$("#tf1_batteryidleTime").val();
	deepslepst =$("#tf1_deepsleepTime").val();
	systemApi_powersavingSet(suspendst,deepslepst);
}

function systemApi_powersavingSet(suspendst,deepslepst){
	
	var request = $.ajax({
	    type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "set_power_save",
			batteryidletime: suspendst,
			deepsleeptime: deepslepst,
			token: session_token
		},
	    dataType: "json"
	});
		
    request.done(function( responseData,textStatus, jqXHR ) {  
    	if(responseData.result == "AUTH_FAIL")
		{
			window.location = "login.html";
			return;
		}
		if(responseData.result == "Token_mismatch")
		{
			window.location = "login.html";
			return;
		}
		if(responseData.result == "SUCCESS")
		{
			alert(global_lang["system_popup"]["set_power_saving_success"]);	
		}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {     
    	dialogAlert(global_lang["system_popup"]["set_power_saving_error"]);	
   });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function system_onloadAdvancedStandByMode() {
	showTabs();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	onloadCall(system_enableDisableadvancedStandByModeonload, {
		imageId : '',
		disableIndividual : '',
		disableGrp : '',
		enableIndividual : '',
		enableGrp : '',
		hideClass : 'hide',
		showClass : 'configRow',
		breakDivs : '',
		breakClass : 'break',
		imagesInfo : {
			disableImages : '',
			enableImages : '',
			disableClass : '',
			enableClass : ''
		}
	});
	enableTextFieldByAnchorClick('tf1_enableAutoStandbyMode', 'tf1_standbyMode tf1_hibernateMode tf1_autoPoweroff', 'break_standbyMode break_hibernateMode break_autoPoweroff', '');
}

function system_advancedStandByModeReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
	enableTextFieldByAnchorClick('tf1_enableAutoStandbyMode', 'tf1_standbyMode tf1_hibernateMode tf1_autoPoweroff', 'break_standbyMode break_hibernateMode break_autoPoweroff', '');
}

function system_userAccountReset(frmId) {
	$("#" + frmId).reset();
}

function system_advancedStandByModevalidate(frmId) {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_standbyMode,Please enter Stand by Mode in minutes";
	txtFieldIdArr[1] = "tf1_hibernateMode,Please enter Hibernate Mode in minutes";
	txtFieldIdArr[2] = "tf1_autoPoweroff,Please enter auto Power off minutes";

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	//dialogAlert("This mock-up version does not support form actions", "Information", "info");
}

/**
 * This function calls when user selects drop down item from "APN Mode" select box
 * Select box onchange event
 * @method apnModeSelect
 */
function system_enableDisableadvancedStandByModeonload(toggleObj, thisObj) {
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	//alert(imgId);
	switch(imgId) {
		case 'tf1_enableAutoStandbyMode':
			enableTextFieldByAnchorClick('tf1_enableAutoStandbyMode', 'tf1_standbyMode tf1_hibernateMode tf1_autoPoweroff', 'break_standbyMode break_hibernateMode break_autoPoweroff', '');
			break;
	}
}

/*Advanced Options ends */

/* Firmware */

function system_firmwareUpgradeOnLoad() {


	system_firmwareupgrade_get();
	system_firmwareupgrade_template();
	system_upgradeTypeChange();
	/* loading Ajax file JS here */
	$.cachedScript( "js/ajaxfileupload.js" ).done(function( script, textStatus ) {
		//console.log( textStatus);
	});

}

function system_upgradeTypeChange() {

	var upgradeSelectMode = comboSelectedValueGet('tf1_upgradeRouter');

	$("#tf1_btnRemote").hide();
	$("#tf1_btnManual").hide();
	$("#tf1_btnRemoteStartUpdate").hide();
	$("#tf1_btnManualStartUpdate").hide();
	$("#tf1_Progressbar").hide();

	switch(upgradeSelectMode) {
		case "1" :
			// Manual

			fieldStateChangeWr('', '', 'tf1_systemUpgradeFile', '');
			vidualDisplay('tf1_systemUpgradeFile', 'configRow');
			vidualDisplay('break_systemUpgradeFile', 'break');
			$("#tf1_btnRemote").hide();
			$("#tf1_btnManualStartUpdate").show();

			break;

		case "2" :
			//Remote Server

			fieldStateChangeWr('tf1_systemUpgradeFile', '', '', '');
			vidualDisplay('tf1_systemUpgradeFile', 'hide');
			vidualDisplay('break_systemUpgradeFile', 'hide');
			$("#tf1_btnRemote").show();
			$("#tf1_btnManual").hide();

			break;
	}

	
}

function system_firmWareCheckFile() {

	if ($("#tf1_openFile").val() == "") {
		dialogAlert(global_lang['validation_msgs']['pls_browse_file']);
		return;
	}

	var filename = $("#tf1_openFile").val();

	// Use a regular expression to trim everything before final dot
	var extension = filename.replace(/^.*\./, '');

	// Iff there is no dot anywhere in filename, we would have extension == filename,
	// so we account for this possibility now
	if (extension == filename) {
		extension = '';
	} else {
		// if there is an extension, we convert to lower case
		// (N.B. this conversion will not effect the value of the extension
		// on the file upload.)
		extension = extension.toLowerCase();
	}
	if (extension != "bin") {
		//dialogAlert("Please Upload a valid firmware upgrade file of .bin extension");
		return
	}

	$("#tf1_btnManual").hide();
	$("#tf1_btnManualStartUpdate").show();

}

function showUpgradeProcess() {
	//$("#tf1_Progressbar").show();
	$("#tf1_ProgressBakbar").show();
	$("#tf1_frm_statusBar span").width("0%");
	$("#tf1_manualSt_init").addClass("active");
	$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['validation_msgs']['start_down']);
	system_api_fota_autoupgrade();
	//dialogAlert("This mock-up version does not support form actions", "Information", "info");

}

function showUpgradeProcess1() {

	if ($("#tf1_WebFUpload").val() == "") {
		dialogAlert(global_lang['validation_msgs']['pls_browse_file']);
		return;
	}

	var filename = $("#tf1_WebFUpload").val();

	// Use a regular expression to trim everything before final dot
	var extension = filename.replace(/^.*\./, '');

	// Iff there is no dot anywhere in filename, we would have extension == filename,
	// so we account for this possibility now
	if (extension == filename) {
		extension = '';
	} else {
		// if there is an extension, we convert to lower case
		// (N.B. this conversion will not effect the value of the extension
		// on the file upload.)
		extension = extension.toLowerCase();
	}
	if (extension != "bin") {
		dialogAlert(global_lang['validation_msgs']['pls_upload_firmware_zip']);
		return
	}
	$("#tf1_Progressbar").show();
	$("#tf1_frm_statusBar span").width("0%");
	system_api_firmware_manual();
	 
}

function showRemoteUpgradeProcess() {

	$("#tf1_btnRemote").hide();
	system_api_autocheck();
	
}

function system_clearAllData() {
	systemApi_network_clearStat();

	var tmpl_nwstat_data = {
					"upload_mb":0,
					"download_mb":0,
					"total_mb":0
				};   
 	
   var pagefn = doT.template(document.getElementById('networkstatTemplate').text);   
   $("#tf1_tmpl_netusage_info").html(pagefn(tmpl_nwstat_data));
}

function device_adminAccountOnload() {
	


    showTabs();
    system_accountinfo_get();
    system_accountinfo_template();
   // $("#tf1_btnBlock").hide();
    $("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
}

function device_adminLangOnload() {	
	$("#tf1_btnBlock").hide();
     $("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
     showTabs();
	systemApi_languageGet();
     system_language_template();    

    $("#tf1_btnBlock input.apply").val(global_lang["common"]["apply"]);
	$("#tf1_btnBlock input.cancel").val(global_lang["common"]["cancel"]);
	$("#tf1_btnBlock").show();
}

function device_adminLangOnReset(frmId) {
	 $("#" + frmId).reset();
}

function languageApply() {	
	//alert(global_lang['alerts_set']['language_save_success1']);	
	systemApi_languageSet($("#tf1_deviceLanguage").val());   
}

function system_showKey(event,keyId) {

	if ($(event.target).is(':checked')) {
		$("#"+keyId).attr("type","text");
	} else {		
		$("#"+keyId).attr("type","password");		
		
	}
	
}

/* Administration time js */





function deviceTimeOnload() {	
	system_sntp_get();		
	system_sntp_template();
	
	onloadCall(timeEnbaleDisableOnload, {imageId:'tf1_sntpEnableDisable', disableIndividual:'tf1_primarySntpServer tf1_secondarySntpServer tf1_tertiarySntpServer tf1_synchronization', disableGrp:'', enableIndividual:'', enableGrp:'', hideClass:'hide', showClass:'configRow', breakDivs:'break_primarySntpServer break_secondarySntpServer break_tertiarySntpServer  break_synchronization', breakClass:'break', imagesInfo:{disableImages:'', enableImages:'', disableClass:'', enableClass:''}});
	
	timeEnbaleDisableOnload({imageId:'tf1_sntpEnableDisable', disableIndividual:'tf1_primarySntpServer tf1_secondarySntpServer tf1_tertiarySntpServer tf1_synchronization', disableGrp:'', enableIndividual:'', enableGrp:'', hideClass:'hide', showClass:'configRow', breakDivs:'break_primarySntpServer break_secondarySntpServer break_tertiarySntpServer break_synchronization', breakClass:'break', imagesInfo:{disableImages:'', enableImages:'', disableClass:'', enableClass:''}});

    $("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());

	
	if ($("#tf1_sntpEnableDisable").attr("class") == "enable-disable-off" ) {
		$("#tf1_setDateTimeBlock_div").attr("class","");
		$("#tf1_synchronization_hide").attr("class","hide");
		$("#tf1_setSNTPserver_Block_div").attr("class","hide");		
	} else {
		
		$("#tf1_setDateTimeBlock_div").attr("class","hide");
		$("#tf1_synchronization_hide").attr("class","");
		$("#tf1_setSNTPserver_Block_div").attr("class","");
	}
	
	
	var curr = new Date().getFullYear();
			var opt = {}			
			opt.datetime = {preset: 'datetime',minDate: new Date(2000,3,10,9,22),maxDate: new Date(2099,7,30,15,44),stepMinute: 1,dateFormat:"yy-mm-dd"};
			$('#tf1_setDateTime').val($('#tf1_setDateTimeValue').val());
			$('#tf1_setDateTime').scroller('destroy').scroller(
				$.extend(
					opt["datetime"], { 					
						mode: "scroller", 
						display: "inline" 
					}
				)			
			);

	 
	
}


function timeEnbaleDisableOnload(data){
	
	onAnchorToggle(data);	
	if ($("#tf1_sntpEnableDisable").attr("class") == "enable-disable-off" ) {
		$("#tf1_setDateTimeBlock_div").attr("class","");
		$("#tf1_synchronization_hide").attr("class","hide");
		$("#tf1_setSNTPserver_Block_div").attr("class","hide");		
	} else {
		
		$("#tf1_setDateTimeBlock_div").attr("class","hide");
		$("#tf1_synchronization_hide").attr("class","");
		$("#tf1_setSNTPserver_Block_div").attr("class","");
	}
}


function timeSntpApply() {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_primarySntpServer,"+ global_lang['validation_msgs']['pls_enter_primary_server'];
	txtFieldIdArr[1] = "tf1_secondarySntpServer,"+ global_lang['validation_msgs']['pls_enter_Secondary_server'];
	txtFieldIdArr[2] = "tf1_tertiarySntpServer,"+ global_lang['validation_msgs']['pls_enter_teritary_server'];
	txtFieldIdArr[3] = "tf1_synchronization,"+ global_lang['validation_msgs']['pls_enter_sync_cycle'];
	
	/* When SNTP is off */
	if ($("#tf1_sntpEnableDisable").attr("class") == "enable-disable-off" ) {
		txtFieldIdArr[4] = "tf1_setDateTimeValue,"+ global_lang['validation_msgs']['pls_select_dataTime'];	
	}	
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
		
	if (ipaddrValidateCommon('tf1_primarySntpServer') == false) 
        return false;
    
    if (ipaddrValidateCommon('tf1_secondarySntpServer') == false) 
        return false;
		
	 if (ipaddrValidateCommon('tf1_tertiarySntpServer') == false) 
        return false;
	
	var SyncObj = document.getElementById("tf1_synchronization");
    if (!numericValueRangeCheck(SyncObj, '', '', 1, 24, true, global_lang['validation_msgs']['invalid_sync_cycle'], '')) 
        return false;
	
	/* When SNTP is off */
	if ($("#tf1_sntpEnableDisable").attr("class") == "enable-disable-off" ) { 
		if ($("#tf1_setDateTimeValue").val().indexOf("NaN") >= 0){	
			alert(global_lang['validation_msgs']['pls_select_dataTime']);
			return false;
		}
		if ($("#tf1_setDateTimeValue").is(':disabled') == false && $("#tf1_setDateTimeValue").val() == "_ _ / _ _ / _ _ _ _   _ _ : _ _ _ _"){	
			alert(global_lang['validation_msgs']['pls_select_dataTime']);
			return false;
		}
	
	}
	status1 = $("#tf1_sntpEnableDisableValue").val();
	timezone = $("#tf1_timezone").val();
	up_period = $("#tf1_synchronization").val();
	server1 = $("#tf1_primarySntpServer").val();
	server2 = $("#tf1_secondarySntpServer").val();
	server3 = $("#tf1_tertiarySntpServer").val();
	systemApi_SntpSet(status1,timezone,up_period,server1,server2,server3);
	
	/* When SNTP is off */
	if ($("#tf1_sntpEnableDisable").attr("class") == "enable-disable-off" ) { 
		date1 = $("#tf1_setDateTimeValue").val();
		//var dateObject = new Date(date1);
		//var dateStr = $.scroller.formatDate("yyyy-mm-dd HH:ii:00",dateObject);
		systemApi_datetimeSet(date1);
		
	}
	alert(global_lang['alerts_set']['setting_save_success']);
	
	/* To get the modified time as latest one */
 					
	var request = $.ajax({
		type: "POST",
	    url: "cgi-bin/qcmap_web_cgi",       
		data: { Page: "GetNtpClient",mask: 0, token: session_token},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
    		ui_config.Dyn_Status["up_5s"]["system_date"] = responseData.currentTime;
			ui_config["sntp"]["SNTP"]["enable"] = $("#tf1_sntpEnableDisableValue").val();
			ui_config["sntp"]["SNTP"]["server1"] = responseData.NTPServer1;
			ui_config["sntp"]["SNTP"]["server2"] = responseData.NTPServer2;
			ui_config["sntp"]["SNTP"]["server3"] = responseData.NTPServer3;
			ui_config["sntp"]["SNTP"]["timezone"] = responseData.timeZone;
			ui_config["sntp"]["SNTP"]["update_period"] = responseData.ntp_syncInterval;
			HideDialog('tf1_dialog', 'tf1_overlay');
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
	
	$("#tf1_dateTime").trigger("click");
    
}

function timeEnbaleDisableOnReset(frmId){
    $("#" + frmId).reset();
	resetImgOnOff(frmId);
	timeEnbaleDisableOnload({imageId:'tf1_sntpEnableDisable', disableIndividual:'tf1_primarySntpServer tf1_secondarySntpServer tf1_tertiarySntpServer tf1_synchronization', disableGrp:'tf1_setDateTimeBlock', enableIndividual:'', enableGrp:'tf1_setDateTimeBlock', hideClass:'hide', showClass:'configRow', breakDivs:'break_primarySntpServer break_secondarySntpServer break_tertiarySntpServer  break_synchronization', breakClass:'break', imagesInfo:{disableImages:'', enableImages:'', disableClass:'', enableClass:''}});

}

function device_adminUssdOnload(frmId) {
	 $("#" + frmId).reset();
     $("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());

}

/*system Backup*/
function system_backUp(){
	systemApi_backUp();
}


/*system Reboot */
function system_reboot(){

if( win.confirm(global_lang["login1"]["information"],global_lang["system_popup"]["reboot_dialog"],function (r){
//win.alertEx('结果：' + (r ? "是" : "不是"))
	if(r){systemApi_reboot();}
	})){
                
	
	}else{return;}
    
}

/*system Reset to Default */
function system_resetTodefault(){
if( win.confirm(global_lang["login1"]["information"],global_lang["system_popup"]["reset_to_default_dialog"],function (r){
	if(r){systemApi_resetTodefault();}
	})){

	}else{return;}
}


/*Account template */
function system_accountinfo_template(){
	var tmpl_account_data = {
					"username":ui_config["account"]["DEVICE"]["web_usrname"],
					"password":ui_config["account"]["DEVICE"]["web_passwd"],
					"login_time":ui_config["account"]["DEVICE"]["login_timeout"]
	};   
   
   var pagefn = doT.template(document.getElementById('accountinfoTemplate').text);
   $("#tf1_tmpl_account_info").html(pagefn(tmpl_account_data));

}

/*Account template */
function system_language_template(){
	var tmpl_language_data = {
					"language":ui_config.Dyn_Status["up_5s"]["lang"]
				};   
   
   var pagefn = doT.template(document.getElementById('languageTemplate').text);
   $("#tf1_tmpl_language_info").html(pagefn(tmpl_language_data));

}


/*Network packetdata template */
function system_packetdat_template(){ 
	var tmpl_packet_data = {
					"packetdat_maxlimit":ui_config["net_stat"]["NWSTAT"]["quota_limit"]
				};   
  
   var pagefn = doT.template(document.getElementById('networkpacketdataTemplate').text);
   $("#tf1_tmpl_packetdata_info").html(pagefn(tmpl_packet_data));

}

/*Network network statistics template */
function system_networkstat_template(){ 
	var upload = (ui_config.Dyn_Status["nw_usage"]["tx"]/1048576).toFixed(2);
	var download = (ui_config.Dyn_Status["nw_usage"]["rx"]/1048576).toFixed(2);
	var total = parseInt(ui_config.Dyn_Status["nw_usage"]["tx"]) + parseInt(ui_config.Dyn_Status["nw_usage"]["rx"]);

	total = total/1048576;
	if (upload > 1 || download > 1) {
		unit =" MB";
	}
	else {
		upload = (ui_config.Dyn_Status["nw_usage"]["tx"]/1024).toFixed(2) ;
		download = (ui_config.Dyn_Status["nw_usage"]["rx"]/1024).toFixed(2);
		total = total * 1024;
		unit =" KB";
	}

	var total_str = total.toFixed(2) + "<span>" + unit + "</span>" ;
	
	var upload_str = upload + unit;
	
	var download_str = download + unit;

	var tmpl_nwstat_data = {
					 "upload_mb": upload_str,
					 "download_mb":download_str,
					 "total_mb":total_str
				};   
 	
   var pagefn = doT.template(document.getElementById('networkstatTemplate').text);   
   $("#tf1_tmpl_netusage_info").html(pagefn(tmpl_nwstat_data));

}


/*Sntp(Date & Time) template */
function system_sntp_template(){
	
	dateSplit = ui_config.Dyn_Status["up_5s"]["system_date"].split(" ");
	datepart1 = dateSplit[0];
	datepart2 = dateSplit[1];
	datepart1Split = datepart1.split("/");
	datepart2Split = datepart2.split(":");

    var tmpl_sntp_data = {
					  "enableSntp":ui_config["sntp"]["SNTP"]["enable"],
					  "primarySntp":ui_config["sntp"]["SNTP"]["server1"],
					  "secondarySntp":ui_config["sntp"]["SNTP"]["server2"],
					  "tertiarySntp":ui_config["sntp"]["SNTP"]["server3"],
		  			  "timezone":ui_config["sntp"]["SNTP"]["timezone"],


					  "synccycle":ui_config["sntp"]["SNTP"]["update_period"],
					  "dateTime":ui_config.Dyn_Status["up_5s"]["system_date"],
   };
   var pagefn = doT.template(document.getElementById('sntpinfoTemplate').text);
   $("#tf1_tmpl_sntp_info").html(pagefn(tmpl_sntp_data));

}

/*firmware Upgrade template */
function system_firmwareupgrade_template(){
	var tmpl_fwinfo_data = {
					"Current_ver":ui_config["fw_info"]["curr_ver"],
					"Mode":ui_config["fw_info"]["state"]["mode"]										
	};   
	   
   var pagefn = doT.template(document.getElementById('fwinfoTemplate').text);
   $("#tf1_tmpl_fw_info").html(pagefn(tmpl_fwinfo_data));

}

/*Upnp Status template */
function system_Upnpstatus_template(){
	var tmpl_upnpstatus_data = ui_config["Upnp_status"]["Upnp"]["enable"];	
	   
   var pagefn = doT.template(document.getElementById('UpnpstatusTemplate').text);
   $("#tf1_tmpl_Upnp_status").html(pagefn(tmpl_upnpstatus_data));

}

function system_powersaving_get(){
	var request = $.ajax({
	    type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "get_power_save",
			token: session_token
		},
	    dataType: "json"
	});
		
    request.done(function( responseData,textStatus, jqXHR ) {  
    	if(responseData.result == "AUTH_FAIL")
		{
			window.location = "login.html";
			return;
		}
		if(responseData.result == "Token_mismatch")
		{
			window.location = "login.html";
			return;
		}
		if(responseData.result == "SUCCESS")
		{
			ui_config["powersaving"]["PWRMGR"]["batt_idle_tm"]=responseData.batteryidletime;
			ui_config["powersaving"]["PWRMGR"]["deep_sleep_tm"]=responseData.deepsleeptime;
		}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {     
   });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

/*powersaving template */
function system_powersaving_template(){
	var tmpl_powersave_data = {
					"batteryidletime":ui_config["powersaving"]["PWRMGR"]["batt_idle_tm"],
					"deepsleeptime":ui_config["powersaving"]["PWRMGR"]["deep_sleep_tm"]
				//	"poweroffidletime":ui_config["powersaving"]["PWRMGR"]["pwroff_idle_tm"]
				};   
   var pagefn = doT.template(document.getElementById('powersavingTemplate').text);
   $("#tf1_tmpl_powersave").html(pagefn(tmpl_powersave_data));

}


