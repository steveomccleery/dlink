/* Create Global configuration variables for all get Config */

ui_config = new Object();
ui_config.Dyn_Status = new Object();

ui_config.Dyn_Status["wan_status"] = new Object();
ui_config.Dyn_Status["wan_info"] = new Object();
ui_config.Dyn_Status["wan_info"]["ip4"] = new Object();
ui_config.Dyn_Status["wan_info"]["ip6"] = new Object();
ui_config.Dyn_Status["wifi_status"] = new Object();
ui_config["lan"]  = new Object();
ui_config["wifi_config"]  = new Object();
ui_config["wan_conn_config"]  = new Object();
ui_config["sms_config"]  = new Object();
ui_config["sms_inbox_info"]  = new Object();
ui_config["sms_inbox_info"]["sim"]  = new Object();
ui_config["sms_inbox_info"]["local"]  = new Object();
ui_config["sms_out_info"]  = new Object();
ui_config["sms_out_info"]["sim"]  = new Object();
ui_config["sms_out_info"]["local"]  = new Object()
ui_config["sms_drafts_info"]  = new Object();
ui_config["sms_drafts_info"]["sim"]  = new Object();
ui_config["sms_drafts_info"]["local"]  = new Object();
ui_config["apn_info"] = new Object();
ui_config["wan_connect_apn"] = new Object();
ui_config["lan"]["DHCP4S"] = new Object();
ui_config["lan"]["LAN"] = new Object();
ui_config["cust_system_apn"] = new Object();
ui_config["system_apn_list"] = new Array();
ui_config["manual_apn_info"] = new Object();
ui_config["connect_apn_info"] = new Object();
ui_config["web_language"] = new Object();
ui_config["system_time_config"] = new Object();
ui_config["simpin_info"] = new Object();
var apn_type = 0;
var tf1_userName;
var tf1_Password;
var tf1_apnAuth;
var manual_apn_index=0;
var global_count_req = 0;

ui_config.Dyn_Status["up_5s"] = new Object();
ui_config.Dyn_Status["about_sys"] = new Object();
ui_config.Dyn_Status["nw_usage"] = new Object();
ui_config.Dyn_Status["cp_conn_mode"] = new Object();
ui_config.Dyn_Status["up_5s"]["battery"] = new Object();
ui_config.Dyn_Status["up_5s"]["ipv4"] = new Object();
ui_config["wi-fi_clients"] = new Object();
ui_config["wpsstatus"] = new Object(); 
ui_config["wi-fi_status"] = new Object();
ui_config["sys_log"]  = new Object();
ui_config["ussd"]	= new Object();
ui_config["sntp"]   = new Object();
ui_config["sntp"]["SNTP"]   = new Object();
ui_config["fw_info"]  = new Object();	
ui_config["fw_info"]["state"] = new Object();
ui_config["account"]  = new Object(); 	 
ui_config["account"]["DEVICE"]  = new Object(); 	 
ui_config["plmn_info"] = new Object();
ui_config["simpin_info"] = new Object();
ui_config["powersaving"]  = new Object();
ui_config["powersaving"]["PWRMGR"] = new Object();
ui_config["date"]	= new Object();
ui_config["Upnp_status"] = new Object();
ui_config["Upnp_status"]["Upnp"] = new Object();
ui_config["firewall_info"] = new Object();
ui_config["modelinfo"] = new Object();
ui_config["modelinfo"]["SKU"] = new Object();
ui_config["sys_loglevel"] =new Object();
ui_config["net_stat"]  = new Object();
ui_config["net_stat"]["NWSTAT"]  = new Object();
ui_config["wi-fi_generate_pin-info"] = new Object();
ui_config["wi-fi_default_pin-info"] = new Object();
ui_config["web_info"] = new Object();
ui_config["wi-fi_wps_status"] = new Object();
ui_config["plmnlist_info"] = new Object();
ui_config["firewall_ipfilterinfo"] = new Object();
ui_config["firewall_ipfilterinfo_ex"] = new Object();
ui_config["firewall_portfwdinfo"] = new Object();
ui_config["firewall_portfwdinfo_ex"] = new Object();
ui_config["firewall_info"]["DMZ"] = new Object();
ui_config["firewall_info"]["firewall_status"] = new Object();
ui_config["firewall_info"]["WAN_ACCESS"] = new Object();
ui_config["firewall_info"]["URL_Filter"] = new Object();
ui_config.Dyn_Status["nw_usage"]["old_tx"] = 0;
ui_config.Dyn_Status["nw_usage"]["old_rx"] = 0;

var global_wanStatus_pollingTimer = null;
var global_wifiClient_pollingTimer = null;
var global_wan_pollingTimer = null;
var global_wan6_pollingTimer = null;
var wan_connected_time_pollingTimer = null;
var wan6_connected_time_pollingTimer = null;
var get_powersaving_pollingTimer=null;
var global_smslist_pollingTimer = null;

global_cploaded = false;
var global_plmnSearchTimeoutHandler = false;
var global_ussdsendTimeoutHandler = false;
var global_wifiPbcPinTimeoutHandler = false;
var global_firmwareUpgradeTimeoutHandler = false;
var global_stat_count = 0;
var global_contact_loop = 5; 

var global_internet_popup_content = "";
var global_wifi_popup_content = "";
var global_application_popup_content = "";
var global_system_popup_content = "";
var global_help_popup_content = "";
var global_setupWizard_popup_content = "";

/* SMS sent handler */
var global_smsTimeoutHandler = false;
var global_smsTimeout = 0;
var global_sms_storage = 0;
var global_sms_sendOk = 0;

var global_disconnect_service = null;
/* Control Panel */

var redirectTimeoutVar;

function controlPanel_default() {

}

function controlPanel_onloadPopupSystem() {
	showTabs();
}

function controlPanel_onloadPopupInternet() {
	showTabs();
}

function controlPanel_onloadPopupWifi() {
	showTabs();
}

function controlPanel_onloadPopupApplications() {
	showTabs();
	datatable('tf1_simContactsTbl');
}

function controlPanel_onloadPopupHelp() {
	showTabs();
}

function removeInvalidChar(text){
	var NOT_SAFE_IN_XML=/[\x01-\x1F\xEF\xFF]/gm;
	text = text.replace(NOT_SAFE_IN_XML,'');
	var length = text.length;
	for(var i=0 ;i < length ;i++)
	{
		if(text.charCodeAt(i) == 65535)
		{
			text = text.replace(text.substring(i,i+1),' ');
		}
	}
	return text;
}

