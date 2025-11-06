function systemApi_languageSet(lang) {
			var request = $.ajax({
	        	url: "cgi-bin/qcmap_web_cgi",
	        	type: "POST",
				data:
				{
					Page: "SetWEBLanguage",
					mask: "0",
					web_language: lang,
					token: session_token
				},
	        	dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {  
    			alert(global_lang['alerts_set']['language_save_success']);
    			window.location = "index.html"				  
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });

}
function systemApi_languageGet() {
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
			ui_config.Dyn_Status["up_5s"]["lang"] = responseData.web_language;			
	});
	request.fail(function(xhr, textStatus, errorThrown){
		//dialogAlert(global_lang["login1"]["error"]);
	});
}

function systemApi_network_clearStat() {

			var request = $.ajax({
	        type: "POST",
	        url: "cgi-bin/qcmap_web_cgi",
	        data: 
			{
				Page: "GetWWANSTATS",
				resetwwwanstats: 1,
				family : 4,
				token: session_token
			},
	        dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			alert(global_lang['alerts_set']['packet_data_clear_success']);
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("Invalid");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}

function systemApi_SntpSet(status1,timezone,up_period,server1,server2,server3) {
	
			var request = $.ajax({
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "SetNtpClient",
				mask: "0",
				ntp_server1: $("#tf1_primarySntpServer").val(),
				ntp_server2: $("#tf1_secondarySntpServer").val(),
				ntp_server3: $("#tf1_tertiarySntpServer").val(),
				ntp_server4: "",
				time_zone: $("#tf1_timezone").val(),
				Daylight : "",
				start_m :  "",
				start_w :  "",
				start_d :  "",
				start_clock :  "",
				end_m :  "",
				end_w :  "",
				end_d :  "",
				end_clock :  "",
				ntp_enable : $("#tf1_sntpEnableDisableValue").val(),
				ntp_SyncInterval : parseInt($("#tf1_synchronization").val())*3600,
				token: session_token
			}
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {
    			
    			

   			});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("try");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}
			
function systemApi_datetimeSet(date) {
	var ampm_flag = date.indexOf("PM");
	var dateArry = date.split(" ");
	var dateArry1 = dateArry[0].split("-");
	var dateArry2 = dateArry[1].split(":");
	if(ampm_flag > 0)
		dateArry2[0] = parseInt(dateArry2[0])+12;
	var currentTime = new Date(dateArry1[0], parseInt(dateArry1[1]) - 1, dateArry1[2], dateArry2[0], dateArry2[1]);
	//var currentTime = new Date(date);
	var seconds = currentTime.getUTCSeconds();
	var minutes = currentTime.getUTCMinutes();
	var hours = currentTime.getUTCHours();
	var month = currentTime.getUTCMonth() + 1;
	var day = currentTime.getUTCDate();
	var year = currentTime.getUTCFullYear();
	
	if(year > 2037)
	{
		alert("Invalid date : the year can't be set later than 2037");
	}
	var seconds_str = " ";
	var minutes_str = " ";
	var hours_str = " ";
	var month_str = " ";
	var day_str = " ";
	var year_str = " ";

	if(seconds < 10)
		seconds_str = "0" + seconds;
	else
		seconds_str = ""+seconds;

	if(minutes < 10)
		minutes_str = "0" + minutes;
	else
		minutes_str = ""+minutes;

	if(hours < 10)
		hours_str = "0" + hours;
	else
		hours_str = ""+hours;

	if(month < 10)
		month_str = "0" + month;
	else
		month_str = ""+month;

	if(day < 10)
		day_str = "0" + day;
	else
		day_str = day;

	var tmp = year + "-" + month_str + "-" + day_str + " " + hours_str + ":" + minutes_str + ":" + seconds_str;
	var request =$.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "syncWithHost",
				mask: "0",
				current_date: tmp,
				token: session_token
			},
			dataType: "text",
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {
    			
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		     	//alert("Invalid");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {		       
		    });

		    

}

function setAutoLogoutTime(timeout)
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			type: "timeupdate",
			timeout: timeout,
			token: session_token
		},
		dataType: "json"
	 });
    request.done(function( responseData,textStatus, jqXHR ) {
		if(responseData.result== 3)
		{
		    alert(global_lang['login1']['login-fail']);
			window.location = "login.html";
			return;
		}
		if(responseData.result== 8 || responseData.result== 9 || responseData.result== 10 || responseData.result== 11 || responseData.result== 12 || responseData.result== 13)
		{				
			alert(global_lang['login1']['device_no_ready']);
			window.location = "login.html";	
			return;
		}
		if(responseData.result == "Error")
		{
			/*alert(global_lang['login1']['session-logout']);*/
			return ;
		} 
		if(responseData.result == "SUCCESS")
		{
			Session_inactivity_timeout = timeout;
			global_authDefaulTimeout = timeout;
			ui_config["login_timeout"] = timeout;	
		    var date = new Date();
		    date.setTime(date.getTime() + (Session_inactivity_timeout * 1000));
		    var expires = ";expires=" + date.toGMTString();                   
		    document.cookie ="DWRLOGGEDUSER="+"admin"+expires;
		    document.cookie ="DWRLOGGEDTIMEOUT="+Session_inactivity_timeout+expires;
			document.cookie ="DWRLOGGEDSESSION="+session_token+expires;
			alert(global_lang['login1']['update_session_time_ok']);
		}
		else
		{
			alert(global_lang['login1']['update_session_time_failed']);
		}		
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {    
		alert(global_lang['login1']['update_session_time_failed']);
    });
    request.always(function(responseData,textStatus, jqXHR ) {     
    });

}

