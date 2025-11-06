ui_config["traceout_res"] = new Object();
ui_config["ping_res"]	= new Object();
ui_config["app_getsimcontacts"] = new Object();
ui_config["app_getsimInbox"] = new Object();
ui_config["app_getsimDrafts"] = new Object();
ui_config["app_getsimcapcity"] = new Object();
ui_config["app_getsmsstore"] = new Object();
ui_config["app_getsmsstore"]["SMSC"]=new Object();

function application_firewall_info_get(){
	var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetConfigFirewall",
			token: session_token
		},
        dataType: "text"
       
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
		var obj = jQuery.parseJSON(responseData);
		ui_config["firewall_info"]["firewall_status"]["firewall_enable"] = obj.Firewall_enable;
		ui_config["firewall_info"]["firewall_status"]["pkts_allowed"] = obj.pkts_allowed;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

	 request = $.ajax({
		type: "POST",
	    url:"cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetDMZHost",
			mask: 0,
			token: session_token
		},
        dataType: "text"
       
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
		var obj = jQuery.parseJSON(responseData);
		ui_config["firewall_info"]["DMZ"]["ip"] = obj.dmzip;
		if (obj.dmzip.length > 0 && obj.dmzip != "0.0.0.0")
			ui_config["firewall_info"]["DMZ"]["enable"] = 1;
		else
			ui_config["firewall_info"]["DMZ"]["enable"] = 0;

    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

	request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetNatSettings",
			mask: 0,
			token: session_token
		},
		dataType: "text",
	});
    request.done(function( responseData,textStatus, jqXHR ) {  
		var obj = jQuery.parseJSON(responseData);
		ui_config["firewall_info"]["WAN_ACCESS"]["v4_allow"] = obj.wwan_access;
		ui_config["firewall_info"]["WAN_ACCESS"]["port"] = "80";

    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });




}
function applicationApi_setFirewallStatus(firewall_config,firewall_rules)
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "SetConfigFirewall",
			mask: "0",
			config_state: firewall_config,
			config_pkts:  firewall_rules,		
			token: session_token
		},
		dataType: "json",
	});	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			//alert("Success");
   			});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("try");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}


function applicationApi_firewalldmzSet(dmzst,ipaddr) {

			if (dmzst == 0)
				ipaddr = "0.0.0.0";
			var request = $.ajax({
	        type: "POST",
	        url: "cgi-bin/qcmap_web_cgi",
	        data: 
			{
				Page:"SetDMZHost",
				mask:"0",
				dmz:ipaddr, 
				token:session_token
			},
	        dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			//alert("Success");
   			});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("try");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}

function applicationApi_firewallwanaccessSet(wanst,portnum) {

			var request = $.ajax({
	        	type: "POST",
	        	url: "cgi-bin/qcmap_web_cgi",
	        	data:
				{
					Page: "SetNatSettings", 
					mask: 540, 
					nattype: "", 
					nattype_result: "0", 
					dmz: '', 
					dmz_result: "0", 
					ipsec: '1',
					ipsec_result: "0",
					pptp: '1',
					pptp_result: "0",
					l2tp: '1',
					l2tp_result: "0",
					gen_timeout: '0',
					get_timeout_result: "0",
					icmp_timeout: '1',
					icmp_timeout_result: "0",
					tcp_timeout: '0',
					tcp_timeout_result: "0",
					udp_timeout: '0',
					udp_timeout_result: "0",
					wwan_access: wanst,
					wwan_access_result : "0",
					token: session_token
				},
	        	dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			alert(global_lang['alerts_set']['firewall_setting_success']);
   			});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("try");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}