function htmlEncode (str){
     var s = "";
	 str = str+"";
     if(str.length == 0) return "";
     s = str.replace(/</g,"&#x3c;");
	 s = s.replace(/\\/g,"&#x5c;");		 
     s = s.replace(/>/g,"&#x3e;");
     s = s.replace(/\'/g,"&#x27;");
     s = s.replace(/\"/g,"&#x22;");
     return s; 
}
 function HTMLDecode(text) { 
    var temp = document.createElement("div"); 
    temp.innerHTML = htmlEncode(text); 
    var output = temp.innerText || temp.textContent; 
    temp = null; 
    return output; 
}

var sms_store_flag = 0;
function index_getSMSStoreStatus()
{   
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetSMSStoreStatus",
			token: session_token
		},
		dataType: "json",
	});

		 request.done(function(msgs)
		{			
				if(msgs.result == "SUCCESS")
				{
					if(sms_store_flag != parseInt(msgs.store_status))
					{
						if(parseInt(msgs.store_status) == 1 && global_sms_storage == 0)
						{
							alert(global_lang['alerts_set']['sms_sim_full']);
						}
						else if(parseInt(msgs.store_status) == 2 &&  global_sms_storage == 1)
						{
							alert(global_lang['alerts_set']['sms_local_full']);
						}
						else if(parseInt(msgs.store_status) == 3)
						{
							alert(global_lang['alerts_set']['sms_sim_local_full']);
						}
					}
					sms_store_flag = parseInt(msgs.store_status);
				}	
			if (window.index_smsStoreStatus_pollingTimer){clearTimeout(window.index_smsStoreStatus_pollingTimer);}
			window.index_smsStoreStatus_pollingTimer = setTimeout(index_getSMSStoreStatus, 3000);
		});
		request.fail(function(msgs)
		{
			if (window.index_smsStoreStatus_pollingTimer){clearTimeout(window.index_smsStoreStatus_pollingTimer);}
			window.index_smsStoreStatus_pollingTimer = setTimeout(index_getSMSStoreStatus, 3000);
		});
}

function system_firmwareupgrade_get() {
 					
	var request = $.ajax({
		type:"POST",
	    url: "cgi-bin/qcmap_web_cgi",       
		data:
		{
			Page: "GetSystemAbout",
			mask: 0,
			token: session_token,
		},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
    		ui_config["fw_info"]["curr_ver"] = responseData.system_version;
			ui_config["fw_info"]["state"]["mode"] = "1";
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function getLanguage()
{
	var request= $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_auth",
		data:
		{
			type: "get_language",
			mask: "0"
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{				
		if(responseData.result == "SUCCESS")
		{
			ui_config["web_language"] = responseData;
			if (responseData.web_language == "0") {
				var request = $.ajax({
				url: "/lang/lang-en.json",       
				dataType: "json"
				});
				request.done(function( responseData,textStatus, jqXHR ) {  
				global_lang = responseData;
				});
				request.fail(function( jqXHR, textStatus, errorThrown) {	
				});
				request.always(function(responseData,textStatus, jqXHR ) {       
				});
			}		
			else if (responseData.web_language == "1") {
				var request = $.ajax({
				url: "/lang/lang-hu.json",       
				dataType: "json"
				});
				request.done(function( responseData,textStatus, jqXHR ) {  
				global_lang = responseData;
				});
				request.fail(function( jqXHR, textStatus, errorThrown) {	
				});
				request.always(function(responseData,textStatus, jqXHR ) {       
				});
			}										
		}
	});
	request.fail(function(xhr, textStatus, errorThrown){
		dialogAlert(global_lang["login1"]["error"]);
	});
}

function closeDiv(event, divId) {
	if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}
	$("#" + divId).hide();
}

function openDiv(event, divId) {

	if (event.preventDefault){
    	/* Firefox, Chrome */
    	event.preventDefault();
	} else {
		/* Internet Explorer */
		event.returnValue = false;
	}
	$("#" + divId).fadeIn(300);
}
function getNetworkStr(status) {
    var wan_network_list = {
        "TD-LTE":"4G",
        "LTE FDD":"4G",
		"LTE":"4G",
		"HSPA":"H",
		"HSPA+":"H+",
        "TD-SCDMA":"3G",
        "TDSCDMA":"3G",
        "WCDMA":"3G",
        "UMTS":"3G",
        "Edge":"E",
        "GSM":"2G",
        "CDMA-1X":"G",
        "CDMA-1XEVDO":"3G"		
    };

    if (status in wan_network_list) {
        return wan_network_list[status];
    }
	else
		return "";
}

function secondsToTime(seconds){
 
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;

	if ( numdays > 0) {

		return numdays + "d " + numhours + ":" + numminutes + ":" + numseconds;

	} else {

	     return numhours + ":" + numminutes + ":" + numseconds;

	}

}

function getLockPinPrompt()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWanStatus",
			mask: "2",
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR ) 
	{
		ui_config.Dyn_Status["wan_status"] = responseData;
			if(responseData.entries.length == 0)
			{
				ui_config.Dyn_Status["wan_status"]["entries"] = [{"signal_type":"","signal_strength":"0"}];				
			}
			if(responseData.sim_status == 1)
			{
				ui_config.Dyn_Status["wan_status"]["operators_information"] = "";				
			}
		if(responseData.sim_status == 2)
		{
			dialogAlert(global_lang["cpsection"]["link_pin_lock"],"Information","info");				
		}
		if(responseData.sim_status == 3)
		{
			dialogAlert(global_lang["cpsection"]["link_puk_lock"],"Information","info");				
		}
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
	});
}

function getWanStatus()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWanStatus",
			mask: "2",
			token: session_token
		},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR ) 
	{
			ui_config.Dyn_Status["wan_status"] = responseData;
			if(responseData.entries.length == 0)
			{
				ui_config.Dyn_Status["wan_status"]["entries"] = [{"signal_type":"","signal_strength":"0"}];				
			}
			if(responseData.sim_status == 1)
			{
				ui_config.Dyn_Status["wan_status"]["operators_information"] = "";				
			}	
			if(ui_config.Dyn_Status["wan_status"]["operators_information"] == "460 11")	
			{
				ui_config.Dyn_Status["wan_status"]["operators_information"] = "China Telecom";
			}				
			global_disconnect_service =getNetworkStr(ui_config.Dyn_Status["wan_status"]["entries"][0]["signal_type"]);
			cp_internetInfo_template();
			if (window.global_wanStatus_pollingTimer){clearTimeout(window.global_wanStatus_pollingTimer);}
			window.global_wanStatus_pollingTimer = setTimeout(getWanStatus, 3000);
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
			if (window.global_wanStatus_pollingTimer){clearTimeout(window.global_wanStatus_pollingTimer);}
			window.global_wanStatus_pollingTimer = setTimeout(getWanStatus, 3000); 
    });
}

