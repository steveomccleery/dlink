/* Internet Settings */

function internet_default() {
	datatable('tf1_inboxTbl');
}

function internet_onloadInternetsimcardPinlock(){
	
	internet_doGetSimPinStatus();
	internet_doGetSimStatus();
	internet_sim_template();
	
	
	onloadCall(internet_enableDisablesimpinprotection, {
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
	
	if($("#tf1_hid_screen").val() == "1") {
		enableTextFieldByAnchorClick('tf1_enabledisablePin', 'tf1_Pincode', 'break_Pincode', '');
	} else if($("#tf1_hid_screen").val() == "2"){
		internet_simpin_mode();
	} else {
		
	}
	
}

function internet_simpin_mode(){

	var selmode = radioCheckedValueGet('tf1_sim_mode');
	
	if(selmode == "1"){
	     fieldStateChangeWr('tf1_currentPin tf1_newPin tf1_cnfmPim', '', 'tf1_Pincode', '');
	     vidualDisplay('tf1_Pincode', 'configRow');
		 vidualDisplay('break_Pincode', 'break');
		 vidualDisplay('tf1_changePin_block', 'hide');
		
	}else {
		 fieldStateChangeWr('tf1_Pincode', '', ' tf1_currentPin tf1_newPin tf1_cnfmPim', '');
	     vidualDisplay('tf1_Pincode', 'hide');
		 vidualDisplay('break_Pincode', 'hide');
		 vidualDisplay('tf1_changePin_block', '');
	}

}


function internet_enableDisablesimpinprotection(toggleObj, thisObj) {
	
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	switch(imgId) {
		case 'tf1_enabledisablePin':
			enableTextFieldByAnchorClick('tf1_enabledisablePin', 'tf1_Pincode', 'break_Pincode', '');
			break;

	}
}


function internet_formClose(event) {

	if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}
	$(".configForm").show();
	$(".configTableForm").hide();

}

function internet_onloadInternetplmnConfig() {
	
	internet_plmnmode_get();
	internet_plmnget_template();

	$("#tf1_plmnButtons input.apply").val(global_lang["common"]["apply"]);
	$("#tf1_plmnButtons input.cancel").val(global_lang["common"]["cancel"]);
	//internet_plmnlistget_template();
	//datatable('tf1_internetOperators');
	internet_plmnMode();
	//onloadCall();	
 
	
}

function internet_onloadInternetlanConfig() {
	onloadCall(internet_enableDisableLanSettingsOnLoad, {
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

	enableTextFieldByAnchorClick('tf1_internetEnableLan', '', '', 'tf1_dhcpService');
	lan_info();	
}


/**
 * function for validate form when user clicks on submit button
 * OnSubmit event
 * @method pageValidate
 * @param frmId - Form ID
 */
function internet_simcardPINLockValidate(frmId) {
	
	if($("#tf1_hid_screen").val() == "1") {
		internet_sim_screen1Validate();
			
	} else if($("#tf1_hid_screen").val() == "2"){
		internet_sim_screen2Validate();
	
	} else {
		internet_sim_screen3Validate();	
	}
	internet_onloadInternetApnConfig_1();
}


function internet_sim_screen1Validate(){
	
	if($("#tf1_enabledisablePin").attr("class") == "enable-disable-off"){
		alert(global_lang['validation_msgs']['pls_enamble_sim_protection']);	
		return false;
	}
	
	
	var txtFieldIdArr = new Array();
	
	txtFieldIdArr[0] = "tf1_Pincode,"+global_lang['validation_msgs']['pls_enter_valid_pin_code'];
	
	
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
		
	internetApi_simpin_enable();	

}


function internet_sim_screen2Validate(){
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_Pincode,"+global_lang['validation_msgs']['pls_enter_valid_pin_code'];
	txtFieldIdArr[1] = "tf1_currentPin,"+global_lang['validation_msgs']['pls_enter_valid_cur_pin'];
	txtFieldIdArr[2] = "tf1_newPin,"+global_lang['validation_msgs']['pls_enter_valid_new_pin'];
	txtFieldIdArr[3] = "tf1_cnfmPim,"+global_lang['validation_msgs']['pls_enter_valid_cfm_pin'];
	
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	var selmode = radioCheckedValueGet('tf1_sim_mode');
	if(selmode == "1") { 
		var Pincode = $("#tf1_Pincode").val();
	if(Pincode.length < 4 || Pincode.length > 8){
	  alert(global_lang['validation_msgs']['pin_code_digit_valid']);
	  return false;
	}	
	} else {
	var PinNumber = $("#tf1_currentPin").val();
	if(PinNumber.length < 4 || PinNumber.length > 8){
	  alert(global_lang['validation_msgs']['pin_code_digit_valid']);
	  return false;
	}
	
	var PinNumber = $("#tf1_newPin").val();
	if(PinNumber.length < 4 || PinNumber.length > 8){
	  alert(global_lang['validation_msgs']['pin_code_digit_valid']);
	  return false;
	}
	
	var newPinObj = document.getElementById('tf1_newPin');
	var cnfmPinObj = document.getElementById('tf1_cnfmPim');
		if (newPinObj && !newPinObj.disabled && cnfmPinObj && !cnfmPinObj.disabled && newPinObj.value != cnfmPinObj.value) {
			dialogAlert(global_lang['validation_msgs']['cfpwd_not_match']);
			document.getElementById('tf1_newPin').focus();
			return false;
		}
	}


	if(selmode == "1") { 
		internetApi_simpin_disable();
	}
	else{
		internetApi_simpin_change();
	}
}

function internet_sim_screen3Validate(){
	
	var txtFieldIdArr = new Array();
	
	txtFieldIdArr[0] = "tf1_PUKcode,"+global_lang['validation_msgs']['pls_enter_valid_PUK'];
	txtFieldIdArr[1] = "tf1_newPin,"+global_lang['validation_msgs']['pls_enter_valid_new_pin'];
	txtFieldIdArr[2] = "tf1_cnfPin,"+global_lang['validation_msgs']['pls_enter_valid_cfm_pin'];

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
		
	var PUkcode = $("#tf1_PUKcode").val();
	if(PUkcode.length != 8){
	   alert(global_lang['validation_msgs']['puk_code_digit_valid']);
	   return false;
    }		
	
	var Pincode = $("#tf1_newPin").val();
	if(Pincode.length < 4 || Pincode.length > 8){
	   alert(global_lang['validation_msgs']['pin_code_digit_valid']);
	   return false;
    }	

	var newPinObj =  document.getElementById('tf1_newPin');
	var cnfmPinObj = document.getElementById('tf1_cnfPin');

	if (newPinObj && !newPinObj.disabled && cnfmPinObj && !cnfmPinObj.disabled && newPinObj.value != cnfmPinObj.value) {
		dialogAlert(global_lang['validation_msgs']['cfpwd_not_match']);
		document.getElementById('tf1_newPin').focus();
		return false;
	}
	
	internetApi_simpin_unblock();

}

function internet_apnModeSelect() {
	var apnSelectMode = comboSelectedValueGet('tf1_apnMode');

	switch(apnSelectMode) {
		case "Auto" :
			// Auto
			fieldStateChangeWr('tf1_apn tf1_DialNumber tf1_Connection tf1_tablewrapper', '', 'tf1_networkType tf1_userName tf1_Password tf1_apnMethod tf1_Ipv6Compatibility', '');
			vidualDisplay('tf1_networkType tf1_userName tf1_Password tf1_Ipv6Compatibility', 'configRow');
			vidualDisplay('break_networkType break_userName break_Password break_Ipv6Compatibility', 'break');
			vidualDisplay('tf1_apn tf1_DialNumber tf1_Connection tf1_tablewrapper tf1_apnMethod', 'hide');
			vidualDisplay('break_apn break_DialNumber break_tablewrapper break_apnMethod', 'hide');
			$("#tf1_userName").attr("readonly","readonly");
			$("#tf1_Password").attr("readonly","readonly");
			internet_AutoApnChange();
			break;
		case "Manual" :
			// Manual
			fieldStateChangeWr('', '', 'tf1_apn tf1_DialNumber tf1_userName tf1_Password tf1_apnMethod tf1_Connection tf1_Ipv6Compatibility', '');
			vidualDisplay('tf1_apn tf1_DialNumber tf1_userName tf1_Password tf1_apnMethod tf1_Connection tf1_Ipv6Compatibility', 'configRow');
			vidualDisplay('break_apn break_DialNumber break_userName break_Password break_apnMethod break_Connection break_Ipv6Compatibility', 'break');
			vidualDisplay('tf1_networkType tf1_tablewrapper', 'hide');
			vidualDisplay('break_networkType break_tablewrapper ', 'hide');
			$("#tf1_userName").removeAttr("readonly");
			$("#tf1_Password").removeAttr("readonly");
			internet_ManualApnChange();
			var selectedId = document.getElementById("tf1_apnAuth").selectedIndex;
			if (selectedId == -1) {
				$("#tf1_apnAuth").val(0);
			}
	}
}

/**
 * This function calls when user selects drop down item from "APN Mode" select box
 * Select box onchange event
 * @method apnModeSelect
 */
function internet_plmnMode(t) {
	/* Check connection status */
	 
	if( t && ui_config.Dyn_Status["wan_info"]["ip4"]["call_status"] == "connected") {	  
	  var c = confirm(global_lang["alerts_set"]["internet_plmn_change"]);	  
	  if (c == false) {		  
		$("#tf1_frm_internetPlmnSettings").reset();
		return;
	  }	
	  internet_api_manualConnectDisconnect(0);
	  internet_api_manualConnectDisconnect6(0);
	}
	
	var plmnMode = parseInt(comboSelectedValueGet('tf1_plmnMode'), 10);
	if (plmnMode == 0) {//Automatic
		if (window.global_plmnSearchTimeoutHandler){clearTimeout(window.global_plmnSearchTimeoutHandler);}
		fieldStateChangeWr('', 'tf1_tablewrapper', '', '');
		vidualDisplay('tf1_tablewrapper', 'hide');
		vidualDisplay('', 'hide');
		$("#tf1_plmnButtons").show();			
	    $("#tf1_searchOperators").hide();
	} else {//Manual
	
		if ( ui_config["plmnlist_info"]["plmn_state"] == "0") {			
			internet_api_plmnSearch();
			$("#tf1_plmnButtons").hide();			
			$("#tf1_searchOperators").show();
			$("#tf1_plmnMode").attr("disabled","disabled");
		} else if (ui_config["plmnlist_info"]["plmn_state"] == "1") {
			$("#tf1_plmnButtons").hide();
			$("#tf1_searchOperators").show();
			$("#tf1_plmnMode").attr("disabled","disabled");
		} else {	  
	  		$("#tf1_plmnMode").removeAttr("disabled");
			$("#tf1_plmnButtons").show();
			$("#tf1_searchOperators").hide();
			internet_plmnlistget_template();
			fieldStateChangeWr('', '', 'tf1_tablewrapper', '');
			vidualDisplay('tf1_tablewrapper', 'configRow');
			vidualDisplay('', 'break');			
			datatable('tf1_internetOperators');
			
		}
	}
	
	

}


function internet_refreshOperators() {
	
	$("#tf1_searchOperators").show();
	$("#tf1_plmnButtons").hide();
	$("#tf1_tablewrapper_div").hide();
	internet_api_plmnSearch();
			
}

/**
 * This function calls when user selects drop down item from "APN Mode" select box
 * Select box onchange event
 * @method apnModeSelect
 */
function internet_enableDisableLanSettingsOnLoad(toggleObj, thisObj) {
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	switch(imgId) {
		case 'tf1_internetEnableLan':
			enableTextFieldByAnchorClick('tf1_internetEnableLan', '', '', 'tf1_dhcpService');
			break;

	}
}

function internet_apnConfigReset(frmId) {
	$("#" + frmId).reset();
	internet_apnModeSelect();
}

function internet_connectionModeSettingsReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
	internet_changeConnectionModeOne($("#tf1_autoConnectionOnOff").val());
}

function internet_connectionModeSettingsValidate(frmId) {
	setHiddenChks(frmId);
	internet_api_cnmodeConfig();
}

function internet_simcardPINLockReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
}

function internet_plmnModereset(frmId) {
	$("#" + frmId).reset();
	internet_plmnMode();
}

function internet_plmnModeValidate(frmId) {
	 internet_api_plmnSet();
}

function internet_enableDisableReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
	enableTextFieldByAnchorClick('tf1_internetEnableLan', '', '', 'tf1_dhcpService');
}