function UpdateTimeout(timeout)
{
	var request = $.ajax(
	{
		type: "POST",
		url: "cgi-bin/qcmap_auth",
		data:
		{
			type: "timeupdate",
			timeout: timeout,
			token: session_token
		},
		dataType: "json"
	 });
	    	
    request.done(function( responseData,textStatus, jqXHR ) { 
		if(responseData.result== 3)
		{
		    alert(global_lang['login1']['login-fail']);
			window.location = "login.html";
			return;
		}
		if(responseData.result== 8 || responseData.result== 9 || responseData.result== 10 || responseData.result== 11 || responseData.result== 12 || responseData.result== 13)
		{				
			alert(global_lang['login1']['device_no_ready']);
			window.location = "login.html";	
			return;
		}
		if(responseData.result == "Error")
		{
			/*alert(global_lang['login1']['session-logout']);*/
			return ;
		}
		if(responseData.result == "0")
		{
			setAutoLogoutTime(timeout);
		}
		else
		{
			alert(global_lang['login1']['update_session_time_failed']);
		}
	});
    request.fail(function( jqXHR, textStatus, errorThrown) {    
		alert(global_lang['login1']['update_session_time_failed']);
    });
    request.always(function(responseData,textStatus, jqXHR ) {     
    });
}

function systemApi_accountSet(uname,pass,auto_timeout) {
			pass = encodeURIComponent(pass);
			uname = encodeURIComponent(uname);
			var request = $.ajax({
	        	type: "POST",
	        	url: "cgi-bin/qcmap_auth",

	        	data: 
				{
					type: "update",
					old_pwd: uname, 
					new_pwd: pass, 
					timeout: auto_timeout, 
					token: session_token
				},
	        	dataType: "text"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
				var obj = jQuery.parseJSON(responseData);
				if(obj.result== 3)
				{
				    alert(global_lang['login1']['login-fail']);
					window.location = "login.html";
					return;
				}
				if(obj.result== 8 || obj.result== 9 || obj.result== 10 || obj.result== 11 || obj.result== 12 || obj.result== 13)
				{				
					alert(global_lang['login1']['device_no_ready']);
					window.location = "login.html";	
					return;
				}
				if(obj.result== "5")
				{
					alert(global_lang['login1']['login-wrong-old']);
					return;
				}
				if(obj.result== "6")
				{
					alert(global_lang['login1']['login-new-form']);
					return;
				}
				if(obj.result == "Error")
				{
					/*alert(global_lang['login1']['session-logout']);*/
					return ;
				}
				if(obj.result == "0")
				{
					clearCookies();
					alert(global_lang['alerts_set']['account_save_success']);
					window.location = "login.html";
				}
				else
				{
					alert(global_lang['alerts_set']['change-passwd-failed']);
				}


			});
			request.fail(function( jqXHR, textStatus, errorThrown) { 
					//alert("try");
					});
			request.always(function(responseData,textStatus, jqXHR ) {	

					});
}


function systemApi_backUp() {

	var request = $.ajax({
    	type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
    	data: 
		{
			Page: "system_backup",
			mask: 0,
			token: session_token
		},
    	dataType: "json"
	});
	
	request.done(function( responseData,textStatus, jqXHR ) {   

		if(responseData.result == "SUCCESS")
		{
			alert(global_lang['alerts_set']['config_file_save']);
			window.location.href = responseData.path;
		}
		else
		{
			alert(global_lang['alerts_set']['config_save_error']);
		}
	});
    request.fail(function( jqXHR, textStatus, errorThrown) { 

    });
    request.always(function(responseData,textStatus, jqXHR ) {	
       
    });
}

function redirectTimeoutFn(path) {
    if (--window.redirectTimeoutVar <= 0) {
    	parent.location.href=path;
    } else {
      $("#reboot_timeout").html(window.redirectTimeoutVar);
    }
}