/* controlpanel_internet info Template Function */
function cp_internetInfo_template(){
	if(ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"] == null )
		ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"] = 0;	
	if(ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"]==null)
		ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"] = 0;
	total = (parseInt(ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"]) + parseInt(ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"]))/1048576;
	max_data = "";

    if(total < 1){
        total = total * 1024;
        unit  = " KB";
    }
    else{
        total = total;
        unit =" MB";
    }    
   
    //total = parseInt(total,10);
    total = total.toFixed(2) + unit;
	
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
	
    var tmpl_internet_data = {      
                               "operator_name":operators_information,
							   "signal_level":ui_config.Dyn_Status["wan_status"]["entries"][0]["signal_strength"],
							   "network_type":global_disconnect_service || ui_config.Dyn_Status["wan_status"]["entries"][0]["signal_type"],
                               "total_mb":total,
							   "packetdata_maxlimit":max_data
                            };

    var pagefn = doT.template(document.getElementById('cp_internetTemplate').text);
    $("#tf1_tmpl_cpinternetinfo").html(pagefn(tmpl_internet_data));

}

function getWiFiClients()
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
		//cp_wifi_template();
		if (window.global_wifiClient_pollingTimer){clearTimeout(window.global_wifiClient_pollingTimer);}
		window.global_wifiClient_pollingTimer = setTimeout(getWiFiClients, 3000);
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
		ui_config.Dyn_Status["wifi_status"]="0";
		if (window.global_wifiClient_pollingTimer){clearTimeout(window.global_wifiClient_pollingTimer);}
		window.global_wifiClient_pollingTimer = setTimeout(getWiFiClients, 3000);
    });
}

/* controlpanel_wifi info Template Function */
/*function cp_wifi_template(){
    var tmpl_wifi_data = {      
                                "Clientlist":ui_config.Dyn_Status["wifi_status"]["list_count"],
								"wifi_signal_level":ui_config.Dyn_Status["wifi_status"]["enable"]
                          };
    var pagefn = doT.template(document.getElementById('cp_wifiTemplate').text);
    $("#tf1_tmpl_cpwifiinfo").html(pagefn(tmpl_wifi_data));

}*/

function getWWANSTATS(ip_family)
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWWANSTATS",
			resetwwwanstats: 0,
			family : ip_family,
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
				global_count_req ++;
				if(global_count_req > 10)
				{
					alert(global_lang['alerts_set']['Other browsers open'] + " 192.168.0.1");
				}
				return;
			}
			if(ip_family == 4)
			{
				global_count_req = 0;
				ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"] = responseData.Bytes_Rx;
				ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"] = responseData.Bytes_Tx;
				ui_config.Dyn_Status["wan_info"]["ip4"]["ip"] = responseData.Public_IP.split(".").reverse().join(".");
				ui_config.Dyn_Status["wan_info"]["ip4"]["primary_dns"] = responseData.Primary_DNS.split(".").reverse().join(".");
				ui_config.Dyn_Status["wan_info"]["ip4"]["secondary_dns"] = responseData.Secondary_DNS.split(".").reverse().join(".");
				ui_config.Dyn_Status["wan_info"]["ip4"]["call_status"] = responseData.backhaul;
				if (window.global_wan_pollingTimer){clearTimeout(window.global_wan_pollingTimer);}
				window.global_wan_pollingTimer = setTimeout("getWWANSTATS("+ip_family+")", 3000);
			}
			else if(ip_family == 6)
			{
				global_count_req = 0;
				ui_config.Dyn_Status["wan_info"]["ip6"]["Bytes_Rx"] = responseData.Bytes_Rx;
				ui_config.Dyn_Status["wan_info"]["ip6"]["Bytes_Tx"] = responseData.Bytes_Tx;
				ui_config.Dyn_Status["wan_info"]["ip6"]["ip"] = responseData.Public_IP.split(".").reverse().join(".");
				ui_config.Dyn_Status["wan_info"]["ip6"]["primary_dns"] = responseData.Primary_DNS.split(".").reverse().join(".");
				ui_config.Dyn_Status["wan_info"]["ip6"]["secondary_dns"] = responseData.Secondary_DNS.split(".").reverse().join(".");
				ui_config.Dyn_Status["wan_info"]["ip6"]["call_status"] = responseData.backhaul;
				if (window.global_wan6_pollingTimer){clearTimeout(window.global_wan6_pollingTimer);}
				window.global_wan6_pollingTimer = setTimeout("getWWANSTATS("+ip_family+")", 3000);
			}

			ui_config["net_stat"]["NWSTAT"]["quota_limit"] = "1500";
			ui_config.Dyn_Status["nw_usage"]["rx"] = ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"];
			ui_config.Dyn_Status["nw_usage"]["tx"] = ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"];
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
			if(ip_family == 4)
			{	
				if (window.global_wan_pollingTimer){clearTimeout(window.global_wan_pollingTimer);}
				window.global_wan_pollingTimer = setTimeout("getWWANSTATS("+ip_family+")", 3000);
			}
			else if(ip_family == 6)
			{	
				if (window.global_wan6_pollingTimer){clearTimeout(window.global_wan6_pollingTimer);}
				window.global_wan6_pollingTimer = setTimeout("getWWANSTATS("+ip_family+")", 3000);
			}
    });
}

function doGetWanConnectedTime()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWanConnectedTime",
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
				ui_config.Dyn_Status["wan_info"]["ip4"]["conn_time"] = responseData.connected_time;
			}
			cp_connectionMode_template();
			cp_toggleConnection();
			if (window.wan_connected_time_pollingTimer){clearTimeout(window.wan_connected_time_pollingTimer);}
			window.wan_connected_time_pollingTimer = setTimeout(doGetWanConnectedTime, 3000)
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {	
			if (window.wan_connected_time_pollingTimer){clearTimeout(window.wan_connected_time_pollingTimer);}
			window.wan_connected_time_pollingTimer = setTimeout(doGetWanConnectedTime, 3000)
    });	
}

function doGetWan6ConnectedTime()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWan6ConnectedTime",
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
				ui_config.Dyn_Status["wan_info"]["ip6"]["conn_time"] = responseData.connected_time;
			}
			if (window.wan6_connected_time_pollingTimer){clearTimeout(window.wan6_connected_time_pollingTimer);}
			window.wan6_connected_time_pollingTimer = setTimeout(doGetWan6ConnectedTime, 3000);
	});	
    request.fail(function( jqXHR, textStatus, errorThrown) {	
			if (window.wan6_connected_time_pollingTimer){clearTimeout(window.wan6_connected_time_pollingTimer);}
			window.wan6_connected_time_pollingTimer = setTimeout(doGetWan6ConnectedTime, 3000);
    });
}