function internet_enableDisableValidate(frmId) {
	setHiddenChks(frmId);
	//dialogAlert("This mock-up version does not support form actions", "Information", "info");
}

function internet_onloadPopupConnectionType() {

	internet_connectionTypeChange();
	//internet_changeConnectionMode('tf1_intAlwaysConnect','intGrp1');
	
}

function internet_connectionTypeChange() {

	var connMode = parseInt(comboSelectedValueGet('tf1_internetConnectionType'), 10);

	$(".btnLte3TG").hide();
	$(".btnRouter").hide();
	$(".btnWifi").hide();

	if (connMode == 1) {// lte3g
		vidualDisplay("tf1_internetRouterMode tf1_internetWifi", "hide");
		$(".btnLte3TG").show();
	}

	if (connMode == 2) {//Router Mode

		vidualDisplay("tf1_internetWifi", "hide");
		vidualDisplay("tf1_internetRouterMode", "");
		$(".btnRouter").show();
		setup_internetConnectionTypeChange();
	}

	if (connMode == 3) {//Wifi Mode

		vidualDisplay("tf1_internetWifi", "");
		vidualDisplay("tf1_internetRouterMode", "hide");
		$(".btnWifi").show();

	}
}

function internet_hotspotConnectionValidate() {

	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_setup_hotspotPresharedKey,Please enter valid Pre Shared Key";
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	//dialogAlert("This mock-up version does not support form actions", "Information", "info");

}