/*API to get portforward Info get */
function application_firewall_PortfwdInfo_get(){
	
	var request = $.ajax({
		type: "POST",
	    url:"cgi-bin/qcmap_web_cgi",        
		data:
		{
			Page: "GetSnatEntries",
			mask: "0",
			token: session_token
		},
        dataType: "json"       
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
			//var Data = jQuery.parseJSON(responseData);
			//alert(Data);
    		ui_config["firewall_portfwdinfo"] = responseData.entries;
			ui_config["firewall_portfwdinfo_ex"]["result"] = responseData.result;
			ui_config["firewall_portfwdinfo_ex"]["max"] = "15";

			var tmp_data = new Object();
			var data_list = "";
			tmp_data = responseData.entries;
			for (var item in tmp_data) {
				if (item != "exists") {
					data_list = data_list + tmp_data[item].private_ip + "," + tmp_data[item].private_port + "," + tmp_data[item].global_port + "," + tmp_data[item].proto + ";";
				}
			}
			ui_config["firewall_portfwdinfo_ex"]["old_portfwd_list"] = data_list;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

}

/*API to get IPFilter Info get */
function application_firewall_ipfilterInfo_get(){
	
	var request = $.ajax({
		type: "POST",
	    url:"cgi-bin/qcmap_web_cgi",        
		data:
		{
			Page: "GetFirewall",
			IP_Type: 4,
			token: session_token
		},
        dataType: "json"
       
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
			var startIndex;
			var newIndex;
			//var Data = jQuery.parseJSON(responseData);
			var Data = responseData;
			for (var loop = 0; loop < global_contact_loop; loop++) {
				startIndex = loop*10;
				newIndex = startIndex + 1;
				if ( loop == 0 ) {
						ui_config["firewall_ipfilterinfo"] = Data.entries;
						ui_config["firewall_ipfilterinfo_ex"]["max"] = "50";

				} else {
					$.each(Data.entries,function(key,value) {
						ui_config["firewall_ipfilterinfo"]["M" + newIndex] = value;
						newIndex = newIndex + 1;
					});					
				}
				if (jsonKeysCount(Data.entries) < 11 || Data.count == 10 ) {
					loop = 	global_contact_loop + 1;
				}
			}

			var tmp_data = new Object();
			var data_list = "";
			tmp_data = Data.entries;
			for (var item in tmp_data) {
				if (item != "exists") {
					data_list = data_list + tmp_data[item].ipsrcaddr + "," + tmp_data[item].ipdstaddr + "," + tmp_data[item].tcpudpsrcport + "," + (parseInt(tmp_data[item].tcpudpsrcport)+parseInt(tmp_data[item].tcpudpsrcrange)) + "," + tmp_data[item].tcpudpdstport + "," + (parseInt(tmp_data[item].tcpudpdstport)+parseInt(tmp_data[item].tcpudpdstrange)) + "," + tmp_data[item].nxthdrproto + ";";
				}
			}
			ui_config["firewall_portfwdinfo_ex"]["old_ipfilter_list"] = data_list;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

}

 function redirectTimeout(path) {
    if (--window.redirectTimeoutVar <= 0) {
    	parent.location.href=path;
    } else {
      $("#reboot_timeout").html(window.redirectTimeoutVar);
    }
}

function dhcpRedirect(timeout, path) {
	$.ajaxSetup({async:true});
	$("#tf1_Progressbar").show();
    window.redirectTimeoutVar = timeout;
	$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['rebooting_timeout']);
	$("#reboot_timeout").html(window.redirectTimeoutVar);
    setInterval("redirectTimeout('" + path + "');", 1000);
}

function applicationApi_dhcpsettingsSet() {

			var ip_addr = "192.168.0." + document.getElementById("tf1_ipAddr").value;
			var start_addr = "192.168.0." + document.getElementById("tf1_iprange1").value;
			var end_addr = "192.168.0." + document.getElementById("tf1_iprange2").value; 
			var en_dhcp = document.getElementById("tf1_hid_enableDhcp").value; 

			var request = $.ajax({
	        type: "POST",
	        url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "SetLanConfig",
				Mask: 1,
				lan_gw_addrs: ip_addr,
				lan_sub: "255.255.255.0",
				lan_dhcp: en_dhcp,
				lan_dhcp_start: start_addr,
				lan_dhcp_end: end_addr,
				lan_dhcp_lease:ui_config["lan"]["DHCP4S"]["lease"] ,
				token: session_token
			},
	        dataType: "text"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			 	clearCookies();
				 alert(global_lang['alerts_set']['dhcp_settings_success']);				 
				var path = "http://"+ip_addr+"/";
				dhcpRedirect(90,path);
				 
   			});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("try");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}
 

function applicationApi_ussd_send(code) {
			var request = $.ajax({
	        type: "POST",
	        url: "cgi-bin/qcmap_web_cgi",
	        data:
			{
				Page: "ussd_send",
				token: session_token,
				ussdCMD: code
			},
	        dataType: "text"
			});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {   
				global_ussdsendTimeoutHandler = setInterval(function(){ application_ussd_loop()},3000); 
			});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		    	 //alert("Invalid");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}


function application_ussd_loop(){
	var request = $.ajax({
		type: "POST",
	    url: "cgi-bin/qcmap_web_cgi",       
		data:
		{
			Page: "ussd_get",
			mask: 0,
			token: session_token,
		},
        dataType: "json",
		async : true
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
			if (responseData.result == "SUCCESS") {
				var ussd_result = responseData.ussd_result;
				
				while(ussd_result.indexOf("&#x0a;")>=0)
				    ussd_result = ussd_result.replace("&#x0a;", "<br>");
				//ui_config["ussd"]["cmd_status"] = "Done";
				//ui_config["ussd"]["resp_data"] = ussd_result;
				//ui_config["ussd"]["resp_state"] = responseData.ussd_state;
				if(ussd_result == "Unexpected data value" || ussd_result == "INTERNAL ERROR")
				{
					$("#response_result").html(global_lang["application_popup"]["ussd_result"]);
				}
				else
				{
					$("#response_result").html(ussd_result);
				}
				
				if(parseInt(responseData.ussd_state) == 0)
				{
					clearInterval(global_ussdsendTimeoutHandler);
					$("#response_state").html(global_lang["application_popup"]["session close"]);
				}
				else
				{							
					$("#response_state").html("session start");
				}
			}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });

}

function twoBytes(charCode) 
{
	 if(charCode > 127)
		 return true;
	 switch(charCode) {
	 	case 12:
			return true;
		case 91:
			return true;
		case 92:
			return true;
		case 93:
			return true;
		case 94:
			return true;
		case 123:
			return true;
		case 124:
			return true;
		case 125:
			return true;
		case 126:
			return true;
		default:
			return false;
	 }
}

function application_api_sendsms(msg,phonelist) {

	var number_arry = phonelist.split(";");
	var msg_flag =0;
	var msg_length = msg.length;

	if (number_arry.length < 1) {
		alert(global_lang['application_popup']['message_Invalid_Number']);
		return false;
	}
	if(number_arry.length > 10) {
		alert(global_lang['application_popup']['too_many_number']);
		return false;
	}

	for (var i=0;i<number_arry.length;i++) {
		var ret = number_arry[i].match(/^[+0-9][0-9]*$/);
		if(!ret) {
				alert(global_lang['application_popup']['invalid_number']);
			return false;
		}
	}

	if (msg_length < 1) {
		alert(global_lang['application_popup']['empty_messager']);
		return false;
	}

	for(var i = 0;i < msg_length; i++) {
		if( twoBytes( msg.charCodeAt(i)) ) {
			msg_flag = 1;
			break;
		}
	}

	if(msg_flag == 1) {
		if (msg_length > 500) {
			alert(global_lang['application_popup']['too_long_message_ch']);
			return false;
		}
	}
	else {
		if (msg_length > 1000) {
			alert(global_lang['application_popup']['too_long_message_en']);
			return false;
		}
	}


	global_smsTimeoutHandler = setInterval(function(){sms_status_loop()},2000);
	if($("#tf1_tag_draft").val() != "")
	{
		//console.log($("#tf1_tag_draft").val());
		application_api_smsdraftDelete($("#tf1_tag_draft").val());		
		applicationSettings_onloadDrafts();				
	} 
    $(".leftMenuFour").find("a").css("pointer-events","none");
	$(".close2").css("pointer-events","none");
	$(".close").css("pointer-events","none");
	if (window.global_wifiClient_pollingTimer){clearTimeout(window.global_wifiClient_pollingTimer);}
	if (window.global_wan_pollingTimer){clearTimeout(window.global_wan_pollingTimer);}
	if (window.wan_connected_time_pollingTimer){clearTimeout(window.wan_connected_time_pollingTimer);}
	if (window.wan6_connected_time_pollingTimer){clearTimeout(window.wan6_connected_time_pollingTimer);}
	if (window.wifi_SSID_pollingTimer){clearTimeout(window.wifi_SSID_pollingTimer);}
	if (window.index_smsStoreStatus_pollingTimer){clearTimeout(window.index_smsStoreStatus_pollingTimer);}
	if (window.global_wanStatus_pollingTimer){clearTimeout(window.global_wanStatus_pollingTimer);}
	if (window.global_smslist_pollingTimer){clearTimeout(window.global_smslist_pollingTimer);}	
	if (window.get_powersaving_pollingTimer){clearTimeout(window.get_powersaving_pollingTimer);}
	//global_sms_sendOk = 0;
	//return ;
	 if ($('#tf1_addInbox').css('display') != 'none') {
		 	$("#tf1_sms_buttons").hide();
		 	$("#tf1_sms_status").show();
		} else {
			$("#tf1_sms_reply_buttons").hide();
		 	$("#tf1_sms_reply_status").show();
		}

    var request = $.ajax({
		type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data: 
		{
			Page: "sms_send",
			msgFlag: msg_flag,
			msgLength:msg_length,
			msgNumber:phonelist,
			token: session_token,
			msgContent:msg
		},
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {

		var obj = jQuery.parseJSON(responseData);
		if(obj.result =="SUCCESS" && obj.msgFailed == 0 && obj.msgSuccess !=0) {
				global_sms_sendOk = 1;
			$.ajaxSetup({async:false});
		}else if(obj.msgFailed == 0 && obj.msgSuccess == 0){
			global_sms_sendOk = 2;
		}else if(obj.msgFailed == 1){
			global_sms_sendOk = 2;
            $.ajaxSetup({async:false});
		}
		else{
			global_sms_sendOk = 2;
            $.ajaxSetup({async:false});
		}
		
		 window.global_wifiClient_pollingTimer = setTimeout(getWiFiClients, 3000);
		 window.global_wan_pollingTimer = setTimeout(getWWANSTATS, 3000);
		 window.wan_connected_time_pollingTimer = setTimeout(doGetWanConnectedTime, 3000);
		 window.wan6_connected_time_pollingTimer = setTimeout(doGetWan6ConnectedTime, 3000);
		 window.wifi_SSID_pollingTimer = setTimeout(doGetWiFiConfig, 3000);
		 window.index_smsStoreStatus_pollingTimer = setTimeout(index_getSMSStoreStatus, 3000);
		 window.global_wanStatus_pollingTimer = setTimeout(getWanStatus, 3000);
		 window.global_smslist_pollingTimer = setTimeout(cp_messages_template, 3000);
		 window.get_powersaving_pollingTimer = setTimeout(getPowersaving, 3000);
			
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
         // alert("Invalid");
		 window.global_wifiClient_pollingTimer = setTimeout(getWiFiClients, 3000);
		 window.global_wan_pollingTimer = setTimeout(getWWANSTATS, 3000);
		 window.wan_connected_time_pollingTimer = setTimeout(doGetWanConnectedTime, 3000);
		 window.wan6_connected_time_pollingTimer = setTimeout(doGetWan6ConnectedTime, 3000);
		 window.wifi_SSID_pollingTimer = setTimeout(doGetWiFiConfig, 3000);
		 window.index_smsStoreStatus_pollingTimer = setTimeout(index_getSMSStoreStatus, 3000);
		 window.global_wanStatus_pollingTimer = setTimeout(getWanStatus, 3000);
		 window.global_smslist_pollingTimer = setTimeout(cp_messages_template, 3000);
		 window.get_powersaving_pollingTimer = setTimeout(getPowersaving, 3000);
		 
		global_sms_sendOk = 2;
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });


}


function sms_status_loop () {

	if (!global_sms_sendOk)
		return ;
	clearInterval(global_smsTimeoutHandler);		 	 	
	$("#tf1_sms_buttons").show();
	$("#tf1_sms_status").hide();		 		
	$("#tf1_sms_reply_buttons").show();
	$("#tf1_sms_reply_status").hide();		 	
    if(global_sms_sendOk == 1 || global_sms_sendOk == 2){
		if(bmt_flag == 1){
			application_api_smsdraftDelete(tag_check);
			$('#tf1_draft_msg_'+checkbox_msg).parent().remove();	
			tag_check = null;
			checkbox_msg = null;
		}

	}
	if ( $('#tf1_addInbox').css('display') != 'none' || $('#tf1_replyInbox').css('display') != 'none' ) {							
		if (global_sms_sendOk == 2 ) {
			alert(global_lang['alerts_set']['sms_sent_fail']);
		} else {
			alert(global_lang['alerts_set']['sms_sent_success']);
		}
		$(".configForm").show();
		$(".configTableForm").hide();
	}
	$(".leftMenuFour").find("a").css("pointer-events","auto");
	 $(".close2").css("pointer-events","auto");
	 $(".close").css("pointer-events","auto");
	global_sms_sendOk = 0;
}


function application_api_smsinboxDelete(tag) {

    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data:
		{
			Page: "sms_delete",
			storage: global_sms_storage,
			box_flag: "0",
			sms_del:tag,
			token: session_token
		},
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });

}

function application_simInbox_get(){

	  var startIndex = 0;
	  var newIndex;
		var request = $.ajax({
			type: "POST",
        	url:"cgi-bin/qcmap_web_cgi",	
			data:
			{
				Page:"sms_read",
				storage: global_sms_storage,
				box_flag:"0",
				token: session_token
			},
        	dataType: "text"
			});
			request.done(function( responseData,textStatus, jqXHR ) {
					var obj = removeInvalidChar(responseData);
					obj = jQuery.parseJSON(obj);
					ui_config["app_getsimInbox"]["total"] = parseInt(obj.count);
			});
			request.fail(function( jqXHR, textStatus, errorThrown) {     
			});
			request.always(function(responseData,textStatus, jqXHR ) {       
		});	
  
}

function application_simInbox_get2(){

	  var startIndex = 0;
	  var newIndex;
		var request = $.ajax({
			type: "POST",
        	url:"cgi-bin/qcmap_web_cgi",
			data:
			{
				Page:"sms_read",
				storage: global_sms_storage,
				box_flag:"0",
				token: session_token
			},
        	dataType: "text"
			});
			request.done(function( responseData,textStatus, jqXHR ) {
					var obj = removeInvalidChar(responseData);
					obj = jQuery.parseJSON(obj);
					var count = parseInt(obj.count);
                    var getsimInbox = obj.entries;
					getsimInbox.sort(function(a,b){
						var abd = "20" + a.sms_time;
						var def = "20" + b.sms_time;
					   var timestamp1 = Date.parse(new Date(abd));
					   timestamp1 = timestamp1/1000;
					   var timestamp2 = Date.parse(new Date(def));
					    timestamp2 = timestamp2/1000;
					   return timestamp2 - timestamp1;
					});
					ui_config["app_getsimInbox"] = getsimInbox;
					ui_config["app_getsimInbox"]["total"] = count;
					
			});
			request.fail(function( jqXHR, textStatus, errorThrown) {     
			});
			request.always(function(responseData,textStatus, jqXHR ) {       
		});	
  
}


function application_api_smsdraftAdd(msg,phonelist) {
	var number_arry = phonelist.split(";");
	var msg_flag =0;
	var msg_length = msg.length;
	
	if(ui_config["app_getsimDrafts"]["total"] == 100){
			alert(global_lang['alerts_set']['draft_save_judge']);
			return false;
		}
	
	if (number_arry.length < 1) {
		alert(global_lang['application_popup']['message_Invalid_Number']);
		return false;
	}
	if(number_arry.length > 10) {
		alert(global_lang['application_popup']['too_many_number']);
		return false;
	}

	for (var i=0;i<number_arry.length;i++) {
		var ret = number_arry[i].match(/^[+0-9][0-9]*$/);
		if(!ret) {
				alert(global_lang['application_popup']['invalid_number']);
			return false;
		}
	}

	if (msg_length < 1) {
		alert(global_lang['application_popup']['empty_messager']);
		return false;
	}

	for(var i = 0;i < msg_length; i++) {
		if( twoBytes( msg.charCodeAt(i)) ) {
			msg_flag = 1;
			break;
		}
	}


	if(msg_flag == 1) {
		if (msg_length > 500) {
			alert(global_lang['application_popup']['too_long_message_ch']);
			return false;
		}
	}
	else {
		if (msg_length > 1000) {
			alert(global_lang['application_popup']['too_long_message_en']);
			return false;
		}
	}

    var request = $.ajax({
        url: "cgi-bin/qcmap_web_cgi",
        type: "POST",
        data: 
		{
			Page: "sms_save",
			msgFlag: msg_flag,
			msgLength:msg_length,
			msgNumber:phonelist,
			token: session_token,
			msgContent:msg
		},
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
		var obj = jQuery.parseJSON(responseData);
		if(obj.msgFailed == 0) {
			if(bmt_flag == 1){
			application_api_smsdraftDelete(tag_check);
			$('#tf1_draft_msg_'+checkbox_msg).parent().remove();	
			tag_check = null;
			checkbox_msg = null;
		}
		  alert(global_lang['alerts_set']['draft_save_success']);
		}
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });

}

function application_api_smsdraftDelete(tag) {
     
    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data:
		{
			Page: "sms_delete",
			storage: global_sms_storage,
			box_flag: "2",
			sms_del:tag,
			token: session_token
		},
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });

}

