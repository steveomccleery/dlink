/* Setup Wizard Panel */

var wiFiHtml = "";

function setup_showLte3GConnectionType(event) {
	var thisObj = event.target;
	if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}
	$(".connectionLinks").removeClass("active");
	$(".wizardImfInfo").hide();
	$(".tab1").show();
	$(thisObj).addClass("active");
	$("#tf1_pageNextStep").val('tf1_lte3GScreen1');

}

function setup_showEthernetConnectionType(event) {
	var thisObj = event.target;
	if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}
	$(".connectionLinks").removeClass("active");
	$(".wizardImfInfo").hide();
	$(".tab2").show();
	$(thisObj).addClass("active");
	$("#tf1_pageNextStep").val('tf1_routerEthernetScreen1');
}

function setup_showWifiHotSpotConnectionType(event) {
	var thisObj = event.target;
	if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}
	$(".connectionLinks").removeClass("active");
	$(".wizardImfInfo").hide();
	$(".tab3").show();
	$(thisObj).addClass("active");
	$("#tf1_pageNextStep").val('tf1_wifiHotSpotScreen1');
}

function setup_nextStep(divId, step) {

	$(".screen").hide();
	$(".stepParent").removeClass("one");
	$(".stepChild").removeClass("two");
	$("#list" + step + " div.stepParent").addClass("one");
	$("#list" + step + " div.stepParent div.stepChild").addClass("two");
	if (divId == "tf1_lte3GScreen2") {
		$("#tf1_lte3GScreen2 div.setupConfig").html(wiFiHtml);
	}

	$("#" + divId).show();
}

function setup_nextStepWifi(divId, step) {

	$(".screen").hide();
	$(".stepParent").removeClass("one");
	$(".stepChild").removeClass("two");
	$("#list" + step + " div.stepParent").addClass("one");
	$("#list" + step + " div.stepParent div.stepChild").addClass("two");
	$("#tf1_lte3GScreen2 div.setupConfig").html('');
	$("#tf1_routerEthernetScreen2 div.setupConfig").html(wiFiHtml);
	$("#" + divId).show();
}

function setup_nextStepHotSpot(divId, step) {

	$(".screen").hide();
	$(".stepParent").removeClass("one");
	$(".stepChild").removeClass("two");
	$("#list" + step + " div.stepParent").addClass("one");
	$("#list" + step + " div.stepParent div.stepChild").addClass("two");
	$("#tf1_lte3GScreen2 div.setupConfig").html('');
	$("#tf1_wifiHotSpotScreen2 div.setupConfig").html(wiFiHtml);
	$("#" + divId).show();
}

function setup_previousStep(divId, step) {
	$(".screen").hide();
	$(".stepParent").removeClass("one");
	$(".stepChild").removeClass("two");
	$("#list" + step + " div.stepParent").addClass("one");
	$("#list" + step + " div.stepParent div.stepChild").addClass("two");
	$("#" + divId).show();
}

function setup_moveTo() {

	$(".screen").hide();
	$(".stepParent").removeClass("one");
	$(".stepChild").removeClass("two");

	var divId = $("#tf1_pageNextStep").val();
	var step = 2;
	$("#list" + step + " div.stepParent").addClass("one");
	$("#list" + step + " div.stepParent div.stepChild").addClass("two");
	$("#" + divId).show();

	/* Screen1 of lte */
	if ($("#tf1_pageNextStep").val() == "tf1_lte3GScreen1") {
		setup_lte3GScreen1Onload();
	}
}

function setup_lte3GScreen1Onload() {

}

function setup_apnconfig1Validate() {

	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_setup_apnManual,"+global_lang['validation_msgs']['pls_enter_valid_APN'];
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
		
	$("#tf1_lte3GScreen2 div.setupConfig").html(wiFiHtml);
	setup_nextStep('tf1_lte3GScreen2', 3);
	
	var curr = new Date().getFullYear();
			var opt = {}			
			opt.datetime = {preset: 'datetime',minDate: new Date(2000,3,10,9,22),maxDate: new Date(2099,7,30,15,44),stepMinute: 1,dateFormat:"yyyy-mm-dd"};
			$('#tf1_setDateTime').val($('#tf1_setDateTimeValue').val());
			$('#tf1_setDateTime').scroller('destroy').scroller(
				$.extend(
					opt["datetime"], { 					
						mode: "scroller", 
						display: "inline" 
					}
				)			
			);
			setup_moveTo();
}