function internet_ethernetConnectionValidate() {

	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_setup_ppoeUsername,Please enter valid PPPoE Username";
	txtFieldIdArr[1] = "tf1_setup_ppoePassword,Please enter valid PPPoE Password";
	txtFieldIdArr[2] = "tf1_setup_ppoeVerifyPassword,Please enter valid Verify Password";
	txtFieldIdArr[3] = "tf1_setup_ppoeServiceName,Please enter valid PPPoE Service Name";
	txtFieldIdArr[4] = "tf1_setup_ppoeIpAddress,Please enter valid PPPoE IP Address";
	txtFieldIdArr[5] = "tf1_setup_ppoePrimaryDnsServer,Please enter valid PPPoE Primary DNS server";
	txtFieldIdArr[6] = "tf1_setup_ppoeSecondaryDnsServer,Please enter valid PPPoE Secondary DNS Server";
	txtFieldIdArr[7] = "tf1_setup_ppoePMacAddress,Please enter valid PPPoE MAC Address";

	txtFieldIdArr[8] = "tf1_setup_staticIpAddress,Please enter valid Static IP Address";
	txtFieldIdArr[9] = "tf1_setup_staticSnetmask,Please enter valid Static Subnet Mask";
	txtFieldIdArr[10] = "tf1_setup_staticGateway,Please enter valid Static Gateway Address";
	txtFieldIdArr[11] = "tf1_setup_staticPrimaryDnsServer,Please enter valid Static Primary DNS Server";
	txtFieldIdArr[11] = "tf1_setup_staticSecondaryDnsServer,Please enter valid Static Secondary DNS Server";

	txtFieldIdArr[12] = "tf1_setup_dhcpHostName,Please enter valid DHCP Host Name";
	txtFieldIdArr[13] = "tf1_setup_dhcpPrimaryDnsServer,Please enter valid DHCP Primary DNS Server";
	txtFieldIdArr[14] = "tf1_setup_dhcpSecondaryDnsServer,Please enter valid DHCP Secondary DNS Server";

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;

	var connectTypeSelectMode = comboSelectedValueGet('tf1_setup_internetConnectionType');

	var pwdObj = document.getElementById('tf1_setup_ppoePassword');
	var cnfPwdObj = document.getElementById('tf1_setup_ppoeVerifyPassword');

	if (pwdObj && !pwdObj.disabled && cnfPwdObj && !cnfPwdObj.disabled && pwdObj.value != cnfPwdObj.value) {
		dialogAlert("Passwords do not match");
		document.getElementById('tf1_setup_ppoePassword').focus();
		return false;
	}

	if (connectTypeSelectMode == "1") {//PPPoE

		if (ipv4Validate('tf1_setup_ppoeIpAddress', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

		if (ipv4Validate('tf1_setup_ppoePrimaryDnsServer', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

		if (ipv4Validate('tf1_setup_ppoeSecondaryDnsServer', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

		macObj = document.getElementById('tf1_setup_ppoePMacAddress');
		if (!(macAddrValidate(macObj.value, true, "", '', macObj))) {
			macObj.focus();
			return false;
		}

	}

	if (connectTypeSelectMode == "2") {//Static

		if (ipv4Validate('tf1_setup_staticIpAddress', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

		if (validNetMask('tf1_setup_staticSnetmask') == false)
			return false;

		if (ipv4Validate('tf1_setup_staticGateway', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

		if (ipv4Validate('tf1_setup_staticPrimaryDnsServer', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

		if (ipv4Validate('tf1_setup_staticSecondaryDnsServer', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;

	}

	if (connectTypeSelectMode == "3") {//Dhcp

		if (ipv4Validate('tf1_setup_dhcpPrimaryDnsServer', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)

			return false;

		if (ipv4Validate('tf1_setup_dhcpSecondaryDnsServer', 'IP', false, true, "Invalid IP address.", "for octet ", true) == false)
			return false;
	}

	//dialogAlert("This mock-up version does not support form actions", "Information", "info");

}

function internet_connectionTypeReset() {

	internet_connectionTypeChange();
}

function toggleRadioImage(imgId, groupClass) {

	var thisObj = "#" + imgId;

	$("." + groupClass).removeClass("connectTypeActive");
	$("." + groupClass).addClass("connectType");
	$(thisObj).removeClass("connectType");
	$(thisObj).addClass("connectTypeActive");

}

function internet_changeConnectionMode(imgId, groupClass) {

	var thisObj = "#" + imgId;
	var selOption = $(thisObj).attr("val");
	toggleRadioImage(imgId, groupClass);
	$("#tf1_manualRadioAlways").hide();
	$("#tf1_manualRadioOnDemand").hide();
	$("#tf1_manualRadioManual").hide();

	if (selOption == 1) {
		$("#tf1_manualRadioAlways").show();
	} else if (selOption == 2) {
		$("#tf1_manualRadioOnDemand").show();
	} else {
		$("#tf1_manualRadioManual").show();
	}

}

function internet_changeConnectionModeOne(selOption) {
	
	selOption = parseInt(selOption,10);
	
	$(".intGrp4").each(function(event,index) {
			if ( $(this).attr("val") == selOption ) {
				toggleRadioImage($(this).attr("id"),"intGrp4");				 
			}
	   	});
 
	if(ui_config["fw_info"]["curr_ver"].indexOf("JPb") != -1)
		$("#tf1_netPref option[value='4']").remove();
	
	$("#tf1_manualRadioAlways").hide();
	$("#tf1_manualRadioManual").hide();

	if (selOption == 1) {
		$("#tf1_manualRadioAlways").show();
		$("#tf1_autoConnectionOnOff").val(1);
	} else{
		$("#tf1_manualRadioManual").show();
		$("#tf1_autoConnectionOnOff").val(0);
	} 
}


function internet_changeConnectionModeTwo(imgId, groupClass) {

	var thisObj = "#" + imgId;
	var selOption = $(thisObj).attr("val");
	toggleRadioImage(imgId, groupClass);
	$("#tf1_manualRadioAlways2").hide();
	$("#tf1_manualRadioOnDemand2").hide();
	$("#tf1_manualRadioManual2").hide();

	if (selOption == 1) {
		$("#tf1_manualRadioAlways2").show();
	} else if (selOption == 2) {
		$("#tf1_manualRadioOnDemand2").show();
	} else {
		$("#tf1_manualRadioManual2").show();
	}
}

function internet_changeConnectionMode2(radioId) {

	var selOption = radioCheckedValueGet(radioId);

	if (selOption == 3) {

		$("#tf1_manualRadioOnOff2").show();

	} else {
		$("#tf1_manualRadioOnOff2").hide();
	}
}

function network_info() {

	upload = ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"]/1048576;
	if(upload < 1) {
		upload = upload * 1024 ;
		unit =" KB";
	}
	else{
		upload = upload;
		unit =" MB";
	}
	//upload = parseInt(upload,10);
	upload = upload.toFixed(2) + unit;
	download = ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"]/1048576;
	if(download < 1) {
		download = download * 1024;
		unit =" KB";
	}
	else{
		download = download;
		unit =" MB";
	}
	
	
	
	//download = parseInt(download,10);
	download = download.toFixed(2) + unit;	
	
	var operators_information = "";
	if(ui_config.Dyn_Status["wan_status"]["operators_information"] == "No Service")
	{
		operators_information = global_lang["cpsection"]["No_Service"];
	}
	else if((ui_config.Dyn_Status["wan_status"]["operators_information"] == "Searching"))
	{
		operators_information = global_lang["cpsection"]["Searching"];
	}
	else
	{
		operators_information = ui_config.Dyn_Status["wan_status"]["operators_information"];
	}

	var tmpl_nwInfo_data = {
					"operator_name":operators_information,
					"signal_level":ui_config.Dyn_Status["wan_status"]["entries"][0]["signal_strength"],
					"signal_strength":ui_config.Dyn_Status["wan_status"]["rssi_dbm"],
					"network_type":ui_config.Dyn_Status["wan_status"]["entries"][0]["signal_type"],
					"ipv4Addr":ui_config.Dyn_Status["wan_info"]["ip4"]["ip"],
					"ipv6Addr":ui_config.Dyn_Status["wan_info"]["ip6"]["ip"],
					"connection_time":ui_config.Dyn_Status["wan_info"]["ip4"]["conn_time"],
					"Average_DL":download,	
					"Average_UL":upload
	};
	var pagefn = doT.template(document.getElementById('networkInfoTemplate').text);

    $("#tf1_tmpl_network_information").html(pagefn(tmpl_nwInfo_data));

}

function lan_info(){
	
	var tmpl_lan_data = { 
					"enable_lan":ui_config["lan"]["lan_dhcp"],
					"dhcp_service":ui_config["lan"]["lan_dhcp"],
					"ip_addr":ui_config["lan"]["ip"],
					"subnet":ui_config["lan"]["lan_mask"],
					"start_ip": ui_config["lan"]["lan_dhcp_start"],
					"end_ip":ui_config["lan"]["lan_dhcp_end"]
	};   
	   
   var pagefn = doT.template(document.getElementById('lanInfoTemplate').text);
   $("#tf1_tmpl_lan_information").html(pagefn(tmpl_lan_data)); 
}


/*PLMN Mode get template */
function internet_plmnget_template(){

   var tmpl_plmn_data = {
   							"selmode":ui_config["plmn_info"]
   						};
   var pagefn = doT.template(document.getElementById('plmnmodeTemplate').text);
   $("#tf1_tmpl_plmnmode_get").html(pagefn(tmpl_plmn_data));
}

/* PLMN list get template */
function internet_plmnlistget_template() {
    var tmpl_plmnlist_data = ui_config["plmnlist_info"]["entries"];
    var dataTemplate = $("#plmnlistTemplate").html();
    var populatedDataTemplate = doT.template(dataTemplate)(tmpl_plmnlist_data);
    $("#tf1_plmnlistTblbody").html(populatedDataTemplate);

}

/*SIM PIn Settings get template */
function internet_sim_template() {
	var tmpl_simpin_data = {							
								"sim_status":ui_config["simpin_info"]["sim_status"],
								"retry_st":ui_config["simpin_info"]["pin_retry"],
								"retry_puk":ui_config["simpin_info"]["puk_retry"],
								"st_result":ui_config["simpin_info"]["pin_result"],
								"pin_status":ui_config["simpin_info"]["pin_status"]
						  };
	tmpl_simpin_data.msg ="";				  
	if(ui_config["simpin_info"]["pin_result"] == "0" && ui_config["simpin_info"]["sim_status"] == "0"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["pls_insert_sim_card"] || 'Please insert SIM card!'];
	}	
	if(ui_config["simpin_info"]["sim_status"] == "1"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["pls_insert_sim_card"] || 'Please insert SIM card!'];
	}	
	if(ui_config["simpin_info"]["pin_result"] == "0" && ui_config["simpin_info"]["sim_status"] == "4"){
		tmpl_simpin_data.msg = "";
	}	
	else if(ui_config["simpin_info"]["pin_result"] == "1"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_enable_lock_success"] || 'SIM enable lock success.' ];
	}
	else if(ui_config["simpin_info"]["pin_result"] == "2"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_enable_lock_fail"] || 'SIM enable lock fail.' ];
	}else if(ui_config["simpin_info"]["pin_result"] == "3"){
		tmpl_simpin_data.msg =  [global_lang["validation_msgs"]["sim_disable_lock_success"] || 'SIM disable lock success.' ];
	}else if(ui_config["simpin_info"]["pin_result"] == "4"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_disable_lock_fail"] || 'SIM disable lock fail.' ];
	}else if(ui_config["simpin_info"]["pin_result"] == "5"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_unlock_success"] || 'SIM unlock success.' ];
	}else if(ui_config["simpin_info"]["pin_result"] == "6"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_unlock_fail"] || 'SIM unlock fail.' ];
	}else if(ui_config["simpin_info"]["pin_result"] == "7"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_unbock_success"] || 'SIM unblock success.' ];
	}else if(ui_config["simpin_info"]["pin_result"] == "8"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["sim_unbock_fail"] || 'SIM unblock fail.' ];
	}
	else if(ui_config["simpin_info"]["pin_result"] == "9"){
		tmpl_simpin_data.msg = [global_lang["validation_msgs"]["change_code_success"] || 'Change code success.' ];
	}
	else if(ui_config["simpin_info"]["pin_result"] == "10"){
		tmpl_simpin_data.msg = "";
	}						  
   var pagefn = doT.template(document.getElementById('simPinTemplate').text);
   $("#tf1_tmpl_sim_info").html(pagefn(tmpl_simpin_data));
	
}

function internet_AutoApnChange() {

	var selectedId = document.getElementById("tf1_networkType").selectedIndex;
	if ( selectedId == -1) {
	selectedId = 0; 
	}
	var selectedIndex = document.getElementById("tf1_networkType").options[selectedId].value
	for (var i = 0 ; i < ui_config["apn_info"]["list_count"] ;i++)
	{
		if(selectedIndex  == ui_config["apn_info"]["entries"][i]["profile_index"])
		{
			$("#tf1_apn").val(ui_config["apn_info"]["entries"][i]["apn"]);
			$("#tf1_userName").val(ui_config["apn_info"]["entries"][i]["user"]);
			$("#tf1_Password").val(ui_config["apn_info"]["entries"][i]["password"]);
		}
	}	
}

function internet_ManualApnChange() {
	for (var i = 0 ; i < ui_config["apn_info"]["list_count"] ;i++)
	{
		if(manual_apn_index  == ui_config["apn_info"]["entries"][i]["profile_index"])
		{
			$("#tf1_apn").val(ui_config["apn_info"]["entries"][i]["apn"]);
			$("#tf1_userName").val(ui_config["apn_info"]["entries"][i]["user"]);
			$("#tf1_Password").val(ui_config["apn_info"]["entries"][i]["password"]);
			$("#tf1_apnAuth").val(ui_config["apn_info"]["entries"][i]["auth_type"]);
		}
	}	
}
