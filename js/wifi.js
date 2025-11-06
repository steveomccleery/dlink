/* WiFi page */
ui_config["wps_info"] = new Object();
var wps_start = 0;
var redirectTimeoutVar2;
var con_timer = 3;
ui_config.Dyn_Status["mac_filter"]  = new Object();
ui_config.Dyn_Status["mac_filter"]["entries"]  = new Array();
function wifi_default() {
	datatable('tf1_inboxTbl');
}

function wifi_onloadStatusDetails() {
	
	//wifi_2point4status_OnOffget();
	//wifi_status_get();
	var tmpl_wifi_controlData = {   
		"wifi_turnOnOff":ui_config.Dyn_Status["wifi_status"]["enable"],	
		"channel":ui_config["wifi_config"]["channel"]
	};		

	var dataTemplate = $("#tf1_script_wifiControlTemplate").html();
        var populated_dataTemplate = doT.template(dataTemplate)(tmpl_wifi_controlData);
        $("#tf1_tmpl_wifi2point4gStatus").html(populated_dataTemplate);    
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	
	showTabs();
	onloadCall(wifi_enableDisableStatusDetailsOnLoad, {
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
	enableTextFieldByAnchorClick('tf1_wifiEnable2point4Gh', 'tf1_wifi2point4Mode tf1_wifi2point4ChannelWidth tf1_wifi2point4wifi', 'break_wifi2point4Mode break_wifi2point4ChannelWidth break_wifi2point4wifi');
	enableTextFieldByAnchorClick('tf1_wifiEnable5Gh', 'tf1_wifi5Mode tf1_wifi5ChannelWidth tf1_wifi5wifi', 'break_wifi5Mode break_wifi5ChannelWidth break_wifi5wifi');
	
	if(ui_config["wifi_config"]["wlan_country"] == "JP")
	{
	$("#tf1_wifi2point4wifi").append("<option value='14'}>14</option>");
		
	}
	else if(ui_config["wifi_config"]["wlan_country"] ==  "US" || ui_config["wifi_config"]["wlan_country"] == "CA" )
	{
		$("#tf1_wifi2point4wifi option[value='12']").remove();
		$('#tf1_wifi2point4wifi option[value="13"]').remove();
	}
	else if(ui_config["wifi_config"]["wlan_country"] ==  "IL")
	{
		$("#tf1_wifi2point4wifi option[value='10']").remove();
		$('#tf1_wifi2point4wifi option[value="11"]').remove();
		$("#tf1_wifi2point4wifi option[value='12']").remove();
		$('#tf1_wifi2point4wifi option[value="13"]').remove();
	}
}

function wifi_enableDisableStatusDetailsOnLoad(toggleObj, thisObj) {
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	switch(imgId) {
		case 'tf1_wifiEnable2point4Gh':
			enableTextFieldByAnchorClick('tf1_wifiEnable2point4Gh', 'tf1_wifi2point4Mode tf1_wifi2point4ChannelWidth tf1_wifi2point4wifi', 'break_wifi2point4Mode break_wifi2point4ChannelWidth break_wifi2point4wifi');
			break;
		case 'tf1_wifiEnable5Gh':
			enableTextFieldByAnchorClick('tf1_wifiEnable5Gh', 'tf1_wifi5Mode tf1_wifi5ChannelWidth tf1_wifi5wifi', 'break_wifi5Mode break_wifi5ChannelWidth break_wifi5wifi');
			break;

	}

}

function wifi_statusDetailsValidate(frmId) {
			var ssidval = ui_config["wifi_config"]["ssid"];
			var wpa_password = ui_config["wifi_config"]["wlan_wpa_password"];
			if(!check_wifi_str(ssidval) || ssidval =="")
			{
				alert(global_lang['validation_msgs']['pls_enter_valid_SSID']);
				return;
			}
			
			if(!check_wifi_str(wpa_password))
			{
				alert(global_lang['validation_msgs']['pls_enter_valid_pwd']);
				return;
			}
			ssidval = encodeURIComponent(ssidval);
			var passphraseval = encodeURIComponent(wpa_password);
	
	var EncrypType = ui_config["wifi_config"]["secrity_type"] || "";
	var AuthMode = "";
	if(EncrypType == "1") //wep
	{
		AuthMode = ui_config["wifi_config"]["wep_auth"];
	}
	else if(EncrypType == "2" || EncrypType == "3" || EncrypType == "4" )
	{
		AuthMode = ui_config["wifi_config"]["wlan_wpa_type"];
	}
		setHiddenChks(frmId);
            var request = $.ajax({
            url: "cgi-bin/qcmap_web_cgi",
            type: "POST",
		data:
		{
			Page: "SetWLANConfig",
			mask: "0",
			wifi_enable:$("#tf1_wifiEnable2point4GhValue").val(),
			wifi_ssid:ssidval, 
			wifi_hide:ui_config["wifi_config"]["hide"]|| "",
			wifi_band:1 ,
			wifi_mode:2 ,
			wifi_channel:$("#tf1_wifi2point4wifi").val(),
			wifi_max_clients:10,
			wifi_EncrypType:EncrypType,
			wifi_AuthMode:AuthMode,	
			wifi_wep_default_key:ui_config["wifi_config"]["wep_default_index"]|| "",
			wifi_wep_key_len:ui_config["wifi_config"]["wep_key_len"]|| "",
			wifi_Key1Type:ui_config["wifi_config"]["wep_key_type1"] || "",
			wifi_Key1Str1:ui_config["wifi_config"]["wep_key_str1"] || "",
			wifi_Key2Type:ui_config["wifi_config"]["wep_key_type2"] || "",
			wifi_Key2Str1:ui_config["wifi_config"]["wep_key_str2"] || "",
			wifi_Key3Type:ui_config["wifi_config"]["wep_key_type3"] || "",
			wifi_Key3Str1:ui_config["wifi_config"]["wep_key_str3"] || "",
			wifi_Key4Type:ui_config["wifi_config"]["wep_key_type4"] || "",
			wifi_Key4Str1:ui_config["wifi_config"]["wep_key_str4"] || "",
			wifi_wpa_password:passphraseval,
			wifi_wapi_key_type:ui_config["wifi_config"]["wlan_wapi_type"]|| "",
			wifi_wapi_key:ui_config["wifi_config"]["wlan_wapi_password"]|| "",
			wifi_HT_BW:"1",
			wifi_SecondChannel:0,
			wifi_beaconPeriod:"20",
			wifi_dtimPeriod:"1",
			token: session_token
		},
            dataType: "json"
            });
            
            request.done(function( responseData,textStatus, jqXHR ) {								  
               alert(global_lang['alerts_set']['setting_save_success']);
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
               // alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });

}

function wifi_statusDetailsReset(frmId) {
	$("#" + frmId).reset();
	
	resetImgOnOff(frmId);
	
	enableTextFieldByAnchorClick('tf1_wifiEnable2point4Gh', 'tf1_wifi2point4Mode tf1_wifi2point4ChannelWidth tf1_wifi2point4wifi', 'break_wifi2point4Mode break_wifi2point4ChannelWidth break_wifi2point4wifi');
	/*
	enableTextFieldByAnchorClick('tf1_wifiEnable5Gh', 'tf1_wifi5Mode tf1_wifi5ChannelWidth tf1_wifi5wifi', 'break_wifi5Mode break_wifi5ChannelWidth break_wifi5wifi');
	*/
}

function wifi_onloadStatus(){
	//wifi_clients_get();
	//wifi_status_get2();
	//internet_api_lanInfo_get();
	doGetWiFiConfig();
	wifi_status_template();
}

function getWPSStatus()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "getWPSStatus",
			mask: "0",
			token: session_token
		},
		dataType: "json",
	});
	request.done(function( responseData,textStatus, jqXHR )
	{	var obj = responseData;	
		//console.log(obj);
		if(obj.result == "SUCCESS")
		{
			if(obj.wps_status == "WPS_SUCCESS")	
			{	
				alert(global_lang['wifi_popup']['wps_connect_success']);
				wps_start = 0;
				con_timer=3;
				clearInterval(global_wifiPbcPinTimeoutHandler);
				global_wifiPbcPinTimeoutHandler = false;		
				wifi_onloadWps();
			}
		}
		});
  	  request.fail(function( jqXHR, textStatus, errorThrown) {	
		alert(global_lang['wifi_popup']['wps_connect_failed']);;
    });
}
function getWpsInfo()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWPSInfo",
			mask: "0",
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{							
		ui_config["wps_info"]=responseData;
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
		ui_config["wps_info"]=responseData;
    });
}