function getLANSettings()
{
	var request = $.ajax(
	{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "GetLanConfig",
				mask: "0",
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
			if(responseData.lan_config_result == "SUCCESS")
			{
				ui_config["lan"]["ip"] = responseData.lan_gw_addrs;
				ui_config["lan"]["lan_mask"] = responseData.lan_sub;
				ui_config["lan"]["lan_dhcp"] = responseData.lan_dhcp;
				ui_config["lan"]["lan_dhcp_start"] = responseData.lan_dhcp_start;
				ui_config["lan"]["lan_dhcp_end"] = responseData.lan_dhcp_end;
				ui_config["lan"]["lan_dhcp_lease"] = responseData.lan_dhcp_lease;
			}
	});
}

function doGetWiFiConfig()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWLANConfig",
			mask: "0",
			token: session_token
		},
		dataType: "text"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
			obj = jQuery.parseJSON(responseData);
			if(obj.result == "AUTH_FAIL")
			{
				window.location = "login.html";
				return;
			}
			if(obj.result == "Token_mismatch")
			{
				window.location = "login.html";
				return;
			}
			if(obj.result == "SUCCESS")
			{
				ui_config["wifi_config"] = obj;
			}
			if (window.wifi_SSID_pollingTimer){clearTimeout(window.wifi_SSID_pollingTimer);}
			window.wifi_SSID_pollingTimer = setTimeout(doGetWiFiConfig, 3000);
			cp_mainInfo_template();
			
	});
}

function cp_mainInfo_template(){  
	var ssid = HTMLDecode(ui_config["wifi_config"]["ssid"]).replace(/</g,"&lt;");
    var tmpl_main_data = {      
                               "SSIDname":ssid,
                               "ip_addr":ui_config["lan"]["ip"]
                         };
  
    var pagefn = doT.template(document.getElementById('cp_mainTemplate').text);
    $("#tf1_tmpl_cpmaininfo").html(pagefn(tmpl_main_data));

}