function application_simDrafts_get(){
	var startIndex = 0;
	var newIndex;
	var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "sms_read",
			storage: global_sms_storage,
			box_flag:"2",
			token: session_token
		},
        dataType: "text"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
		//alert(responseData);
		var obj = removeInvalidChar(responseData);
		obj = jQuery.parseJSON(obj);
		var count = parseInt(obj.count);
		 var simDrafts = obj.entries;
					simDrafts.sort(function(a,b){
						var abd = "20" + a.sms_time;
						var def = "20" + b.sms_time;
					    var timestamp1 = Date.parse(new Date(abd));
					    timestamp1 = timestamp1/1000;
					    var timestamp2 = Date.parse(new Date(def));
					    timestamp2 = timestamp2/1000;
					   return timestamp2 - timestamp1;
					});
		ui_config["app_getsimDrafts"] = simDrafts;
		ui_config["app_getsimDrafts"]["total"] = count;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {     
    	dialogAlert(global_lang["application_popup"]["get_sim_drafts_error"]);
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

/*SMS store in SIM/Device */
function application_smsstorage_get(){
	var request = $.ajax({
	    type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "get_sms_storage_type",
			mask: 0,
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
			if(responseData.storage_type==0){
				ui_config["app_getsmsstore"]["SMSC"]["sms_into_sim"] = "1";
				global_sms_storage = 0;
			}else if(responseData.storage_type==1){
				ui_config["app_getsmsstore"]["SMSC"]["sms_into_sim"] = "0";
				global_sms_storage = 1;
			}else{
				dialogAlert(global_lang["application_popup"]["get_sms_storage_error"]);	
			}
		}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {     
    	dialogAlert(global_lang["application_popup"]["get_sms_storage_error"]);	
   });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function application_sms_get_sms_total(boxFlag){
	var request = $.ajax({
	    type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "sms_read",
			storage: global_sms_storage,
			box_flag: boxFlag,
			token: session_token
		},
	    dataType: "text"
	});
		
    request.done(function( responseData,textStatus, jqXHR ) {  
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
		if(obj.result == "SUCCESS")
		{
			if(boxFlag=="0"){
				ui_config["app_getsimInbox"]["total"]=parseInt(obj.count);
			}else if(boxFlag=="2"){
				ui_config["app_getsimDrafts"]["total"]=parseInt(obj.count);
			}
		}else{
			dialogAlert(global_lang["application_popup"]["get_sms_total_error"]);
		}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {     
    	dialogAlert(global_lang["application_popup"]["get_sms_total_error"]);	
   });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function application_sms_get_sms_center_num(){
	var request = $.ajax({
	    type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "get_sms_smsc",
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
			ui_config["app_getsmsstore"]["SMSC"]["addr_digits"]=responseData.smsc_addressdigits;
		}else{
			ui_config["app_getsmsstore"]["SMSC"]["addr_digits"] = "NONE";
			dialogAlert(global_lang["application_popup"]["get_sms_center_num"]);
		}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {     
    	dialogAlert(global_lang["application_popup"]["get_sms_center_num"]);
   });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}



/* application firewall portward delete function */
function application_api_portfwdDelete(newportlist) {
    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data: 
		{
			Page: "SetNATEntries",
			mask: 4,
			filter_list: newportlist,
			token: session_token
		},
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
		applicationSettings_onloadportfwding();
		
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });
    
}


/* application firewall portward Add&Edit function */
function application_api_portfwdfilter(index){
//	console.log(index);
		
   	ip_add = $("#tf1_pfsourceIp").val();
	
	var selProtocol = comboSelectedValueGet('tf1_pfprotocol');
	
	if ( selProtocol == "6" || selProtocol == "17" ) {		
		protocol = selProtocol;	
	} else {		
		protocol = $("#tf1_pfprotocolnum").val();		
	}
	
	if ( $("#tf1_enabledisablePorts").attr("class") == "enable-disable-on" ) {
		dst_port1= $("#tf1_pfstartPort").val();
		dst_port2 = $("#tf1_pfendPort").val();	
	} else {		
		dst_port1= "";
		dst_port2 = "";		
	}
	var post_list = ui_config["firewall_portfwdinfo_ex"]["old_portfwd_list"];
	var post_part = post_list.split(";");
	if(index <= post_part.length){
		post_part[index] = ip_add + "," + dst_port1 + "," + dst_port2 + "," + protocol + ";";
		post_list = "";
		for(var j=0; j<post_part.length; j++){
			post_list += post_part[j] + ";";
		}
		var post_data = post_list;
	}else{
		var post_data = ui_config["firewall_portfwdinfo_ex"]["old_portfwd_list"] + ip_add + "," + dst_port1 + "," + dst_port2 + "," + protocol + ";";
	}
    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data: 
		{
			Page: "SetNATEntries",
			mask: "0",
			nat_forward: post_data,
			token: session_token
		},
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
		
		
		applicationSettings_onloadportfwding();			
		
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            

    });
}