/* WPS section starts */

function wifi_onloadWps() {
	if(ui_config.Dyn_Status["wifi_status"]["enable"]==0)
	{
		alert(global_lang['wifi_popup']['wps_wifi_off']);
		return;
	}
	if(ui_config.Dyn_Status["mac_filter"]["macFilter_Mode"] == 2){
		alert(global_lang['wifi_popup']['wps_mac_filter_off']);
	    return;
	}
	if(parseInt(ui_config["wifi_config"]["secrity_type"],10) == 1){
		alert(global_lang['wifi_popup']['change_secrity_type']);
		return;
	}
	showTabs();		
	getWpsInfo();
	wifi_wps_template();
	
	onloadCall(wifi_enableDisablePinOnLoad, {
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

	enableTextFieldByAnchorClick('tf1_wifiEnablePin', '', '', 'tf1_pinBlock');	
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	$("#tf1_wps_status_div").hide();
	/* PIN or PBC are in progress */
	if (wps_start == 1) {
	
		if (ui_config["wps_info"]["wps_type"] == "2" ) { /* PIN */
			$("#tf1_pbcSection").hide();
			$("#tf1_wps_status_div").show();	
			 $("#tf1_wifiEnablePin").attr("class","enable-disable-on-noclick");
			 $("#tf1_wps_generate").attr("disabled","disabled");
			 $("#tf1_wps_default").attr("disabled","disabled");
			 
			 
			 
		} 
		
		if (ui_config["wps_info"]["wps_type"] == "1" ) { /* PBC */			
			
				$("#tf1_pinSection").hide();
				$("#tf1_wps_status_div").show();	
		} 
		
		/* This happens when WPS status is running and Hnadler is not active */
		width_perc = (con_timer/120)*100;
		width_perc = Math.round(width_perc);		
		$("#tf1_wps_statusMeter").width(width_perc+"%");
	    $(".usageDisplay").html(global_lang['wifi_popup']['searching_incoming_clients']);
	}
	
	if (ui_config["wps_info"]["wps_enable"] == "-1") {	
		$("#tf1_wps_status_div").hide();	
	}
	
	if (ui_config["wps_info"]["wps_enable"] == "0" && ui_config["wps_info"]["result"] == "timeout") { 
	
		$(".usageDisplay").html(global_lang['wifi_popup']['search_fail']);
	
	} else if (ui_config["wps_info"]["wps_enable"] == "0" && ui_config["wps_info"]["result"] == "stop") { 
	
		$("#tf1_wps_status_div").hide();
	
	}

}

function wifi_enableDisablePinOnLoad(toggleObj, thisObj) {
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	switch(imgId) {
		case 'tf1_wifiEnablePin':
			enableTextFieldByAnchorClick('tf1_wifiEnablePin', '', '', 'tf1_pinBlock');
			//wifi_api_usePinMode();
			break;
	}

}
 


function wifi_statusDetailsWpsValidate(frmId) {
	setHiddenChks(frmId);
	//dialogAlert("This mock-up version does not support form actions", "Information", "info");

}

function wifi_statusDetailsWpsReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
	wifi_changeWpsType();
	enableTextFieldByAnchorClick('tf1_wifiEnableWps', '', '', 'tf1_wifiWpsConfig');
	enableTextFieldByAnchorClick('tf1_wifiWpsPnbPinEnable', 'tf1_wifiWpsPnbPin tf1_wifiWpsPnbEnrollPin', 'break_wifiWpsPnbPin break_wifiWpsPnbEnrollPin', '');

}

/* WPS section ends */

/* Clients List start */
function getWiFiClients2()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWiFiClients",
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{							
		ui_config.Dyn_Status["wifi_status"]=responseData;
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
		//ui_config.Dyn_Status["wifi_status"]=responseData;
    });
}
/*Wifi Mac filter ends */