function setup_lte3GScreen1Reset() {

}

function setup_apnModeChange() {
	var apnSelectMode = comboSelectedValueGet('tf1_setup_apnMode');

	switch(apnSelectMode) {
		case "0" :
			// Auto
			fieldStateChangeWr('tf1_setup_apnManual tf1_setup_apnDialInNumber', '', '', '');
			vidualDisplay('tf1_setup_apnManual tf1_setup_apnDialInNumber break_setup_apnManual break_setup_apnDialInNumber tf1_apnMethod', 'hide');
			vidualDisplay('tf1_setup_apnAuto', "configRow");
			vidualDisplay('break_setup_apnAuto', "break");
			$("#tf1_setup_userName").attr("readonly","readonly");
			$("#tf1_setup_Password").attr("readonly","readonly");
			setup_AutoApnChange();
			break;

		case "1" :
			// Manual
			fieldStateChangeWr('', '', 'tf1_setup_apnManual tf1_setup_apnDialInNumber', '');
			vidualDisplay('tf1_setup_apnManual tf1_setup_apnDialInNumber break_setup_apnManual break_setup_apnDialInNumber tf1_apnMethod', 'configRow');
			vidualDisplay('break_setup_apnManual break_setup_apnDialInNumber ', 'break');
			vidualDisplay('tf1_setup_apnAuto', "hide");
			vidualDisplay('break_setup_apnAuto', "hide");
			$("#tf1_setup_userName").removeAttr("readonly");
			$("#tf1_setup_Password").removeAttr("readonly");
			setup_ManualApnChange();
			var selectedId = document.getElementById("tf1_apnAuth").selectedIndex;
			if (selectedId == -1) {
				$("#tf1_apnAuth").val(0);
			}

			break;
	}
}

function setup_onloadFn() {
	GetProfileList();
	doGetConnectProfile();
	doGetSystemAPN();
	find_system_apn_info();
	find_connect_apn_info();
	get_apn_type();
	getTimeConfig();
	cp_wizard_template();
	setup_apnModeChange();
	setup_encryptionModeChange();
	wiFiHtml = $("#tf1_lte3GScreen2 div.setupConfig").html();
	onloadCall2();
}


function setup_encryptionModeChange() {
	var wifi_protection = parseInt(comboSelectedValueGet('tf1_setup_encryptionMode'), 10);
	switch(wifi_protection) {
		case 0 :
			// No Protection
			fieldStateChangeWr('tf1_authenticationType tf1_wpaMode tf1_cipherType tf1_preSharedkey tf1_key', 'tf1_keyTable', '', '');
			vidualDisplay('tf1_authenticationType tf1_wpaMode tf1_cipherType tf1_preSharedkey tf1_key tf1_keyTable', 'hide');
			vidualDisplay('break_authenticationType break_wpaMode break_cipherType break_preSharedkey break_key', 'hide');
			break;
			
		case 1:
			// Basic Protechtion
			fieldStateChangeWr('tf1_wpaMode tf1_cipherType tf1_preSharedkey', '', 'tf1_authenticationType tf1_key', 'tf1_keyTable');
			vidualDisplay('tf1_authenticationType tf1_key tf1_keyTable', 'configRow');
			vidualDisplay('break_authenticationType break_key break_keyTable', 'break');
			vidualDisplay('tf1_wpaMode tf1_cipherType tf1_preSharedkey', 'hide');
			vidualDisplay('break_wpaMode break_cipherType break_preSharedkey', 'hide');
			break;

		case 2:
			// Advanced Protechtion
			fieldStateChangeWr('tf1_authenticationType tf1_key', 'tf1_keyTable', 'tf1_wpaMode tf1_cipherType tf1_preSharedkey', '');
			vidualDisplay('tf1_wpaMode tf1_cipherType tf1_preSharedkey', 'configRow');
			vidualDisplay('break_wpaMode break_cipherType break_preSharedkey', 'break');
			vidualDisplay('tf1_authenticationType tf1_key tf1_keyTable', 'hide');
			vidualDisplay('break_authenticationType break_key break_keyTable', 'hide');
			break;
	}
	
	wifi_changeWpaMode();
}

 

