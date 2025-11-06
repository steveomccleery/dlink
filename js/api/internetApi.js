var support_cdma = 0x0001;
var support_hdr = 0x0002;
var support_gsm = 0x0004;
var support_umts = 0x0008;
var support_lte = 0x0010;
var support_tds = 0x0020;
var network_2G = 0;
var network_3G = 0;
var network_4G = 0;
var network_auto = 0;
var current_network_mode = network_auto;
function GetSupportNetwork()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetSupportNetwork",
			mask: 0,
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
				support_type = parseInt(responseData.support_type);
				if((support_type & (support_gsm)) == support_gsm)
					network_2G = (network_2G |support_gsm );
				if((support_type & (support_cdma)) == support_cdma)
					network_2G = (network_2G |support_cdma );			
				if((support_type & (support_umts)) == support_umts)
					network_3G = (network_3G |support_umts );		
				if((support_type & (support_tds)) == support_tds)
					network_3G = (network_3G |support_tds );	   		
				if((support_type & (support_hdr)) == support_hdr)
					network_3G = (network_3G |support_hdr );		
				if((support_type & support_lte) == support_lte)
					network_4G = (network_4G |support_lte );	
				network_auto = (network_2G|network_3G |network_4G );							
			}
			else
			{
				network_2G = support_gsm ;
				network_3G = support_umts ;	
				network_4G = support_lte ;	
				network_auto = (network_2G|network_3G |network_4G );	
			}
	});
}
function doGetNetworkMode()
{	
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetNetworkMode",
			mask: 0,
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
			current_network_mode = responseData.networkMode;
	});	
}

function internet_onloadInternetApnConfig() {
	GetProfileList();
	doGetConnectProfile();
	doGetSystemAPN();
	find_system_apn_info();
	find_connect_apn_info();
	get_apn_type();
	internet_apnget_template();
	internet_apnModeSelect();
	onloadCall();
}


function internet_onloadConnmodeConfig() {
	system_firmwareupgrade_get();
	GetSupportNetwork();
	doGetNetworkMode();
	getConnectMode();
	internet_cnmode_get_template();
	internet_changeConnectionModeOne($("#tf1_autoConnectionOnOff").val());
}

/*APN info template */
function internet_cnmode_get_template(){
   var tmpl_cnmodeinfo_data = new Object();
	tmpl_cnmodeinfo_data["roaming"] = ui_config["wan_conn_config"]["roaming"];
	tmpl_cnmodeinfo_data["network_mode"] = current_network_mode;
	tmpl_cnmodeinfo_data["autoConn_mode"] = ui_config["wan_conn_config"]["autoconnect"];
   
   var pagefn = doT.template(document.getElementById('cnmodeinfoTemplate').text);
   $("#tf1_tmpl_cnmode_info").html(pagefn(tmpl_cnmodeinfo_data));

}

/*Conection Mode Settings template */
function internet_apnget_template(){ 
	var tmpl_fwinfo_data = new Object();
	tmpl_fwinfo_data["connect_apn"] = ui_config["connect_apn_info"];
	tmpl_fwinfo_data["list"]=ui_config["system_apn_list"];
	tmpl_fwinfo_data["apn_type"] = apn_type;
   var pagefn = doT.template(document.getElementById('apninfoTemplate').text);
   $("#tf1_tmpl_apn_info").html(pagefn(tmpl_fwinfo_data));

}


function internet_ApnConfigValidate(frmId) {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_apn,"+global_lang['validation_msgs']['pls_enter_valid_APN'];	
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	internet_api_ApnConfig();	
	internet_onloadInternetApnConfig_1();
}

function internet_api_setConnectApn(apn_index)
{
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "SetWanProfileId",
				mask: "0",
				profile_index: apn_index,
				ip_family: "3",
				profile_type: "0",	
				token: session_token
			},
			dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR )
		{
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
				alert(global_lang['alerts_set']['apn_save_success']);  
			}
		});	
}

function internet_api_deleteApn(apn_index)
{
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "DeleteProfile",
				mask: "0",
				type: "0",
				index: apn_index,
				token: session_token
			},
			dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR )
		{
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
		});	
}