/* application firewall ipfilter edit function */
function application_api_ipfilterEdit(newIpfilter,index) {
	newIpfilter[index]= $("#tf1_sourceIp").val() + "," + $("#tf1_destIp").val() + "," + $("#tf1_sourcePort1").val() + "," + $("#tf1_sourcePort2").val() + "," + $("#tf1_destPort1").val() + "," + $("#tf1_destPort2").val() + "," + $("#tf1_ipfilter_protocol").val(); 
    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data: 
		{
			Page: "SetEntriesFirewall",
			mask: 4,
			filter_list: newIpfilter.join(";"),
			//filter_list: post_data,
			token: session_token
		},
        //dataType: "json"
        dataType: "text"
    });
    
    
    request.done(function(responseData,textStatus, jqXHR ) {
		var obj = jQuery.parseJSON(responseData);	
		ui_config["firewall_ipfilterinfo_ex"]["result"] = obj.result;
		applicationSettings_onloadIPFilter();	
		
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });
    
}

/* application firewall ipfilter delete function */
function application_api_ipfilterDelete(newIpfilter) {
    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data: 
		{
			Page: "SetEntriesFirewall",
			mask: 4,
			filter_list: newIpfilter,
			token: session_token
		},
        //dataType: "json"
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
		var obj = jQuery.parseJSON(responseData);	
		ui_config["firewall_ipfilterinfo_ex"]["result"] = obj.result;
		applicationSettings_onloadIPFilter();	
		
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });
    
}