function setup_ethernetWifiValidate() {

	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_wifi2point4G,"+global_lang['validation_msgs']['pls_enter_wifi_access_name'];
	txtFieldIdArr[1] = "tf1_preSharedkey,"+global_lang['validation_msgs']['pls_enter_valid_key'];

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;

	setup_nextStep('tf1_routerEthernetScreen3', 4);

}

function setup_adminSettingValidate() {

	var txtFieldIdArr = new Array();

	/* When SNTP is off */

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	 var pwdObj = document.getElementById('tf1_password');
     var cnfPwdObj = document.getElementById('tf1_cnfPassword');
    
    if (pwdObj && !pwdObj.disabled && cnfPwdObj && !cnfPwdObj.disabled && pwdObj.value != cnfPwdObj.value) {
        dialogAlert(global_lang['validation_msgs']['cfpwd_not_match'], "Information", "info");
        document.getElementById('tf1_password').focus();
        return false;
    }
	
	var SyncObj = document.getElementById("tf1_synchronization2");
    if (!numericValueRangeCheck(SyncObj, '', '', 1, 24, true, global_lang['validation_msgs']['invalid_sync_cycle'], '')) 
        return false;
	
	var old_password = $("#tf1_oldPassword").val();
	var new_password =$("#tf1_password").val();

	for(var i = 0;i < new_password.length; i++) {
		 if(new_password.charCodeAt(i) > 127){
			alert(global_lang["system_popup"]["passwd_nonEnglish"]);
			return;
		}
	        else if(new_password.charCodeAt(i) == 34){
			alert(global_lang["system_popup"]["passwd_incQuota"]);
			return;
		}
	}
	
	 if(new_password != "")
	 {
		new_password =  CryptoJS.MD5(new_password);
		old_password = CryptoJS.MD5(old_password);
		new_password =  encodeURIComponent(new_password);
		old_password =  encodeURIComponent(old_password);
	 	var request = $.ajax({
	        	type: "POST",
	        	url: "cgi-bin/qcmap_auth",

	        	data: 
				{
					type: "wizard_check",
					old_pwd: old_password, 
					new_pwd: new_password, 
					timeout: "", 
					token: session_token
				},
	        	dataType: "text"
	    	});
    		request.done(function( responseData,textStatus, jqXHR ) {    
				obj = jQuery.parseJSON(responseData);
			});
				if(obj.result== "5")
				{
					alert(global_lang['login1']['login-wrong-old']);
					return ;
				}
				if(obj.result== "6")
				{
					alert(global_lang['login1']['login-new-form']);
					return ;
				}
	 }
	setup_nextStep('tf1_lte3GScreen3', 4);

}