function internet_api_ApnConfig() {	
	var type = $("#tf1_apnMode").val();
	if (type == "Auto") {
		var selectedId = document.getElementById("tf1_networkType").selectedIndex;
		if ( selectedId == -1) {
			var selectedIndex = 0; 
		}
		else
			var selectedIndex = document.getElementById("tf1_networkType").options[selectedId].value;
		
		internet_api_deleteApn(manual_apn_index);
		internet_api_setConnectApn(selectedIndex);
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "ModifyProfile",
				mask: "0",
				type: "0",
				index: 1,
				name: "auto",
				apn: $("#tf1_apn").val(),
				username: $("#tf1_userName").val(),
				password: $("#tf1_Password").val(),
				auth_preference: "3",
				pdp_type: "3",
				apn_bearer: "4",
				replace_default: "0",		
				token: session_token
			},
			dataType: "json"
		});
		manual_apn_index = 0;
		apn_type = 0 ;
	}
	else {
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "set_manual_apn",
				mask: "0",
				type: "0",
				index: manual_apn_index,
				name: "manual",
				apn: $("#tf1_apn").val(),
				username: $("#tf1_userName").val(),
				password: $("#tf1_Password").val(),
				auth_preference: $("#tf1_apnAuth").val(),
				pdp_type: "3",
				apn_bearer: "4",
				replace_default: "0",		
				token: session_token
			},
			dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR )
		{
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
				apn_type = 1 ;
				manual_apn_index = responseData.profile_index;
				internet_api_setConnectApn(manual_apn_index);
			}
		});
	}
}

function internet_api_doMobileAPConf()
{
	var maskVal = 0;
	if(ui_config["wan_conn_config"]["autoconnect"] != $("#tf1_autoConnectionOnOff").val())
	{
		maskVal = maskVal | 2;
	}
	if(ui_config["wan_conn_config"]["roaming"] != $("#tf1_autoRoaming").val())
	{
		maskVal = maskVal | 4;
	}
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetMobileAP",
			maskVal: maskVal,
			autoconnect: $("#tf1_autoConnectionOnOff").val(),
			autoconnect_result: "0",
			roaming: $("#tf1_autoRoaming").val(),
			roaming_result: "0",
			token: session_token
		},
			dataType: "json"
		});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
		/* setting the global variable when it is disconnected */
		if (parseInt($("#tf1_netPref").val(),10) == network_2G) {
			global_disconnect_service = "2G";	
		} else if (parseInt($("#tf1_netPref").val(),10) == network_3G) {
			global_disconnect_service = "3G";						
	  	} else if (parseInt($("#tf1_netPref").val(),10) == network_4G) {
		   global_disconnect_service = "4G";
	   	} else {
		   global_disconnect_service = null;
	   	}
		
	});	
}

function internet_api_doNetConf() 
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetNetworkMode",
			mask: 0,
			mode:  $("#tf1_netPref").val(),
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
		if(responseData.result == "INTERNAL ERROR")
		{
			alert("Change band failed for this SIM!");
			return;
		}
		
	});
}


function internet_api_cnmodeConfig() {
	if(current_network_mode != $("#tf1_netPref").val())
	{
		internet_api_doNetConf();
	}
	getWanStatus();
	if(ui_config["wan_conn_config"]["autoconnect"] != $("#tf1_autoConnectionOnOff").val() || ui_config["wan_conn_config"]["roaming"] != $("#tf1_autoRoaming").val())
	{
		internet_api_doMobileAPConf();
	}
	if ($("#tf1_autoConnectionOnOff").val() == 0) 
	{
		if(ui_config.Dyn_Status["wan_info"]["ip4"]["call_status"] == "connected" && $("#tf1_modeConfig_connectDisconnect").val() == 0)
		{
			internet_api_manualConnectDisconnect(0);
			internet_api_manualConnectDisconnect6(0);
		}
		else if(ui_config.Dyn_Status["wan_info"]["ip4"]["call_status"] != "connected" && $("#tf1_modeConfig_connectDisconnect").val() == 1)
		{
			internet_api_manualConnectDisconnect(1);
			internet_api_manualConnectDisconnect6(1);
		}
				  
		if ( $("#tf1_modeConfig_connectDisconnect").val() == 1) {
			alert(global_lang['alerts_set']['cnmode_success']);
		} else {
			alert(global_lang['alerts_set']['cnmode_success1']);
		}
	} else {								  
		alert(global_lang['alerts_set']['cnmode_success1']); 
	}	
	//getWanStatus();		
	getConnectMode();
	doGetWanConnectedTime();
}

function internet_api_manualConnectDisconnect(mode) {
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetWWANIPV4",
			mask: 3,
			enable: 1,
			enable_result : "0",
			backhaul: mode,
			backhaul_result : "0",
			tech_result : "0",
			tech_pref: "0",
			profile_id_3gpp: "0",
			profile_id_3gpp2: "0",
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
	});	
}

function internet_api_manualConnectDisconnect6(mode) {
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetWWANv6",
			mask: 3,
			enable: 1,
			enable_result : "0",
			backhaul: mode,
			backhaul_result : "0",
			tech_result : "0",
			tech_pref: "0",
			profile_id_3gpp: "0",
			profile_id_3gpp2: "0",
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
	});	
}