function RefreshDHCPEntries()
{
		var i = 0,j=0;
		$.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetDHCPLeasedHosts",
			token: session_token
		},
		dataType: "text",
		success: function(msgs)
		{
			if(msgs.length > 0)
			{
				var obj = jQuery.parseJSON(msgs);
				if(obj.result == "AUTH_FAIL")
				{
					hide_menu();
					loadpage('login.html');
					return;
				}
				if(obj.result == "Token_mismatch")
				{
					hide_menu();
					loadpage('login.html');
					alert(global_lang['wifi_popup']['Unauthorised_request']);
					return;
				}
				if(obj.result == "SUCCESS")
				{
					if( obj.dhcp_count > 0)
				{
				for(i=0; i< obj.dhcp_count ; i++)
				{	
					for(j = 0;j <ui_config.Dyn_Status["wifi_status"]["list_count"];j++){
					if(obj.entries[i].mac.indexOf(ui_config.Dyn_Status["wifi_status"]["entries"][j]["mac_addr"])!=-1)
					{	
						ui_config.Dyn_Status["wifi_status"]["entries"][j]["ip_addr"] = obj.entries[i].reserved_ip;
						ui_config.Dyn_Status["wifi_status"]["entries"][j]["hname"] = obj.entries[i].dev_name;
					}
					}
				}
				}
				}
		}
		else
			alert(global_lang['wifi_popup']['no_server']);
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(global_lang['wifi_popup']['Set_failed']);
		}
	});
}

function wifi_onload2GClientsList() {

	 getWiFiClients2();
	 RefreshDHCPEntries();

	onloadCall();
	//$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	
	if (ui_config.Dyn_Status["wifi_status"]["list_count"] != 0) {
		wifi_clients_template();
		datatable('tf1_wifi2gClientTbl');
	}
}


function wifi_2point4ClientsListValidate(frmId) {
	setHiddenChks(frmId);	
	var deleteFlag = false;
	var deleteCount = 0;
	var mac_post_data = 
			{
				"type":"clilist_mode",                   
				"CfgType":"mac_filter_list",            
				"mode" : 2
			};
	wifi_api_getDetails();
	var clientsList = new Array();
	var number = ui_config.Dyn_Status["wifi_status"]["list_count"];
	var number1 = ui_config.Dyn_Status["mac_filter"]["entries"];
	for(var i = 0; i < number;i++)
		{
			if($(".clientsList").val() == 0)
				clientsList.push($(".clientsList").val());			
		}
	var number_s = clientsList.length + number1.length;
	if(number_s > 10){
		alert(global_lang['wifi_popup']['mac_limit']);
		return false;
	}
	$(".clientsList").each(function(value,index){		 

		if ($(this).val() == "0") {			
			deleteFlag = true;			
			
			mac_post_data["keyid"+deleteCount] = "x_mac"+deleteCount;
			mac_post_data["macaddr"+deleteCount] = $(this).attr("mac");	    
			deleteCount = deleteCount + 1; 
	 	}
	});
	
	
	if ( deleteFlag == true ) {
		
		var mac_list1='';
	    for(var i = 0;i < deleteCount;i++){
			mac_list1 = mac_list1+"Y,x_mac"+i+","+ mac_post_data["macaddr"+i]+";";
		}
		
		for(var i = 0;i < old_list.length;i++)
		{
			mac_list1 = mac_list1+"Y,x_mac"+(i+deleteCount)+","+ old_list[i].macFilter_MAC+";";	
			//mac_list1.push(";");
		}
		var request = $.ajax({
    		    url: "cgi-bin/qcmap_web_cgi",
		        type: "POST",
		        data: 
				{
					Page: "SetMacFilter",
					mask: "0",
					filter_mode:"2",
					filter_list:mac_list1,
					token: session_token
				},
    		      dataType: "json"
    });
    
		
		request.done(function(responseData,textStatus, jqXHR ) {
							  
		   $(".clientsList").each(function(value,index){

				if ($(this).val() == "0") {					
					$(this).parent().parent().remove();	
				}
				
	        });
		   
		   alert(global_lang['alerts_set']['client_delete_success']);
			 
		});
		request.fail(function(jqXHR, textStatus, errorThrown) {
			   
		});
		request.always(function(responseData,textStatus, jqXHR ) {
				
		});		
		
		wifi_onload2GClientsList();	
		
   } else {	   
	 alert(global_lang['validation_msgs']['pls_select_client']); 
   }
}