function setup_wifiHotSpotWifiValidate() {

	var txtFieldIdArr = new Array();
	var protection_val = $("#tf1_setup_encryptionMode").val();
	var passphraseval = $("#tf1_preSharedkey").val();
	var wpaMode_val = $("#tf1_wpaMode").val();
	txtFieldIdArr[0] = "tf1_wifi2point4G,"+global_lang['validation_msgs']['pls_enter_wifi_access_name'];
	txtFieldIdArr[1] = "tf1_wifi5G,Please enter valid Access Name for Wi-Fi 5 GHz";
	txtFieldIdArr[2] = "tf1_preSharedkey,"+global_lang['validation_msgs']['pls_enter_valid_key'];


	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
		
	/* [start] validation for Basic Protection */	
	var security = comboSelectedValueGet('tf1_setup_encryptionMode');	
	var selKeyIndex = radioCheckedValueGet('tf1_rdbWepKey0');
	if (security == "1") {
		
		 if ( $("#tf1_txtWepKey"+selKeyIndex).val() == "" ) {
			alert(global_lang['validation_msgs']['pls_generate_wep_keys']);
			return false; 
		 } 
	}
	/* [end] validation for Basic Protection */	
	if(protection_val == 2)
	{
                    if (wpaMode_val == "WPA2" ) {
				if (passphraseval.length < 8 || passphraseval.length > 63)
				{
					alert(global_lang['wifi_popup']['Invalid_pre_key']);
					return;
				}
				
			} else if (wpaMode_val == "Auto"){
				if (passphraseval.length < 8 || passphraseval.length > 63)
				{
					alert(global_lang['wifi_popup']['Invalid_pre_key']);
					return;
				}
			}
	}
	setup_nextStep('tf1_lte3GScreen2', 3);

	var curr = new Date().getFullYear();
	var opt = {};		
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
	timeEnableDisableOnload2({imageId:'tf1_sntpEnableDisable2', disableIndividual:'tf1_primarySntpServer2 tf1_secondarySntpServer2 tf1_tertiarySntpServer2 tf1_synchronization2', disableGrp:'', enableIndividual:'', enableGrp:'', hideClass:'hide', showClass:'configRow', breakDivs:'break_primarySntpServer2 break_secondarySntpServer2 break_tertiarySntpServer2  break_synchronization2', breakClass:'break', imagesInfo:{disableImages:'', enableImages:'', disableClass:'', enableClass:''}});
	deviceTimeOnload2();
	 
}

function setup_hotspotConnectionValidate() {

	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_setup_hotspotPresharedKey,Please enter valid Pre Shared Key";
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;

	$("#tf1_wifiHotSpotScreen2 div.setupConfig").html(wiFiHtml);
	setup_nextStepHotSpot('tf1_wifiHotSpotScreen2', 3);

}

function setup_HotSpotsList() {

	vidualDisplay("tf1_hotSpotsList", "configRow");
	datatable("tf1_HotSpotsTbl");

}

function setup_hotSpotClose() {
	vidualDisplay("tf1_hotSpotsList", "hide");
}

function setup_hotSpotSet() {
	$("#tf1_hotspot1").html("Test1");
	$("#tf1_hotspot2").html("B/G/N mixed");
	$("#tf1_hotspot3").html("11");
	$("#tf1_hotspot4").html("WPA-PSK/WPA2-PSK");
	$("#tf1_hotspot5").html("AES");
	$("#tf1_setup_hotspotPresharedKey").val('2dsfsdfsd');
	vidualDisplay("tf1_hotSpotsList", "hide");
}

function setup_hotSpotRefresh() {

	vidualDisplay("tf1_hotSpotsList", "hide");
	vidualDisplay("tf1_hotSpotsList", "configRow");
	$("#tf1_hotSpotsList_div").show("slow");

}



function deviceTimeOnload2() {	
	onloadCall(timeEnableDisableOnload2, {imageId:'tf1_sntpEnableDisable2', disableIndividual:'tf1_primarySntpServer2 tf1_secondarySntpServer2 tf1_tertiarySntpServer2 tf1_synchronization2', disableGrp:'', enableIndividual:'', enableGrp:'', hideClass:'hide', showClass:'configRow', breakDivs:'break_primarySntpServer break_secondarySntpServer2 break_tertiarySntpServer2  break_synchronization2', breakClass:'break', imagesInfo:{disableImages:'', enableImages:'', disableClass:'', enableClass:''}});
	
	timeEnableDisableOnload2({imageId:'tf1_sntpEnableDisable2', disableIndividual:'tf1_primarySntpServer2 tf1_secondarySntpServer2 tf1_tertiarySntpServer2 tf1_synchronization2', disableGrp:'', enableIndividual:'', enableGrp:'', hideClass:'hide', showClass:'configRow', breakDivs:'break_primarySntpServer2 break_secondarySntpServer2 break_tertiarySntpServer2 break_synchronization2', breakClass:'break', imagesInfo:{disableImages:'', enableImages:'', disableClass:'', enableClass:''}});
	
	
	if ($("#tf1_sntpEnableDisable2").attr("class") == "enable-disable-off" ) {
		$("#tf1_setDateTimeBlock_div").attr("class","");
		$("#tf1_synchronization2_div").attr("class","hide");
		$("#tf1_setSNTPserver2_Block_div").attr("class","hide");		
	} else {
		
		$("#tf1_setDateTimeBlock_div").attr("class","hide");
		$("#tf1_synchronization2_div").attr("class","");
		$("#tf1_setSNTPserve2r_Block_div").attr("class","");
	}
 
}