function internet_plmnmode_get(){	
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetPlmnMode",
			mask: 0,
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
				ui_config["plmn_info"] = responseData.plmn_mode;
				ui_config["plmnlist_info"]["plmn_state"] = "0";
			}
		});
}
var global_search_count = 0;
function internet_plmnlist_get(){   
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetSearchPlmnResult",
			mask: 0,
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
			if(responseData.search_result == "OK")
			{
				window.global_wifiClient_pollingTimer = setTimeout(getWiFiClients, 3000);
				window.global_wan_pollingTimer = setTimeout(getWWANSTATS, 3000);
				window.wan_connected_time_pollingTimer = setTimeout(doGetWanConnectedTime, 3000);
				window.wan6_connected_time_pollingTimer = setTimeout(doGetWan6ConnectedTime, 3000);
				window.wifi_SSID_pollingTimer = setTimeout(doGetWiFiConfig, 3000);
				window.index_smsStoreStatus_pollingTimer = setTimeout(index_getSMSStoreStatus, 3000);
				window.global_wanStatus_pollingTimer = setTimeout(getWanStatus, 3000);
				
				if (window.global_plmnSearchTimeoutHandler){clearTimeout(window.global_plmnSearchTimeoutHandler);}
				 ui_config["plmnlist_info"] = responseData;
				 ui_config["plmnlist_info"]["plmn_state"] = "3";
				internet_plmnMode();
			}
			else
			{
				global_search_count ++;
				if(global_search_count >= 55)
				{
					if (window.global_plmnSearchTimeoutHandler){clearTimeout(window.global_plmnSearchTimeoutHandler);}
					
					alert(global_lang["internet_popup"]["plmn_timeout"]);
					$("#tf1_searchOperators").html(global_lang["internet_popup"]["plmn_timeout"]);
					
					return;
					
				}
				if (window.global_plmnSearchTimeoutHandler){clearTimeout(window.global_plmnSearchTimeoutHandler);}
				window.global_plmnSearchTimeoutHandlerr = setTimeout(internet_plmnlist_get, 3000);
				window.global_wifiClient_pollingTimer = setTimeout(getWiFiClients, 3000);
				window.global_wan_pollingTimer = setTimeout(getWWANSTATS, 3000);
				window.wan_connected_time_pollingTimer = setTimeout(doGetWanConnectedTime, 3000);
				window.wan6_connected_time_pollingTimer = setTimeout(doGetWan6ConnectedTime, 3000);
				window.wifi_SSID_pollingTimer = setTimeout(doGetWiFiConfig, 3000);
				window.index_smsStoreStatus_pollingTimer = setTimeout(index_getSMSStoreStatus, 3000);
				window.global_wanStatus_pollingTimer = setTimeout(getWanStatus, 3000);
			}				
	});
}

function internet_api_plmnSearch() {
	
	ui_config["plmnlist_info"]["plmn_state"] = "1";
       global_search_count = 0;
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetPlmnList",
			mask: 1,
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
				if (window.global_wifiClient_pollingTimer){clearTimeout(window.global_wifiClient_pollingTimer);}
				if (window.global_wan_pollingTimer){clearTimeout(window.global_wan_pollingTimer);}
				if (window.wan_connected_time_pollingTimer){clearTimeout(window.wan_connected_time_pollingTimer);}
				if (window.wan6_connected_time_pollingTimer){clearTimeout(window.wan6_connected_time_pollingTimer);}
				if (window.wifi_SSID_pollingTimer){clearTimeout(window.wifi_SSID_pollingTimer);}
				if (window.index_smsStoreStatus_pollingTimer){clearTimeout(window.index_smsStoreStatus_pollingTimer);}
				if (window.global_wanStatus_pollingTimer){clearTimeout(window.global_wanStatus_pollingTimer);}
				internet_plmnlist_get();
			}
		});
	

}

function internet_api_lanInfo_get() 
{
	var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetLanConfig",
			mask: 0,
			token: session_token
		},
		dataType: "json",
	});

	request.done(function( responseData,textStatus, jqXHR )
	{
		ui_config["lan"]["DHCP4S"]["start_ip"] = responseData.lan_dhcp_start;
		ui_config["lan"]["DHCP4S"]["end_ip"] = responseData.lan_dhcp_end;
		ui_config["lan"]["DHCP4S"]["enable"] = responseData.lan_dhcp;
		ui_config["lan"]["DHCP4S"]["lease"] = responseData.lease;
		ui_config["lan"]["LAN"]["ip4_addr"] = responseData.lan_gw_addrs;
		ui_config["lan"]["LAN"]["ip4_subnet_mask"] = responseData.lan_sub;
	});
}