function defaultRedirect(timeout, path) {
	$.ajaxSetup({async:true});
	$("#tf1_Progressbar").show();
    window.redirectTimeoutVar = timeout;
	$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['rebooting_timeout']);
	$("#reboot_timeout").html(window.redirectTimeoutVar);
    setInterval("redirectTimeoutFn('" + path + "');", 1000);
}

function systemApi_reboot() {
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
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {				
    			clearCookies(); 
    			alert(global_lang['alerts_set']['restart_success']);
				var path = "login.html";
				defaultRedirect(90,path);
    			//window.location = "login.html";
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		    	//alert("Invalid");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}

function systemApi_resetTodefault() {
			var request = $.ajax({
				type: "POST",
				url: "cgi-bin/qcmap_web_cgi",
				data:
				{
					Page: "DoSystemReset",
					mask: 0,
					token: session_token
				},
	        	dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
		     	clearCookies();
				alert(global_lang['alerts_set']['restart_success']);
				var path = "login.html";
				defaultRedirect(90,path);
    			
    			//window.location = "login.html";
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		    	//console.log(jqXHR);
		     	clearCookies();
				alert(global_lang['alerts_set']['restart_success']);
				var path = "login.html";
				defaultRedirect(90,path);   			
    			//window.location = "login.html";
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}

function systemApi_UpnpSet(status) {
			var request = $.ajax({
	        type: "POST",
	        url: "cgi-bin/qcmap_web_cgi",
	        data: 
			{
				Page: "SetMediaSharingStatus",
				mask: 7,
				upnp_result: "0",
				upnp_enable: parseInt(status,10),
				token: session_token
			},
	        dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			alert(global_lang['alerts_set']['config_save_success']);
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		    	//alert("try");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
}

function system_api_firmware_manual() {

	$(".meter-status").removeClass("active");
	$("#tf1_manualSt_update").addClass("active");	
	$("#tf1_frm_statusBar span").width("99.8%");
	$("#tf1_frm_statusBar div.usageDisplay").html("");
	$("#tf1_btnManualStartUpdate").attr("disabled","disabled");
	$("#tf1_upgradeRouter").attr("disabled","disabled");
/*
	global_AuthTimeout = 179;
	global_authDefaulTimeout = ui_config["login_timeout"];
	global_firmwareUpgradeTimeoutHandler = setInterval(function(){ system_api_firmware_loop()},3000);	
*/
	$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['firmware_updating']);

	$.ajaxFileUpload
    (
    {
		type: "POST",
    	url:'cgi-bin/qcmap_web_upgrade',
    	secureuri:false,
    	fileElementId:'tf1_WebFUpload',
    	dataType: 'text',
    	success: function (data, status)
    	{
			var retOK = data.indexOf("OK");	
			if (retOK != -1)
			{	
				if (window.global_wanStatus_pollingTimer){clearTimeout(window.global_wanStatus_pollingTimer);}
				if (window.global_wifiClient_pollingTimer){clearTimeout(window.global_wifiClient_pollingTimer);}
				if (window.global_wan_pollingTimer){clearTimeout(window.global_wan_pollingTimer);}
				if (window.global_wan6_pollingTimer){clearTimeout(window.global_wan6_pollingTimer);}
				if (window.wan_connected_time_pollingTimer){clearTimeout(window.wan_connected_time_pollingTimer);}
				if (window.wan6_connected_time_pollingTimer){clearTimeout(window.wan6_connected_time_pollingTimer);}
				if (window.get_powersaving_pollingTimer){clearTimeout(window.get_powersaving_pollingTimer);}
				if (window.global_smslist_pollingTimer){clearTimeout(window.global_smslist_pollingTimer);}
				if (window.index_smsStoreStatus_pollingTimer){clearTimeout(window.index_smsStoreStatus_pollingTimer);}

				$("#tf1_frm_statusBar span").width("99.8%");
				wizard_reboot();
				$(".meter-status").removeClass("active");
				$("#tf1_manualSt_reboot").addClass("active");
				var path = "login.html";
				defaultRedirect(90,path);
				//$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['rebooting']);
				//setTimeout("upgradeReboot()",90000);
			}
			else
			{
				$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['firmware_upload_fai']);
			}
    	},
    	error: function (data, status, e)
    	{
    	alert(e);
    	}
    });

}


function system_api_firmware_loop() {
		/* Uploading in progress */
		width_perc = 10;
		$("#tf1_frm_statusBar span").width(width_perc+"%");
		$("#tf1_frm_statusBar div.usageDisplay").html(global_lang['system_popup']['firmware_updating']);
		$(".meter-status").removeClass("active");
		$("#tf1_manualSt_update").addClass("active");	
}
function upgradeReboot()
{
	window.location = 'login.html';	
}

function system_api_autoupgrade() {

			var post_data={"FileID": 4,"Firmware_Upgrade":{"auto_enable": 1},"authID":auth_id}; 
}

/**/