function timeEnableDisableOnload2(data){
	onAnchorToggle(data);
	if ($("#tf1_sntpEnableDisable2").attr("class") == "enable-disable-off" ) {
		$("#tf1_setDateTimeBlock_div").attr("class","");
		$("#tf1_synchronization2_div").attr("class","hide");
		$("#tf1_setSNTPserver2_Block_div").attr("class","hide");		
	} else {
		
		$("#tf1_setDateTimeBlock_div").attr("class","hide");
		$("#tf1_synchronization2_div").attr("class","");
		$("#tf1_setSNTPserver2_Block_div").attr("class","");
	}
}


function setup_wifi_changeWpaMode() {

 	var wpaMode = comboSelectedValueGet('tf1_wpaMode');
	$("#tf1_cipherType option[value='1']").remove();
	$("#tf1_cipherType option[value='0']").remove();
	$("#tf1_cipherType option[value='2']").remove();
	
	switch (wpaMode) {	
		case 'Auto' :
			$("#tf1_cipherType").append('<option value="2">AES / TKIP</option>');
		break;	
		case 'WPA2' :		
		case 'WPA' :
		
		$("#tf1_cipherType").append('<option value="1">AES</option>');
		$("#tf1_cipherType").append('<option value="0">TKIP</option>');
		break;	
		
	}
	
}

function wizard_accountSet(oldPassword,newPassword) {

		oldPassword = encodeURIComponent(oldPassword);
		newPassword = encodeURIComponent(newPassword);
		var request = $.ajax({
        	type: "POST",
        	url: "cgi-bin/qcmap_auth",
        	data: 
			{
				type: "update",
				old_pwd: oldPassword, 
				new_pwd: newPassword, 
				timeout: 300, 
				token: session_token
			},
        	dataType: "text"
    	});
}

function wizard_reboot() {
		var request = $.ajax({
        	type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
        	data: 
			{
				Page: "system_reboot",
				mask: 0,
				token: session_token
			},
        	dataType: "json"
    	});	    	
}


 function redirectTimeout(path) {
    if (--window.redirectTimeoutVar <= 0) {
    	parent.location.href=path;
    } else {
      $("#reboot_timeout").html(window.redirectTimeoutVar);
    }
}

function WizardRedirect(timeout, path) {
	$.ajaxSetup({async:true});
	$("#tf1_Progressbar").show();
    window.redirectTimeoutVar = timeout;
	$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['rebooting_timeout']);
	$("#reboot_timeout").html(window.redirectTimeoutVar);
    setInterval("redirectTimeout('" + path + "');", 1000);
}

function encode_passwd_wizard(passtext)
{//encode login password,encode like sample: "1250" <= "12"+'50' <= "12"+2<= "122" <= 122 <= 'z'
    var i = 0;
    var encode_str = "";
    passtext = passtext;//'Login' flag of encode password 
    var digital = "0123456789";
    for (i = 0; i < passtext.length; ++i)
    {
        var num = passtext.charCodeAt(i)+"";
        if (num.length == 1)
            encode_str += "00"+digital.charCodeAt(parseInt(num));
        else if (num.length == 2)
            encode_str += "0"+num.substr(0,1) + digital.charCodeAt(parseInt(num.substr(1,1)));
        else if (num.length == 3)
            encode_str += num.substr(0,2) + digital.charCodeAt(parseInt(num.substr(2,1)));
        else
            encode_str += "0000";
    }
    return encode_str;
}