/* application firewall ipfilter Add&Edit function */
function application_api_ipfilter(index){
	
	var ipfilter_list = ui_config["firewall_portfwdinfo_ex"]["old_ipfilter_list"] + $("#tf1_sourceIp").val() + "," + $("#tf1_destIp").val() + "," + $("#tf1_sourcePort1").val() + "," + $("#tf1_sourcePort2").val() + "," + $("#tf1_destPort1").val() + "," + $("#tf1_destPort2").val() + "," + $("#tf1_ipfilter_protocol").val() + ";"; 

    var request = $.ajax({
        type: "POST",
        url: "cgi-bin/qcmap_web_cgi",
        data: 
		{
			Page: "SetEntriesFirewall",
			mask: 4,
			filter_list: ipfilter_list,
			//filter_list: post_data,
			token: session_token
		},
        //dataType: "json"
        dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
		var obj = jQuery.parseJSON(responseData);	
		ui_config["firewall_ipfilterinfo_ex"]["result"] = obj.result;
		applicationSettings_onloadIPFilter();	
		
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });
	
	
}

function application_api_sms_set(){
	
	var sel_location = radioCheckedValueGet('tf1_storein_sim');
	var tmp_location;

	if(sel_location==1){
		tmp_location=0;	
	}else{
		tmp_location=1;	
	}
	var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "set_sms_storage_type",
			storage_type:tmp_location,
			token: session_token,
		},
		dataType: "json"
	});
	    	
	request.done(function( responseData,textStatus, jqXHR ) {   
		if(responseData.result == "SUCCESS")
		{
			alert(global_lang["application_popup"]["set_sms_storage_type_success"]);
		}
		else
		{
			dialogAlert(global_lang["application_popup"]["set_sms_storage_type_failed"]);
		}
	});
    request.fail(function( jqXHR, textStatus, errorThrown) { 
    	dialogAlert(global_lang["application_popup"]["set_sms_storage_type_failed"]);
    });
    request.always(function(responseData,textStatus, jqXHR ) {	
       
    });
}