function wifi_2point4ClientsListReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
}

function wifi_5gClientsListValidate(frmId) {
	setHiddenChks(frmId);
	//dialogAlert("This mock-up version does not support form actions", "Information", "info");
}

function wifi_5gClientsListReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
}

/* Clients List end */

/* Wii Security starts */
function wifi_onloadSecurity2point4() {
	showTabs();	
	//wifi_status_get2();
       doGetWiFiConfig();     
	wifi_security_template();
	wifi_SecurityprotectionSelect();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	onloadCall();
	onloadCall2();
}

function wifi_onloadSecurity5gSsId() {
	showTabs();
	onloadCall();
	onloadCall2();
	$("#tf1_btnBlock").html($("#tf1_hdButtonBlock").html());
	wifi_SecurityprotectionSelect();
}

function wifi_Security2point4Validate(frmId) {

	//if (txtFieldArrayCheck(txtFieldIdArr) == false)
		//return false;
	
	/* WEP validation */	
	var security = comboSelectedValueGet('tf1_protection');	
	var selKeyIndex = radioCheckedValueGet('tf1_rdbWepKey0');
	if (security == "2") {
		
		 if ( $("#tf1_txtWepKey"+selKeyIndex).val() == "" ) {
			alert(global_lang['validation_msgs']['pls_generate_wep_keys']);
			return false; 
		 }
	}
	setHiddenChks(frmId);
	wifi_securitysettings_set();
	//wifi_status_get2();	
    cp_mainInfo_template();	
}
	
function wifi_Security2point4Reset(event,frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);	
	if ($("#tf1_ssidVisibilityValue").val() == "1") {
		$("#tf1_ssidVisibility").attr("class","enable-disable-off");
	} else {
		$("#tf1_ssidVisibility").attr("class","enable-disable-on");
	}
	wifi_SecurityprotectionSelect();
	
	/*Added line for reset the textbox with  checkbox */
	wifi_showKey(event,'tf1_preSharedkey');
}

function wifi_Security5gValidate(frmId) {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_ssidWi-Fi5g,Please enter valid SSID Wi-Fi";
	txtFieldIdArr[1] = "tf1_maxClientnum,Please enter max Client Number";
	txtFieldIdArr[2] = "tf1_preSharedkey,Please enter valid pre-shared Key";
	txtFieldIdArr[3] = "tf1_key,Please enter valid Key";

	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	setHiddenChks(frmId);

	//dialogAlert("This mock-up version does not support form actions", "Information", "info");
}

/**
 * This function calls when user selects drop down item from "Securityprotection" select box
 * Select box onchange event
 * @method wifi_SecurityprotectionSelect
 */
function wifi_SecurityprotectionSelect() {
	/* This function is Global from globalMgmt.js */
	var wifi_protection = parseInt(comboSelectedValueGet('tf1_protection'), 10);
	switch(wifi_protection) {
		case 0 :
			// No Protection
			fieldStateChangeWr('tf1_authenticationType tf1_wpaMode tf1_cipherType tf1_preSharedkey tf1_key', 'tf1_keyTable', '', '');
			vidualDisplay('tf1_authenticationType tf1_wpaMode tf1_cipherType tf1_preSharedkey tf1_key tf1_keyTable', 'hide');
			vidualDisplay('break_authenticationType break_wpaMode break_cipherType break_preSharedkey break_key', 'hide');
			break;
			
		case 2:
			// Basic Protechtion
			fieldStateChangeWr('tf1_wpaMode tf1_cipherType tf1_preSharedkey', '', 'tf1_authenticationType tf1_key', 'tf1_keyTable');
			vidualDisplay('tf1_authenticationType tf1_key tf1_keyTable', 'configRow');
			vidualDisplay('break_authenticationType break_key break_keyTable', 'break');
			vidualDisplay('tf1_wpaMode tf1_cipherType tf1_preSharedkey', 'hide');
			vidualDisplay('break_wpaMode break_cipherType break_preSharedkey', 'hide');
			break;

		case 3:
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

function wifi_Security5gReset(frmId) {
	$("#" + frmId).reset();
	resetImgOnOff(frmId);
	wifi_SecurityprotectionSelect();
}

/* Wii Security ends */


function wifi_addMacFilterForm(event) {

    if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}	
	
	if (parseInt($("#tf1_macCount").html(),10) == parseInt($("#tf1_macCountMax").html(),10) ) {
		
		alert(global_lang['wifi_popup']['mac_limit']);
		return false;
	}
	
 	$("#tf1_macAddress").val('');
    var selFilter = radioCheckedValueGet('tf1_macFmethod');
     if (selFilter == "o") {
        $("#tf1_h4NewMac").html("Add New MAC - White List");
     } else {
        $("#tf1_h4NewMac").html(global_lang['wifi_popup']['mac_filter_add_black_list']);
     }
    /*Close Block */
    $(".configForm").hide();

    /*Open Block */
    $("#tf1_wifiMacFilterForm").show();
}

function wifi_macFilter() {
    var txtFieldIdArr = new Array();
    txtFieldIdArr[0] = "tf1_macAddress,"+ global_lang['validation_msgs']['pls_enter_mac_address'];
    

    if (txtFieldArrayCheck(txtFieldIdArr) == false)
        return false;

    macObj = document.getElementById('tf1_macAddress');
    if (!(macAddrValidate(macObj.value, true, "", '', macObj))) {
        macObj.focus();
        return false;
    }

      wifi_api_addMac();
}

function wifi_formClose(event) {

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
function wifi_startpin_callback(){
	$("#tf1_wps_status_div").show();
	$("#tf1_pbcSection").hide();
	$("#tf1_wifiEnablePin").attr("class","enable-disable-on-noclick");
	$("#tf1_wps_generate").attr("disabled","disabled");
	$("#tf1_wps_default").attr("disabled","disabled");
	$(".usageDisplay").html(global_lang['wifi_popup']['searching_incoming_clients']);
	
	$("#tf1_wps_statusMeter").width("1%");
}
function wifi_startpin(){
	if(ui_config.Dyn_Status["wifi_status"]["enable"]==0)
	{
		alert(global_lang['wifi_popup']['wps_wifi_off']);
		return;
	}	
	if(ui_config["wifi_config"]["hide"]==1)
	{
		alert(global_lang['wifi_popup']['wps_wifi_hiden']);
		return;
	}
		var tmp = parseInt(ui_config["wifi_config"]["secrity_type"],10);
	if(tmp ==  1||tmp == 0)
		{
		alert(global_lang['wifi_popup']['Wps_Wrong']);
		return;
	}else
		{
		//$("#tf1_wifi_startPin").show();
	}
	 pinmodest = 2;
	 var ap_pin = $("#tf1_enterPin").val();
	 
	if(wps_start !=1 ){
		//$("#tf1_wps_statusMeter").width("1%");
		 wifiApi_startPin(pinmodest,ap_pin, wifi_startpin_callback);
	}
}

function wifi_generatenew(){

	$.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "genAPPin",
			mask: "0",
			token: session_token
		},
		dataType: "text",
		success: function(msgs)
		{
			var obj = jQuery.parseJSON(msgs);
			alert(obj.result);
			if(obj.result == "AUTH_FAIL")
			{
				loadpage('login.html');
				return;
			}
			if(obj.result == "Token_mismatch")
			{
				loadpage('login.html');
				alert(global_lang['wifi_popup']['Unauthorised_request']);
				return;
			}
			if(obj.result == "SUCCESS")
			{
				if(obj.router_pin) {
					$("#tf1_enterPin").val(obj.router_pin);	
					ui_config["wps_info"]["router_pin"] = obj.router_pin;
				}			
			}
		},
		error: function(xhr, textStatus, errorThrown)
		{
			alert(global_lang['wifi_popup']['Set_failed']);
		}
	});
}