function setup_saveSetting(event,frmId){
	select_apn_type = parseInt($("#tf1_setup_apnMode").val(),10);
	allow_roaming = parseInt($("#tf1_allowroaming_cpwizard").val(),10);
	apn_name = $("#tf1_setup_apnManual").val();
	apn_uname = $("#tf1_setup_userName").val();
	apn_passwd = $("#tf1_setup_Password").val();
	apn_auth =$("#tf1_apnAuth").val();
	/*wifi_ssid= encodeURIComponent($("#tf1_wifi2point4G").val());
	wifi_encrymode= $("#tf1_setup_encryptionMode").val();*/
	old_password = $("#tf1_oldPassword").val();
	new_password =$("#tf1_password").val();
	language = $("#tf1_Language").val();
	var apn_select_index = 1;
	if(select_apn_type == 0)
	{
		var selectedId = document.getElementById("tf1_setup_apnAuto").selectedIndex;
		if ( selectedId == -1) {
			apn_select_index = 0; 
		}
		else
			apn_select_index = document.getElementById("tf1_setup_apnAuto").options[selectedId].value;
		apn_type = 0 ;		
	}



	var request = 	$.ajax(
	{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "cust_setWizard",
				apn_type: select_apn_type,
				apn_selectedIndex : apn_select_index,
				apn_manual_index : manual_apn_index,
				name: "manual",
				apn: apn_name,
				apn_user: apn_uname,
				apn_passwd: apn_passwd,
				apn_auth: apn_auth,
				allow_roaming: allow_roaming,
				wifi_ssid: "",
				wifi_security: "",
				wifi_AuthMode: "",
				wpa_passphrase: "",
				wep_key_index: "",
				wep_key: "",
				wep_key_len: "",
				password : "",
				language :language,
				ntp_enable : "",
				ntp_server1 : "",
				ntp_server2 : "",
				ntp_server3 : "",
				ntp_sync_period : "",
				timezone : "",
				date_time : "",
				token: session_token
			},
			dataType: "json"
    });
    
    request.done(function(responseData,textStatus, jqXHR )
	{
		old_password =  CryptoJS.MD5(old_password);
		new_password =  CryptoJS.MD5(new_password);
		wizard_accountSet(old_password,new_password );
		setTimeout(wizard_reboot, 3000);
		clearCookies(); 
	        alert(global_lang['alerts_set']['setup_wizard_config_save']);		 
		var path = "login.html";
		WizardRedirect(90,path);	
	});
}


function setup_AutoApnChange() {

	var selectedId = document.getElementById("tf1_setup_apnAuto").selectedIndex;
	 if ( selectedId == -1) {
		selectedId = 0; 
		selectedIndex = 0;
	 }
	 else
		selectedIndex = document.getElementById("tf1_setup_apnAuto").options[selectedId].value;
	for (var i = 0 ; i < ui_config["apn_info"]["list_count"] ;i++)
	{
		if(selectedIndex  == ui_config["apn_info"]["entries"][i]["profile_index"])
		{
			$("#tf1_setup_apnManual").val(ui_config["system_apn_list"][i]["apn"]);
			$("#tf1_setup_userName").val(ui_config["system_apn_list"][i]["user"]);
			$("#tf1_setup_Password").val(ui_config["system_apn_list"][i]["password"]);
		}
	}
}

function setup_ManualApnChange() {
	for (var i = 0 ; i < ui_config["apn_info"]["list_count"] ;i++)
	{
		if(manual_apn_index  == ui_config["apn_info"]["entries"][i]["profile_index"])
		{
			$("#tf1_setup_apnManual").val(ui_config["apn_info"]["entries"][i]["apn"]);
			$("#tf1_setup_userName").val(ui_config["apn_info"]["entries"][i]["user"]);
			$("#tf1_setup_Password").val(ui_config["apn_info"]["entries"][i]["password"]);
			$("#tf1_apnAuth").val(ui_config["apn_info"]["entries"][i]["auth_type"]);
		}
	}
}
	
	