function getConnectMode()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetMobileAP",
			mask: 0,
			autoconnect:"",
			autoconnect_result: "0",
			roaming: "",
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
			if(responseData.autoconnect_result == "SUCCESS")
			{
				ui_config["wan_conn_config"]["autoconnect"] = responseData.autoconnect;
			}
			if(responseData.roaming_result == "SUCCESS" )
			{
				ui_config["wan_conn_config"]["roaming"] = responseData.roaming;
			}
	});
}
function cp_up_5s() {

	var request = $.ajax({
		type: "POST",
        url: "cgi-bin/qcmap_web_cgi",        
		data:
		{
			Page: "GetSystemUpTime",
			mask: 0,
			token: session_token
		},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {              
         ui_config.Dyn_Status["up_5s"]["system_uptime"] = responseData.system_uptime; 
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

	var request = $.ajax({
		type: "POST",
        url: "cgi-bin/qcmap_web_cgi",        
		data:
		{
			//Page: "GetBatteryInfo",
			Page: "get_charge_capacity",
			mask: 0,
			token: session_token
		},
        dataType: "json",
    });
    request.done(function( responseData,textStatus, jqXHR ) {              
         ui_config.Dyn_Status["up_5s"]["battery"]["capacity"] = responseData.capacity; 
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });


}

function cp_about_sys() {

	var request = $.ajax({
		type: "POST",
        url: "cgi-bin/qcmap_web_cgi",        
		data:
		{
			Page: "GetSystemAbout",
			mask: 0,
			token: session_token
		},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {              
         ui_config.Dyn_Status["about_sys"]["imei"] = responseData.system_IMEI;
         ui_config.Dyn_Status["about_sys"]["hw_ver"] = responseData.baseband_version;
//		 ui_config.Dyn_Status["about_sys"]["modem_ver"] = "BM123456";
         ui_config.Dyn_Status["about_sys"]["imsi"] = responseData.system_IMSI;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });


}
function system_accountinfo_get() {
 					
	var request = $.ajax({
		type: "POST",
	    url: "cgi-bin/qcmap_auth",       
		data:
		{
			type: "load",
		},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
			ui_config["account"]["DEVICE"]["web_usrname"] = "admin";
			ui_config["account"]["DEVICE"]["web_passwd"] = "";
			ui_config["account"]["DEVICE"]["login_timeout"] = parseInt(responseData.timeout);
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function system_sntp_get() {
 					
	var request = $.ajax({
		type: "POST",
	    url: "cgi-bin/qcmap_web_cgi",       
		data: { Page: "GetNtpClient",mask: 0, token: session_token},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
    		ui_config.Dyn_Status["up_5s"]["system_date"] = responseData.currentTime;
			ui_config["sntp"]["SNTP"]["enable"] = responseData.ntp_enable;
			ui_config["sntp"]["SNTP"]["server1"] = responseData.NTPServer1;
			ui_config["sntp"]["SNTP"]["server2"] = responseData.NTPServer2;
			ui_config["sntp"]["SNTP"]["server3"] = responseData.NTPServer3;
			ui_config["sntp"]["SNTP"]["timezone"] = responseData.timeZone;
			ui_config["sntp"]["SNTP"]["update_period"] = responseData.ntp_syncInterval;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
 }
  

function cp_connectionType(imgId) {

	if ($("#tf1_cpConnect").attr("class") == "enable-disable-off") {
		return;
	}
	$(".connectionTypeActive").attr("class", "connectionType");
	var thisObj = "#" + imgId;
	$(thisObj).attr("class", "connectionTypeActive");

	if (imgId == "tf1_cpAlwaysConnect" || imgId == "tf1_cpDemandConnect" || imgId == "tf1_cpManualConnect" || imgId == "tf1_cpConnectDissconnect") {
		if ($(thisObj).attr("class") == "connectionTypeActive" && imgId != "tf1_cpConnectDissconnect") {
			$("#tf1_cpAlwaysConnect").attr("class", "connectionType");
			$("#tf1_cpDemandConnect").attr("class", "connectionType");
			$("#tf1_cpManualConnect").attr("class", "connectionType");
			$(thisObj).attr("class", "connectionTypeActive");
		}

		if (imgId == "tf1_cpManualConnect" && $(thisObj).attr("class") == "connectionType") {
			$("#tf1_cpConnectDissconnect").hide();
			$("#tf1_cpConDis").css("color", "#BFBFBF");
		}

		if (imgId == "tf1_cpManualConnect" && $(thisObj).attr("class") == "connectionTypeActive") {
			$("#tf1_cpConnectDissconnect").show();
			$("#tf1_cpConDis").css("color", "#0071C7");
		}

		if (imgId != "tf1_cpConnectDissconnect" && imgId != "tf1_cpManualConnect" && $(thisObj).attr("class") == "connectionTypeActive") {

			$("#tf1_cpConnectDissconnect").hide();
			$("#tf1_cpConDis").css("color", "#BFBFBF");
		}
	}	
	cp_api_cnmodeConfig(imgId);
	
}

function system_netstat_get2() {
              
    var request = $.ajax({
		type: "POST",
	    url: "cgi-bin/qcmap_web_cgi",       
		data: 
		{
			Page: "GetDATASTATS", 
			mask: 0, 
			token: session_token
		},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
			ui_config["net_stat"]["NWSTAT"]["quota_limit"] = "1500";
			ui_config.Dyn_Status["nw_usage"]["rx"] = ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Rx"];
			ui_config.Dyn_Status["nw_usage"]["tx"] = ui_config.Dyn_Status["wan_info"]["ip4"]["Bytes_Tx"];
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {    
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function system_Upnp_get(){
	
	var request = $.ajax({
		type: "POST",
	    url:"cgi-bin/qcmap_web_cgi",        
		data: {Page:"GetMediaSharingStatus", mask: 7, token: session_token},
        dataType: "json"       
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
    	  //alert(JSON.stringify(responseData));
			ui_config["Upnp_status"]["Upnp"]["enable"] = responseData.upnp_enable;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

}

function cp_api_cnmodeConfig(imgId) {
	var autoConnect = 1;
	if (imgId == "tf1_cpManualConnect") {
		autoConnect = 0; /*manual */
	}	
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetMobileAP",
			mask: 2,
			autoconnect:autoConnect,
			autoconnect_result: "0",
			roaming: "",
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
			if(responseData.autoconnect_result == "SUCCESS")
			{
				ui_config["wan_conn_config"]["autoconnect"] = autoConnect;	
				cp_connectionMode_template();
				cp_toggleConnection();			
			}
	});

}

function wifi_default_wpspinget() {
	$("#tf1_enterPin").val("12345670");
}



function cp_enableDisableConnectionOnLoad(toggleObj, thisObj) {
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	switch (imgId) {
		case 'tf1_cpConnect':			
			if ( $("#tf1_cpConnect").attr("class") == "enable-disable-on") {
				$("#tf1_cp_connStr").html("Connecting...");	
				internet_api_manualConnectDisconnect(1);
				internet_api_manualConnectDisconnect6(1);
			} else if ($("#tf1_cpConnect").attr("class") == "enable-disable-off" ) {
				$("#tf1_cp_connStr").html("DisConnecting...");
				internet_api_manualConnectDisconnect(0);
				internet_api_manualConnectDisconnect6(0);
			}
			getWanStatus();
			getConnectMode();
			doGetWanConnectedTime();
			break;			
		 case 'tf1_cpConnectDissconnect':			
			if ( $("#tf1_cpConnectDissconnect").attr("class") == "enable-disable-on") {
				internet_api_manualConnectDisconnect(1);
				internet_api_manualConnectDisconnect6(1);
				$("#tf1_cp_connStr").html("Connecting...");
				$("#tf1_cpConnect").attr("class","enable-disable-on-noclick");				
			} else if ($("#tf1_cpConnectDissconnect").attr("class") == "enable-disable-off" ) {
				internet_api_manualConnectDisconnect(0);
				internet_api_manualConnectDisconnect6(0);
				$("tf1_cp_connStr").html("DisConnecting...");
				$("#tf1_cpConnect").attr("class","enable-disable-on-noclick");
			}
			getWanStatus();
			getConnectMode();
			doGetWanConnectedTime();
			break;
	}
}

function cp_toggleConnection() {

	if ($("#tf1_cpConnect").attr("class") == "enable-disable-on") {
		$("#tf1_cpTime").show();
		$("#tf1_displayTime").show();
		$("#tf1_cpConAlways").css("color", "#40464B");
		$("#tf1_cpConOnDemand").css("color", "#40464B");
		$("#tf1_cpConManual").css("color", "#40464B");
		
		
	    if (ui_config["wan_conn_config"]["autoconnect"] == "1" ) {		
		
			$("#tf1_cpAlwaysConnect").attr("class", "connectionTypeActive");		
			$("#tf1_cpManualConnect").attr("class", "connectionType");
		
		} else  {			
			$("#tf1_cpAlwaysConnect").attr("class", "connectionType");		
			$("#tf1_cpManualConnect").attr("class", "connectionTypeActive");		
		}
		
		
		
		$("#tf1_cpAlwaysConnect").removeAttr("disabled");		
		$("#tf1_cpManualConnect").removeAttr("disabled");
		$("#tf1_cpAlwaysConnect").css("cursor", "pointer");
		$("#tf1_cpManualConnect").css("cursor", "pointer");

	} else {
		$("#tf1_cpTime").hide();
		$("#tf1_displayTime").hide();
		$("#tf1_cpConAlways").css("color", "#BFBFBF");
		$("#tf1_cpConOnDemand").css("color", "#BFBFBF");
		$("#tf1_cpConManual").css("color", "#BFBFBF");
		$("#tf1_cpConDis").css("color", "#BFBFBF");
		$("#tf1_cpConnectDissconnect").hide();
		$("#tf1_cpAlwaysConnect").attr("class", "connectionType2");		 
		$("#tf1_cpManualConnect").attr("class", "connectionType2");

		$("#tf1_cpAlwaysConnect").attr("disabled", "disabled");	 
		$("#tf1_cpManualConnect").attr("disabled", "disabled");

		$("#tf1_cpAlwaysConnect").css("cursor", "default");	 
		$("#tf1_cpManualConnect").css("cursor", "default");

	}

}

function cp_connectionMode_template(){
	
 	connectiontime = ui_config.Dyn_Status["wan_info"]["ip4"]["conn_time"];
    var tmpl_connection_data = {
								"ipv4connection_status":ui_config.Dyn_Status["wan_info"]["ip4"]["call_status"],
                                "autoconnection":ui_config["wan_conn_config"]["autoconnect"],
								"connectiontime":connectiontime
								};
    var pagefn = doT.template(document.getElementById('cp_connectionModeTemplate').text);
	$("#tf1_tmpl_cp_connectionMode").html(pagefn(tmpl_connection_data));

}

/* To get the model Name */
function system_config_get(){
	var request = $.ajax({
		type:"POST",
	    url:"cgi-bin/qcmap_web_cgi",        
		data:
		{
			Page: "GetSystemAbout",
			mask:0,
			token: session_token,
		},
		dataType: "json"
       
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
			//var obj = jQuery.parseJSON(responseData);
    		//ui_config["modelinfo"]["SKU"]["model_name"] = obj.system_name;
    		ui_config["modelinfo"]["SKU"]["model_name"] = responseData.system_name;
    		   		
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

}

function smsRead(sms_storage,box_flag)
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "sms_read",
			storage: sms_storage,
			box_flag:box_flag,
			token: session_token
		},
		dataType: "text"
	});
	request.done(function( responseData,textStatus, jqXHR )
	{
			var obj = removeInvalidChar(responseData);
			obj = jQuery.parseJSON(obj);
			if(obj.result == "AUTH_FAIL")
			{
				window.location = "login.html";
				return;
			}
			if(obj.result == "Token_mismatch")
			{
				window.location = "login.html";
				return;
			}
			if(sms_storage==1 && box_flag == 0)	
				ui_config["sms_inbox_info"]["local"] = obj;
			if(sms_storage==1 && box_flag == 1)	
				ui_config["sms_out_info"]["local"] = obj;
			if(sms_storage==1 && box_flag == 2)	
				ui_config["sms_drafts_info"]["local"] = obj;
			if(sms_storage==0 && box_flag == 0)	
				ui_config["sms_inbox_info"]["sim"] = obj;
			if(sms_storage==0 && box_flag == 1)	
				ui_config["sms_out_info"]["sim"] = obj;
			if(sms_storage==0 && box_flag == 2)	
				ui_config["sms_drafts_info"]["sim"] = obj
	});	
}

function cp_messages_template(){
	 //application_unreadInbox_get();
	smsRead(0,0);
	smsRead(1,0);
	smsRead(0,2);
	smsRead(1,2);
	var inbox_total = 0;
	var drafts_total = 0;
	if(global_sms_storage)
	{
		inbox_total = parseInt(ui_config["sms_inbox_info"]["local"]["count"]);
		drafts_total = parseInt(ui_config["sms_drafts_info"]["local"]["count"]);
	}
	else
	{
		inbox_total = parseInt(ui_config["sms_inbox_info"]["sim"]["count"]);
		drafts_total = 	parseInt(ui_config["sms_drafts_info"]["sim"]["count"]);
	}
    var tmpl_messages_data = {      
                                "inbox_tot":inbox_total,
                                "drafts_tot":drafts_total
                            };
	if (window.global_smslist_pollingTimer){clearTimeout(window.global_smslist_pollingTimer);}
	window.global_smslist_pollingTimer = setTimeout(cp_messages_template, 3000);	
    var pagefn = doT.template(document.getElementById('cp_messagesTemplate').text);
    $("#tf1_tmpl_cpmessages").html(pagefn(tmpl_messages_data));

}

function internet_onloadInternetApnConfig_1() {
	GetProfileList();
	doGetConnectProfile();
	doGetSystemAPN();
	find_system_apn_info();
	find_connect_apn_info();
	get_apn_type();
	internet_apnget_template_1();
	internet_apnModeSelect_1();
	onloadCall();
}

function internet_apnget_template_1(){ 
	var tmpl_fwinfo_data_1 = new Object();
	tmpl_fwinfo_data_1["connect_apn"] = ui_config["connect_apn_info"];
	tmpl_fwinfo_data_1["list"]=ui_config["system_apn_list"];
	tmpl_fwinfo_data_1["apn_type"] = apn_type;
   var pagefn = doT.template(document.getElementById('cp_apninfoTemplate').text);
   $("#tf1_tmpl_apninfo").html(pagefn(tmpl_fwinfo_data_1));

}

function internet_apnModeSelect_1() {
	//var apnSelectMode = comboSelectedValueGet('tf1_apnMode_1');
	//console.log(apn_type);
	switch(apn_type) {
		case 0 :
			$("#tf1_apn_div_1").hide();
			$("#tf1_networkType_div_1").show();
			internet_AutoApnChange_1();
			break;
		case 1:
			$("#tf1_networkType_div_1").hide();
			$("#tf1_apn_div_1").show();
			internet_ManualApnChange_1();
			//var selectedId = document.getElementById("tf1_apnAuth_1").selectedIndex;
			//if (selectedId == -1) {
			//	$("#tf1_apnAuth_1").val(0);
			//}
	}
}


function internet_AutoApnChange_1() {
	var selectedId = document.getElementById("tf1_networkType_1").selectedIndex;
	if ( selectedId == -1) {
	selectedId = 0; 
	selectedIndex = "";
	}else{
		var selectedIndex = document.getElementById("tf1_networkType_1").options[selectedId].value || "";
	for (var i = 0 ; i < ui_config["apn_info"]["list_count"] ;i++)
	{
		if(selectedIndex  == ui_config["apn_info"]["entries"][i]["profile_index"])
		{
			$("#tf1_apn_1").val(ui_config["apn_info"]["entries"][i]["apn"]);
			tf1_userName = ui_config["apn_info"]["entries"][i]["user"];
			tf1_Password = ui_config["apn_info"]["entries"][i]["password"];
		}
	}	
	}
	
}

function internet_ManualApnChange_1() {
	for (var i = 0 ; i < ui_config["apn_info"]["list_count"] ;i++)
	{
		if(manual_apn_index  == ui_config["apn_info"]["entries"][i]["profile_index"])
		{
			$("#tf1_apn_1").val(ui_config["apn_info"]["entries"][i]["apn"]);
			tf1_userName = ui_config["apn_info"]["entries"][i]["user"];
			tf1_Password = ui_config["apn_info"]["entries"][i]["password"];
			tf1_apnAuth = ui_config["apn_info"]["entries"][i]["auth_type"];
		}
	}	
}

function internet_ApnConfigValidate_1(frmId) {
	var txtFieldIdArr = new Array();
	txtFieldIdArr[0] = "tf1_apn,"+global_lang['validation_msgs']['pls_enter_valid_APN'];	
	if (txtFieldArrayCheck(txtFieldIdArr) == false)
		return false;
	internet_api_ApnConfig_1();	
	//internet_api_manualConnectDisconnect(0);
}


function internet_api_ApnConfig_1() {	
	//var type = $("#tf1_apnMode_1").val();
	if (apn_type == 0) {
		var selectedId = document.getElementById("tf1_networkType_1").selectedIndex;
		if ( selectedId == -1) {
			var selectedIndex = 0; 
		}
		else
			var selectedIndex = document.getElementById("tf1_networkType_1").options[selectedId].value;
		
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
				apn: $("#tf1_apn_1").val(),
				username: tf1_userName,
				password: tf1_Password,
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
		var Manual_apn = $("#tf1_apn_1").val();
		if(ui_config["connect_apn_info"]["apn"] != Manual_apn){
			tf1_userName = "";
			tf1_Password = "";
		}
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
				apn: Manual_apn,
				username: tf1_userName,
				password: tf1_Password,
				auth_preference: tf1_apnAuth,
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

function GetProfileList()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetGppProfileList",
			mask: "0",
			type: "0",
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
				ui_config["apn_info"] = responseData;		
			}
	});
}

function doGetConnectProfile()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
				Page: "GetWanProfileId",
				mask: "0",
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
				ui_config["wan_connect_apn"] =  responseData;	
			}
	});
}

function doGetSystemAPN()
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
				Page: "cust_get_apn_info",
				mask: "0",
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
				ui_config["cust_system_apn"] =  responseData;	
			}
	});
}

function find_system_apn_info()
{
	ui_config["system_apn_list"]=[];
	if(parseInt(ui_config["cust_system_apn"]["list_count"]) == 0 && parseInt(ui_config["wan_connect_apn"]["umts_v4_index"]) ==1 )
	{
		for(var i =0 ; i < parseInt(ui_config["apn_info"]["list_count"]);i++)
		{
			if(ui_config["wan_connect_apn"]["umts_v4_index"] == ui_config["apn_info"]["entries"][i]["profile_index"])
			{
				ui_config["system_apn_list"].push(ui_config["apn_info"]["entries"][i]);
			}			
		}
		return ;
	}
	for(var i =0 ;i < parseInt(ui_config["cust_system_apn"]["list_count"]); i ++)
	{
		for(var j =0 ; j < parseInt(ui_config["apn_info"]["list_count"]);j++)
		{
			if(ui_config["cust_system_apn"]["entries"][i]["profile_type"] == ui_config["apn_info"]["entries"][j]["profile_type"]
				&&  ui_config["cust_system_apn"]["entries"][i]["profile_index"] == ui_config["apn_info"]["entries"][j]["profile_index"])
			{
				if(parseInt(ui_config["cust_system_apn"]["entries"][i]["profile_index"]) == 1)
				{
					ui_config["apn_info"]["entries"][j]["apn"] = ui_config["cust_system_apn"]["entries"][i]["apn"];
					ui_config["apn_info"]["entries"][j]["user"] = ui_config["cust_system_apn"]["entries"][i]["user"];
					ui_config["apn_info"]["entries"][j]["password"] = ui_config["cust_system_apn"]["entries"][i]["password"];			
				}				
				ui_config["system_apn_list"].push(ui_config["apn_info"]["entries"][j]);
			}			
		}
	}
}

function find_connect_apn_info()
{
	for(var j =0 ; j < parseInt(ui_config["apn_info"]["list_count"]);j++)
	{
		if(ui_config["apn_info"]["entries"][j]["profile_index"] == ui_config["wan_connect_apn"]["umts_v4_index"])
		{
			ui_config["connect_apn_info"]["profile_index"] = ui_config["apn_info"]["entries"][j]["profile_index"];
			ui_config["connect_apn_info"]["profile_type"] = ui_config["apn_info"]["entries"][j]["profile_type"];
			ui_config["connect_apn_info"]["profile_name"] = ui_config["apn_info"]["entries"][j]["profile_name"];
			ui_config["connect_apn_info"]["apn"] = ui_config["apn_info"]["entries"][j]["apn"];
			ui_config["connect_apn_info"]["user"] = ui_config["apn_info"]["entries"][j]["user"];
			ui_config["connect_apn_info"]["password"] = ui_config["apn_info"]["entries"][j]["password"];
			ui_config["connect_apn_info"]["auth_type"] = ui_config["apn_info"]["entries"][j]["auth_type"];
		}			
	}
}

function get_apn_type()
{
	if(parseInt(ui_config["wan_connect_apn"]["umts_v4_index"]) ==1 )
	{
			apn_type = 0;
			manual_apn_index = 0;
			return;	
	}
		
	for(var i =0 ;i < parseInt(ui_config["cust_system_apn"]["list_count"]); i ++)
	{
		if( ui_config["wan_connect_apn"]["umts_v4_index"] == ui_config["cust_system_apn"]["entries"][i]["profile_index"])
		{
			apn_type = 0;
			manual_apn_index = 0;			
			return;	
		}
	}
	apn_type = 1;
	manual_apn_index = parseInt(ui_config["wan_connect_apn"]["umts_v4_index"]);
	return;
}

function decode_passwd_wizard(passtext)
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
function cp_wizard_template(){

    var tmpl_wizard_data = new Object();
	tmpl_wizard_data["apn_info"] = new Object();
	tmpl_wizard_data["apn_info"]["connect_apn"] = ui_config["connect_apn_info"];
	tmpl_wizard_data["apn_info"]["list"]=ui_config["system_apn_list"];
	tmpl_wizard_data["apn_info"]["apn_type"] = apn_type;
	tmpl_wizard_data["roaming"] = ui_config["wan_conn_config"]["roaming"];

	tmpl_wizard_data["wifi_info"] = new Object();
	tmpl_wizard_data["wifi_info"] = ui_config["wifi_config"];
	tmpl_wizard_data.passphrase = "";
	tmpl_wizard_data.wepKeyIndex = "";
	tmpl_wizard_data["time_config"] = new Object();
	tmpl_wizard_data["time_config"] = ui_config["system_time_config"];
	var security = parseInt(ui_config["wifi_config"]["secrity_type"],10);
	if(security == "1") //wep
	{
		tmpl_wizard_data.protection = "1";
		tmpl_wizard_data.wpaMode = "";
		tmpl_wizard_data.cipherType = "";	
		tmpl_wizard_data.wepKeyIndex = ui_config["wifi_config"]["wep_default_index"];	
		ui_config["wifi_config"]["wep_key_str1"]  = decode_passwd(ui_config["wifi_config"]["wep_key_str1"]);	
		ui_config["wifi_config"]["wep_key_str2"]  = decode_passwd(ui_config["wifi_config"]["wep_key_str2"]);	
		ui_config["wifi_config"]["wep_key_str3"]  = decode_passwd(ui_config["wifi_config"]["wep_key_str3"]);	
		ui_config["wifi_config"]["wep_key_str4"]  = decode_passwd(ui_config["wifi_config"]["wep_key_str4"]);		
	}
	else if (security == "3") //wpa2
	{
		tmpl_wizard_data.protection = "2";	
		tmpl_wizard_data.wpaMode = "WPA2";
		tmpl_wizard_data.cipherType = ui_config["wifi_config"]["wlan_wpa_type"];	
		tmpl_wizard_data.passphrase = decode_passwd_wizard(ui_config["wifi_config"]["wlan_wpa_password"]) || "";	
	}
	else if(security == "4") //wpawpa2
	{
		tmpl_wizard_data.protection = "2";	
		tmpl_wizard_data.wpaMode = "auto";	
		tmpl_wizard_data.cipherType = ui_config["wifi_config"]["wlan_wpa_type"];
		tmpl_wizard_data.passphrase = decode_passwd_wizard(ui_config["wifi_config"]["wlan_wpa_password"]) || "";
	}
	else
	{
		tmpl_wizard_data.protection = "0";
		tmpl_wizard_data.wpaMode = "";
		tmpl_wizard_data.cipherType = "";
	}
    var pagefn = doT.template(document.getElementById('cp_wizardTemplate').text);
    $("#tf1_tmpl_cpwizard").html(pagefn(tmpl_wizard_data));

}

function getTimeConfig()
{
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "GetNtpClient",
				mask: "0",
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
			ui_config["system_time_config"] = responseData;			
	});
}