function wifi_usedefault(){
	wifi_default_wpspinget();
}

function wifi_setPBC_callback(){
	$("#tf1_wps_status_div").show();
	$("#tf1_pinSection").hide();
	$(".usageDisplay").html(global_lang['wifi_popup']['searching_incoming_clients']);
	
	$("#tf1_wps_statusMeter").width("1%");
}
function wifi_setPBC(){
	if(ui_config.Dyn_Status["wifi_status"]["enable"]==0)
	{
		alert(global_lang['wifi_popup']['wps_wifi_off']);
		return;
	}
	var tmp = parseInt(ui_config["wifi_config"]["secrity_type"],10);
	if(tmp ==  1||tmp == 0)
		{
		alert(global_lang['wifi_popup']['Wps_Wrong']);
		return;
	}else
		{
		//$("#tf1_wifiPbcStart").show();
	}
	if(ui_config["wifi_config"]["hide"]==1)
	{
		alert(global_lang['wifi_popup']['wps_wifi_hiden']);
		return;
	}
	
	if(wps_start !=1 ){
		//$("#tf1_wps_statusMeter").width("1%");
		wifiApi_startPBC(wifi_setPBC_callback);
	}
}

function wifi_abortPbc() {
	 
	 
	clearInterval(global_wifiPbcPinTimeoutHandler);
	$("#tf1_wifi_pbcAbort").val(global_lang['wifi_popup']['stoping']); 
	$("#tf1_wps_status_div").hide();	
	global_wifiPbcPinTimeoutHandler = false;	
	wifiApi_stopwps();	 
	wifi_onloadWps();
}

function wifi_abortPin() {
	
	clearInterval(global_wifiPbcPinTimeoutHandler);
	$("#tf1_wifi_abortPin").val(global_lang['wifi_popup']['stoping']);
	$("#tf1_wps_status_div").hide();
	global_wifiPbcPinTimeoutHandler = false;	
	wifiApi_stopwps();	 
	wifi_onloadWps();
}

/* wi-fi Clients list Template Function */
function wifi_clients_template() {
	var i = 0;
    var tmpl_clients_data = new Array();
	if(ui_config.Dyn_Status["wifi_status"]["list_count"] > 0)
	{
              for(i=0; i< ui_config.Dyn_Status["wifi_status"]["list_count"]; i++)
             	{
             		 tmpl_clients_data[i] = new  Object();
			 tmpl_clients_data[i].hname=ui_config.Dyn_Status["wifi_status"]["entries"][i]["hname"];
			 tmpl_clients_data[i].ip=ui_config.Dyn_Status["wifi_status"]["entries"][i]["ip_addr"];
			 tmpl_clients_data[i].mac = ui_config.Dyn_Status["wifi_status"]["entries"][i]["mac_addr"];
             	}
	}
    var dataArrayTemplate = $("#wifi_ClientTemplate").html();
    var populatedDataArrayTemplate = doT.template(dataArrayTemplate)(tmpl_clients_data);
    $("#tf1_wifiClientsTblbody").html(populatedDataArrayTemplate);

}

function getWiFiMAC()
{
	var request = $.ajax(
	{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "GetSystemAbout",
				mask: "0",
				token: session_token
			},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{		
		ui_config["lan"]["mac"] = responseData.lan_mac;			
	});
}