function internet_api_plmnSet() {
	var plmnMode =  parseInt(comboSelectedValueGet('tf1_plmnMode'), 10);	
	var mcc;
	var mnc;
        var rat;
	internet_api_manualConnectDisconnect(0);
	internet_api_manualConnectDisconnect6(0);
	/*if(ui_config.Dyn_Status["wan_info"]["ip4"]["call_status"] == "connected") {	  
		alert(global_lang['alerts_set']['plmn_connected_error']);
		return;
  	}*/	

	if ( plmnMode == 0 ) {	
        mcc = 0;
		mnc = 0;
		rat = 0;
	} else {
		 var plmnOperator = parseInt(radioCheckedValueGet("tf1_plmnOperator0"),10);
		 if((parseInt(ui_config["plmnlist_info"]["entries"][plmnOperator]["plmn_status"]) & 0x10))
		 {
			alert(global_lang['alerts_set']['plmn_forbidden_error']); 
			return;	
		 }
		 mcc = ui_config["plmnlist_info"]["entries"][plmnOperator]["mcc"];
		 mnc = ui_config["plmnlist_info"]["entries"][plmnOperator]["mnc"];
		 rat = ui_config["plmnlist_info"]["entries"][plmnOperator]["access_technology"];
	}	
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetPlmn",
			mask: 0,
			mode : plmnMode,
			mcc : mcc,
			mnc : mnc ,
			rat : rat,
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
				alert(global_lang['alerts_set']['plmn_config_success']); 
			}
	});

}
function internet_doGetSimStatus()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "get_sim_status",
			token: session_token
		},
    	dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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

			if(responseData.do_result == "SUCCESS")
			{	
				ui_config["simpin_info"]["sim_status"] = 	responseData.status ;		
			}
	});	
}

function internet_doGetSimPinStatus()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "get_sim_pin_status",
			token: session_token
		},
    	dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
			if(responseData.do_result == "SUCCESS")
			{
				if((parseInt(responseData.pin_left) < parseInt(ui_config["simpin_info"]["pin_retry"])) && ui_config["simpin_info"]["pin_result"] == "5")
					ui_config["simpin_info"]["pin_result"] = "6" ;	
				
				ui_config["simpin_info"]["pin_status"] = responseData.pin_status;
				ui_config["simpin_info"]["pin_retry"] = responseData.pin_left;
				ui_config["simpin_info"]["puk_retry"] = responseData.puk_left;
				if(!ui_config["simpin_info"]["pin_result"])
					ui_config["simpin_info"]["pin_result"] = "0";
			}
	});
}

function internet_doUnlockPin(tmp_lockpin,tmp_lockpuk)
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{

			Page: "do_unlock_pin",
			lockpin:tmp_lockpin,
			lockpuk:tmp_lockpuk,
			token: session_token
		},
    	dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
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
			if (responseData.do_result == "SUCCESS") {
				if(tmp_lockpuk == "")	
					ui_config["simpin_info"]["pin_result"] = "5";
				else
					ui_config["simpin_info"]["pin_result"] = "7";
			} 
			else
			{
				if(tmp_lockpuk == "")	
					ui_config["simpin_info"]["pin_result"] = "6";
				else
					ui_config["simpin_info"]["pin_result"] = "8";

			}
			internet_onloadInternetsimcardPinlock();		
	});				
}

/* enable Sim Pin  Lock*/
function internetApi_simpin_enable() 
{
	if(ui_config["simpin_info"]["pin_status"] == "3")
	{
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "set_sim_pin",
				enable: "0",
				pin:$("#tf1_Pincode").val(),
				token: session_token
			},
			dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR )
		{
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
				if (responseData.do_result == "SUCCESS") {	
					ui_config["simpin_info"]["pin_result"] = "1";
				} 
				else
					ui_config["simpin_info"]["pin_result"] = "2";
				internet_onloadInternetsimcardPinlock();
		});	
	}
	else
	{
		internet_doUnlockPin($("#tf1_Pincode").val(),"");
	}
}

/* disable Sim Pin Lock*/
function internetApi_simpin_disable() {
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "set_sim_pin",
				enable: "0",
				pin:$("#tf1_Pincode").val(),
				token: session_token
			},
			dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR )
		{
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
				if (responseData.do_result == "SUCCESS") {	
					ui_config["simpin_info"]["pin_result"] = "3";
				} 
				else
					ui_config["simpin_info"]["pin_result"] = "4";
				internet_onloadInternetsimcardPinlock();
		});	
}

/* Change Sim Pin code*/
function internetApi_simpin_change() {

	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "change_sim_pin",
			oldPin:$("#tf1_currentPin").val(),
			newPin:$("#tf1_newPin").val(),
			token: session_token
		},
			dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR )
		{
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
				if (responseData.do_result == "SUCCESS") {	
					ui_config["simpin_info"]["pin_result"] = "9";
				} 
				else
					ui_config["simpin_info"]["pin_result"] = "10";
				internet_onloadInternetsimcardPinlock();
		});	;	
}


/* Unblock Sim */
function internetApi_simpin_unblock() {

	internet_doUnlockPin($("#tf1_newPin").val(),$("#tf1_PUKcode").val());
}