function getPowersaving(){
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
		//cp_systemPowersavingTemplate();
		if (window.get_powersaving_pollingTimer){clearTimeout(window.get_powersaving_pollingTimer);}
			window.get_powersaving_pollingTimer = setTimeout(getPowersaving, 3000);
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {  
    	if (window.get_powersaving_pollingTimer){clearTimeout(window.get_powersaving_pollingTimer);}
			window.get_powersaving_pollingTimer = setTimeout(getPowersaving, 3000);   
   });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

/*function cp_systemPowersavingTemplate(){
	var tmpl_powersave_data = {
					"batteryidletime":ui_config["powersaving"]["PWRMGR"]["batt_idle_tm"],
					"deepsleeptime":ui_config["powersaving"]["PWRMGR"]["deep_sleep_tm"]
				};   
   var pagefn = doT.template(document.getElementById('cp_powersavingTemplate').text);
   $("#tf1_tmpl_cppowersaving").html(pagefn(tmpl_powersave_data));

}*/

function doSystemNameGet() {
	var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_auth",
			data:
			{
				type: "get_systemInfo",
				mask: "0"
			},
		dataType: "json"
	});
	request.done(function( responseData,textStatus, jqXHR ) {
		document.title = "D-Link - "+responseData.system_name;
		systemName = responseData.system_name;
		$("#systemName").html(responseData.system_name);
	});
}
 