/* wi-fi status Template Function */
function wifi_status_template() {
    getWiFiMAC();
    var ssid = HTMLDecode(ui_config["wifi_config"]["ssid"]).replace(/</g,"&lt;");
    var tmpl_status_data = {  
    					"wifi_wps":"ON",
    					"wifi2point4":ui_config.Dyn_Status["wifi_status"]["enable"],
    					"Clientlist":ui_config.Dyn_Status["wifi_status"]["list_count"],
    					"SSIDname":ssid,
    					"Encryption":ui_config["wifi_config"]["secrity_type"],
    					"dhcp_service":ui_config["lan"]["lan_dhcp"],
					"ip_addr":ui_config["lan"]["ip"],
				        "signallevel":ui_config.Dyn_Status["wifi_status"]["enable"],
    					"MacAddr":ui_config["lan"]["mac"]
					};			
	var security = parseInt(ui_config["wifi_config"]["secrity_type"],10);	

        if (security == "3") //wpa2
	{
		tmpl_status_data.protection = "3";	
		tmpl_status_data.wpaMode = "WPA2";
              tmpl_status_data.cipherType = global_lang["wifi_popup"]["aes"] || 'AES';
		tmpl_status_data.passphrase = ui_config["wifi_config"]["wlan_wpa_password"];	
	}
        else if (security == "4") //wpa2
	{
		tmpl_status_data.protection = "3";	
              tmpl_status_data.wpaMode = "WPA / WPA2";
	        if(ui_config["wifi_config"]["wlan_wpa_type"] == "2")
	        {
                   tmpl_status_data.cipherType = global_lang["wifi_popup"]["aes_tkip"] || 'AES / TKIP';
	        }
		if(ui_config["wifi_config"]["wlan_wpa_type"] == "1")
	         {
                      tmpl_status_data.cipherType = global_lang["wifi_popup"]["aes"] || 'AES';
                }
		tmpl_status_data.passphrase = ui_config["wifi_config"]["wlan_wpa_password"];	
	}
	else if(security == "1")
	{
		tmpl_status_data.protection = "2";	
		tmpl_status_data.wpaMode = "Basic Protection";
		tmpl_status_data.cipherType = "";
	}
	else
	{
		tmpl_status_data.protection = "0";
		tmpl_status_data.wpaMode = "No Protection";
		tmpl_status_data.cipherType = "NONE";
	}
    var pagefn = doT.template(document.getElementById('wifistatusinfoTemplate').text);
    $("#tf1_tmpl_wifistatus_info").html(pagefn(tmpl_status_data));

}

/* wi-fi2point4 Template Function */
function wifi_wps_template() {
    var tmpl_wps_data = {
    						"enablepinmode":ui_config["wps_info"]["wps_type"],
    						"enrolleepin":ui_config["wps_info"]["router_pin"],
    						"status":ui_config["wps_info"]["wps_enable"],
    						"coonection_status":ui_config["wps_info"]["wps_config_state"],
    						//"connectiontimer":ui_config["wps_info"][""] ,
    						"error_status":ui_config["wps_info"]["result"]
    					};
     var tmpl_wps_data = {
    						"enablepinmode":ui_config["wps_info"]["wps_type"],
    						"enrolleepin":ui_config["wps_info"]["router_pin"],
    					 };		
    var pagefn = doT.template(document.getElementById('wifiwpsstatusinfoTemplate').text);
    $("#tf1_tmpl_wifiwpsstatus_info").html(pagefn(tmpl_wps_data));

}