function application_urlFilter_info_get()
{
	 request = $.ajax({
		type: "POST",
	    url:"cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "getURLFilter",
			mask: 0,
			token: session_token
		},
        dataType: "text"
    });
    request.done(function( responseData,textStatus, jqXHR ) { 
		var obj = jQuery.parseJSON(responseData);
		if(obj.result == "SUCCESS")
		{
			var keywords = decodeURI(decodeURIComponent(obj.keywords));
			ui_config["firewall_info"]["URL_Filter"]["enable"] = obj.enable;
			ui_config["firewall_info"]["URL_Filter"]["keyword"] = keywords;
			ui_config["firewall_info"]["URL_Filter"]["url_keywd_max_num"] = obj.max_num;
		}
		else
		{
			ui_config["firewall_info"]["URL_Filter"]["enable"] = 0;
			ui_config["firewall_info"]["URL_Filter"]["keyword"] ="";
			ui_config["firewall_info"]["URL_Filter"]["url_keywd_max_num"] = 15;
		}

    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	
    	
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}
function application_api_addurlfilter(enableUrl,keyword) {	
    
   
 if (ui_config["firewall_info"]["URL_Filter"]["keyword"] == "") {
	 var current_keywords = new Array();
 } else {
  	var current_keywords = ui_config["firewall_info"]["URL_Filter"]["keyword"].split(",");
 }
  
  

  for (var i=0; i< current_keywords.length; i++) {
	  
	  current_keywords[i] = encodeURIComponent(encodeURI(current_keywords[i]));
	  
  }
   current_keywords[current_keywords.length] = encodeURIComponent(encodeURI(keyword));

 	if(current_keywords.length > parseInt(ui_config["firewall_info"]["URL_Filter"]["url_keywd_max_num"]))
	{
		alert(global_lang['alerts_set']['url_filter_limit']);
		return;
	}
   var keywords = current_keywords.join(",");  
	
    var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "setURLFilter",
			mask: "0",
			enable: enableUrl,
			keyword: keywords,
			token: session_token,
		},
		dataType: "json"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
	 	 alert(global_lang['alerts_set']['url_filter_add_success']);
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });

}

function application_api_deleteurlfilter(deleteFlag) {

	 
	var new_keywords = new Array();
	
	$(".chk_id").each(function(value,index){	 	
	
	   if ($(this).is(":checked") == false) {
		   new_keywords[new_keywords.length] = encodeURIComponent(encodeURI($(this).val()));
	   }
	
	});	
	
	var keywords = new_keywords.join(",");	  
	var enableUrl = $("#tf1_enableurlValue").val();	
	
	if(new_keywords.length == 0 && deleteFlag) {
		keywords = "";	
	}
	
    var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "setURLFilter",
			mask: "0",
			enable: enableUrl,
			keyword: keywords,
			token: session_token,
		},
		dataType: "json"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
		
         
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });

}