$(document).ready(function() {
	var opts = { language: "en", pathPrefix: "/lang"};
	opts.callback = function(data, defaultCallback) {
	  global_lang = data;
	  defaultCallback(data);
	}
	$("[data-localize]").localize("lang", opts);
	getLanguage();

	$("body").on("click", "#btnClose", function(e) {
		HideDialog('tf1_dialog', 'tf1_overlay');
		e.preventDefault();
	});
	$("body").on("click", ".submitRowPopup > .btnSubmit", function(e) {
		HideDialog('tf1_dialog', 'tf1_overlay');
		e.preventDefault();
	});
	

	window.onresize = function(event) {
		var leftPx = $(window).innerWidth() / 2 - $(".configDialog").width() / 2;
		leftPx = Math.round(leftPx);
		var topPx = $(window).innerHeight() / 2 - $(".configDialog").height() / 2;
		topPx = Math.round(topPx);
		$(".configDialog").css('left', leftPx + 'px');
		$(".configDialog").css('top', topPx + 'px');

		leftPx = $(window).innerWidth() / 2 - $(".errorPopup").width() / 2;
		leftPx = Math.round(leftPx);
		topPx = $(window).innerHeight() / 2 - $(".errorPopup").height() / 2;
		topPx = Math.round(topPx);
		$(".errorPopup").css('left', leftPx + 'px');
		$(".errorPopup").css('top', topPx + 'px');

	}	
	var requestTimeout = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_auth",
		data:
		{
			type: "load"
		},     
        dataType: "json"
    });
    requestTimeout.done(function( responseData,textStatus, jqXHR ) {  
		if(responseData.result == 1)
		{
			window.location = "login.html";
			return;
		}
		else if(responseData.result == 0)
		{
			global_authDefaulTimeout = parseInt(responseData.timeout);
			Session_inactivity_timeout = parseInt(responseData.timeout);				
		}
		else if(responseData.result == 3)
		{
			window.location = "login.html";
			return;
		}
		else if(responseData.result == 2)
		{
			window.location = "login.html";
			return;
		}
		else if(responseData.result== 8 || responseData.result== 9 || responseData.result== 10 || responseData.result== 11 || responseData.result== 12 || responseData.result== 13)
		{
			window.location = "login.html";
			return;
		}
		ui_config["login_timeout"] = global_authDefaulTimeout;		
    });
    requestTimeout.fail(function( jqXHR, textStatus, errorThrown) {	
		ui_config["login_timeout"] = global_authDefaulTimeout; 
		window.location = "login.html";
		return;		
    });
    requestTimeout.always(function(responseData,textStatus, jqXHR ) {  
		ui_config["login_timeout"] = global_authDefaulTimeout;  
    });
	loginApi_check_auth();
	doSystemNameGet();
	$("#all").show();	
    global_AuthTimeoutHandler = setInterval(function(){loginApi_timeout_start()},60000);
	getWanStatus();
	getLockPinPrompt();
	cp_internetInfo_template();
	getWiFiClients();
	//cp_wifi_template();
	getWWANSTATS(4);
	getWWANSTATS(6);
	doGetWanConnectedTime();
	doGetWan6ConnectedTime();
	getLANSettings();
	internet_onloadInternetApnConfig_1();
	doGetWiFiConfig();
	cp_mainInfo_template();
	getConnectMode();
	cp_connectionMode_template();
	cp_toggleConnection();
	getPowersaving();	
	application_smsstorage_get();
	index_getSMSStoreStatus();
	onloadCall(cp_enableDisableConnectionOnLoad, {
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
	cp_messages_template();
	$(this).mousemove(function (e)
	{
		idleTime=0;
	});
	$(this).keypress(function (e)
	{
		idleTime=0;
	});
});
 
/* To restore the system configuration file  */
function system_restore(){

    $.ajaxFileUpload({
		url:'cgi-bin/qcmap_web_restore',
		secureuri:false,
		fileElementId:'tf1_WebCFGUpload',
		dataType: 'text',
		success: function (data, status)
		{
			var retOK = data.indexOf("OK");	
			if (retOK != -1)
			{	
				wizard_reboot();
				alert(global_lang['alerts_set']['restore_OK']);
	    		window.location = "login.html";
			}
			else
			{
				
				alert(global_lang['validation_msgs']['fail_restore_config_file']);
			}			
		},
		error: function (data, status, e)
		{
			alert(e);
		}
	})
}