function decode_passwd(passtext)
{
	//encode login password,encode like sample: "1250" <= "12"+'50' <= "12"+2<= "122" <= 122 <= 'z'
	var str = new String;
	var passwd = new String;
	for(var i = 0; i < passtext.length;i += 4)
	{
			j = i;str = "";
			if(passtext[j] == '0')
			{//"0550" => "52" => 52 => '4'
				
				if (passtext[j + 1] != '0'){
					str += passtext[j + 1];
				}
				if (passtext[j + 2] == '4')
				{				
					str += (parseInt(passtext[j + 3]) - 8).toString();
				}		
				else// '5'
				{
					str += (parseInt(passtext[j + 3]) + 2).toString();
				}
			}
			else
			{//"1250" => "122" => 122 => 'z'
				str +=passtext[j];
				str += passtext[j + 1];
				if (passtext[j + 2] == '4')
					str += (parseInt(passtext[j + 3]) - 8).toString();
				else// '5'
					str += (parseInt(passtext[j + 3]) + 2).toString();
			}
			passwd += String.fromCharCode(str);
	}
	return passwd;
}
/* wi-fi_security Template Function  */
function wifi_security_template() {

    var tmpl_wifisecurity_data = {
    					"SSID":ui_config["wifi_config"]["ssid"],
					"broadcastSSID": ui_config["wifi_config"]["hide"],
					"passphrase": ui_config["wifi_config"]["wlan_wpa_password"] || "",
					"wepKey":  ui_config["wifi_config"]["wep_key_str1"] || "",
					"wepKeyIndex":  ui_config["wifi_config"]["wep_default_index"] || "",
    				 };
	var security = parseInt(ui_config["wifi_config"]["secrity_type"],10);

    if (security == "3") //wpa2
	{
		tmpl_wifisecurity_data.protection = "3";	

                tmpl_wifisecurity_data.wpaMode = "WPA2";
                tmpl_wifisecurity_data.cipherType = "1";
                 
		tmpl_wifisecurity_data.passphrase = decode_passwd(ui_config["wifi_config"]["wlan_wpa_password"]) || "";	
	}
    else if (security == "4") //wpawpa2
	{
		tmpl_wifisecurity_data.protection = "3";	
		tmpl_wifisecurity_data.wpaMode = "Auto";
	        if(ui_config["wifi_config"]["wlan_wpa_type"] == "2")
	        {
                   tmpl_wifisecurity_data.cipherType = "2";	
	        }
		if(ui_config["wifi_config"]["wlan_wpa_type"] == "1")
	         {
                    tmpl_wifisecurity_data.cipherType = "1";
                } 
		tmpl_wifisecurity_data.passphrase = decode_passwd(ui_config["wifi_config"]["wlan_wpa_password"]) || "";	
	}
	else if(security == "1") //wep
	{
			tmpl_wifisecurity_data.protection = "2";
			tmpl_wifisecurity_data.wpaMode = "";
			tmpl_wifisecurity_data.cipherType = "";	
			if(ui_config["wifi_config"]["wep_default_index"] == "0")
			{	
				tmpl_wifisecurity_data.wepKey = ui_config["wifi_config"]["wep_key_str1"] || "";	
				tmpl_wifisecurity_data.wepKey = decode_passwd(tmpl_wifisecurity_data.wepKey) || "";	
			}
			else if(ui_config["wifi_config"]["wep_default_index"] == "1")	
			{	
				tmpl_wifisecurity_data.wepKey = ui_config["wifi_config"]["wep_key_str2"] || "";	
				tmpl_wifisecurity_data.wepKey = decode_passwd(tmpl_wifisecurity_data.wepKey) || "";	
			}
			else if(ui_config["wifi_config"]["wep_default_index"] == "2")	
			{	
				tmpl_wifisecurity_data.wepKey = ui_config["wifi_config"]["wep_key_str3"] || "";	
				tmpl_wifisecurity_data.wepKey = decode_passwd(tmpl_wifisecurity_data.wepKey) || "";	
			}
			else if(ui_config["wifi_config"]["wep_default_index"] == "3")	
			{	
				tmpl_wifisecurity_data.wepKey = ui_config["wifi_config"]["wep_key_str4"] || "";	
				tmpl_wifisecurity_data.wepKey = decode_passwd(tmpl_wifisecurity_data.wepKey) || "";	
			}
			else
			{	
				tmpl_wifisecurity_data.wepKey = ui_config["wifi_config"]["wep_key_str1"] || "";	
				tmpl_wifisecurity_data.wepKey = decode_passwd(tmpl_wifisecurity_data.wepKey) || "";	
			}
	}
	else
	{
		tmpl_wifisecurity_data.protection = "0";
		tmpl_wifisecurity_data.wpaMode = "";
		tmpl_wifisecurity_data.cipherType = "";
	}
	tmpl_wifisecurity_data.passphrase = tmpl_wifisecurity_data.passphrase.replace("\"","&quot;");
    var pagefn = doT.template(document.getElementById('wifisecurityinfoTemplate').text);
    $("#tf1_tmpl_wifisecurity_info").html(pagefn(tmpl_wifisecurity_data));

}

function encode_passwd(passtext)
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

function wifi_securitysettings_set(){
		
			var security, wpa_auth;
			var ssidval = $("#tf1_ssidWi-Fi2point4g").val();
			var broadcastSSIDval = $("#tf1_ssidVisibilityValue").val();
			if(!check_wifi_str(ssidval) || ssidval =="")
			{
				alert(global_lang['validation_msgs']['pls_enter_valid_SSID']);
				return;
			}
			if (broadcastSSIDval == "0") {
				broadcastSSIDval = "1";
			} else {
				
				broadcastSSIDval = "0";
			}
			
			var wifi_psw =  $("#tf1_preSharedkey").val();
			if(!check_wifi_str(wifi_psw))
			{
				alert(global_lang['validation_msgs']['pls_enter_valid_pwd']);
				return;
			}
			ssidval = encodeURIComponent(ssidval);
			var passphraseval = $("#tf1_preSharedkey").val();
			var protection_val = $("#tf1_protection").val();
			var wpaMode_val = $("#tf1_wpaMode").val();
			var cipherType_val = $("#tf1_cipherType").val();
			var wep_key_index  = "";
			var wep_key_len = "";
			var wep_keyType1 = "0";
			var wep_keyStr1 = "";
			var wep_keyType2 = "0";
			var wep_keyStr2 = "";
			var wep_keyType3 = "0";
			var wep_keyStr3 = "";
			var wep_keyType4 = "0";
			var wep_keyStr4 = "";

			if ( protection_val == "0" ) {
				
				security = 0;
				wpa_auth = 0;
				passphraseval = "";
			}  else if (protection_val == "2" ) {
				security = 1;
				wpa_auth = "3";
				passphraseval = "";
				wep_key_index = radioCheckedValueGet('tf1_rdbWepKey0');
				//wep_key = $("#tf1_txtWepKey"+wep_key_index).val();	
				wep_key_len = wepKeyLenGet('tf1_toggle_keyType'+wep_key_index);
				if(wep_key_len == 10)
					wep_key_len = 0;
				else
					wep_key_len = 1;
				wep_keyStr1 = $("#tf1_txtWepKey0").val();
				wep_keyStr1 = encode_passwd(wep_keyStr1);
				wep_keyStr2 = $("#tf1_txtWepKey1").val();
				wep_keyStr2 = encode_passwd(wep_keyStr2);
				wep_keyStr3 = $("#tf1_txtWepKey2").val();
				wep_keyStr3 = encode_passwd(wep_keyStr3);
				wep_keyStr4 = $("#tf1_txtWepKey3").val();
				wep_keyStr4 = encode_passwd(wep_keyStr4);
	
			}  else if (wpaMode_val == "WPA2" ) {
				if (passphraseval.length < 8 || passphraseval.length > 63)
				{
					alert(global_lang['wifi_popup']['Invalid_pre_key']);
					return;
				}
			   	passphraseval = encode_passwd(passphraseval);
				
				security = 3;
				wpa_auth = 1;
				
			} else if (wpaMode_val == "Auto"){
	
				if (passphraseval.length < 8 || passphraseval.length > 63)
				{
					alert(global_lang['wifi_popup']['Invalid_pre_key']);
					return;
				}
			   	passphraseval = encode_passwd(passphraseval);
			
				security = 4;
				wpa_auth = 2;
			}
			   else
			{
				security = 0;
				wpa_auth = 0;
				passphraseval = "";				
			}
	
            var request = $.ajax({
            url: "cgi-bin/qcmap_web_cgi",
            type: "POST",	
            data:
		{
			Page: "SetWLANConfig",
			mask: "0",
			wifi_enable:ui_config.Dyn_Status["wifi_status"]["enable"],
			wifi_ssid:ssidval,
			wifi_hide:broadcastSSIDval,
			wifi_band:1 ,
			wifi_mode:2 ,
			wifi_channel:ui_config["wifi_config"]["channel"],
			wifi_max_clients:10,
			wifi_EncrypType:security,
			wifi_AuthMode:wpa_auth,	
			wifi_wep_default_key:wep_key_index,
			wifi_wep_key_len:wep_key_len,
			wifi_Key1Type:wep_keyType1,
			wifi_Key1Str1:wep_keyStr1,
			wifi_Key2Type:wep_keyType2,
			wifi_Key2Str1:wep_keyStr2,
			wifi_Key3Type:wep_keyType3,
			wifi_Key3Str1:wep_keyStr3,
			wifi_Key4Type:wep_keyType4,
			wifi_Key4Str1:wep_keyStr4,
			wifi_wpa_password:passphraseval,
			wifi_wapi_key_type:"",
			wifi_wapi_key:"",
			wifi_HT_BW:"1",
			wifi_SecondChannel:0,
			wifi_beaconPeriod:"20",
			wifi_dtimPeriod:"1",
			token: session_token
		},
            dataType: "json"
            });
            
            request.done(function( responseData,textStatus, jqXHR ) {								  
			    alert(global_lang['alerts_set']['setting_save_success']);
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
				///console.log(jqXHR);				  
                //alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });

}

function wifi_changeWpaMode() {

 	var wpaMode = comboSelectedValueGet('tf1_wpaMode');
	$("#tf1_cipherType option[value='1']").remove();
	//$("#tf1_cipherType option[value='0']").remove();
	$("#tf1_cipherType option[value='2']").remove();
	
	switch (wpaMode) {	
		case 'Auto' :
			$("#tf1_cipherType").append('<option value="2">AES / TKIP</option>');
			$("#tf1_cipherType").val('2');
		break;	
		case 'WPA2' :		
		case 'WPA' :
		$("#tf1_cipherType").append('<option value="1">AES</option>');
		//$("#tf1_cipherType").append('<option value="0">TKIP</option>');
		$("#tf1_cipherType").val('1');
		break;	
		
	}	
}


function wifi_showKey(event,keyId) {

	if ($(event.target).is(':checked')) {
		$("#"+keyId).attr("type","text");
	} else {		
		$("#"+keyId).attr("type","password");		
		
	}
}


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}



function wepKeyLenGet(toggleId){
	
	 if ($("#"+toggleId).attr("class") == "enable-disable2-off") {
		 	encrMethod = 128;
	 } else {
		 encrMethod = 64;		 
	 }
    
    var keyLen = 0;
    switch (parseInt(encrMethod, 10)) {
        case 152: /* 152 bit */
            keyLen = 32; /* 32 hex chars */
            break;
        case 128: /* 126 bit */
            keyLen = 26; /* 26 hex chars */
            break;
        case 64: /* 64 bit */
        default:
            keyLen = 10; /* 10 hex chars */
    }
    return keyLen;
}



function generateWepKeys(){
    
    var wepPsk = document.getElementById('tf1_key').value;
    if (wepPsk == "") {
        /* document.getElementById('tf1_txtWepPskErr').innerHTML = "Enter Pass Phrase"; */
		alert(global_lang['validation_msgs']['pls_enter_wep_phrase']);
        return
    }
	var keyLen = wepKeyLenGet('tf1_toggle_keyType0');
    document.getElementById('tf1_txtWepKey0').value = hex_md5(wepPsk).substr(0, keyLen);	
    wepPsk += document.getElementById('tf1_txtWepKey0').value;
	
	keyLen = wepKeyLenGet('tf1_toggle_keyType1');
    document.getElementById('tf1_txtWepKey1').value = hex_md5(wepPsk).substr(0, keyLen);
    wepPsk += document.getElementById('tf1_txtWepKey1').value;
	
	keyLen = wepKeyLenGet('tf1_toggle_keyType2');
    document.getElementById('tf1_txtWepKey2').value = hex_md5(wepPsk).substr(0, keyLen);
    wepPsk += document.getElementById('tf1_txtWepKey2').value;
	
	keyLen = wepKeyLenGet('tf1_toggle_keyType3');
    document.getElementById('tf1_txtWepKey3').value = hex_md5(wepPsk).substr(0, keyLen);
    wepPsk += document.getElementById('tf1_txtWepKey3').value;
}


function wifi_keyTypeChange() {
	alert(global_lang['validation_msgs']['change_wep_key']);	
}
