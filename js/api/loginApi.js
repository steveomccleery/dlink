/* jqXHR object has following properties or keys

--------------
    readyState
    status
    statusText
    responseXML and/or responseText when the underlying request responded with xml and/or text, respectively
    setRequestHeader(name, value) 
    which departs from the standard by replacing the old value with the new one rather 
    than concatenating the new value to the old one
    getAllResponseHeaders()
    getResponseHeader()
    statusCode()
    abort()
--------------

*/
var auth_id; 
var Session_inactivity_timeout = 300;
function loginApi_login(uname,passwd) {
	
    passwd = encodeURIComponent(passwd);
    var request = $.ajax({
        url: "cgi-bin/qcmap_auth",
        type: "POST",
		data:
		{
			type: "login",
			pwd : passwd,
			timeout : Session_inactivity_timeout,
			user : uname
		},
        dataType: "json"
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
		if (responseData.result == 0 || responseData.result == 2)
		{   
            var date = new Date();
            date.setTime(date.getTime() + (parseInt(responseData.timeout) * 1000));
            var expires = "";                  
            document.cookie ="DWRLOGGEDUSER="+uname+expires;
            document.cookie ="DWRLOGGEDTIMEOUT="+parseInt(responseData.timeout)+expires;
			document.cookie ="DWRLOGGEDSESSION="+responseData.token+expires;
            window.location = "index.html";
            return;
		}
		else if(responseData.result == 1)
		{
			dialogAlert(global_lang["login1"]["configured-ip"]+ responseData.ip + global_lang["login1"]["wait-sometimes"]);	
		}
		else if(responseData.result == 3)
		{
			dialogAlert(global_lang["login1"]["faild-password"]);
		}
		else if(responseData.result== 8 || responseData.result== 9 || responseData.result== 10 || responseData.result== 11 || responseData.result== 12 || responseData.result== 13)
		{
			dialogAlert(global_lang["login1"]["bad-state"]);	
			return;
		}
		else if(responseData.result == 7)
		{
			dialogAlert(global_lang["login1"]["faild-user"]);
		}
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {
		dialogAlert(global_lang["login1"]["login-failed"]);     
    });
    request.always(function(responseData,textStatus, jqXHR ) {     
    });
}

function loginApi_timeout_start() { 
	$("#timer").html(global_AuthTimeout + "||" + global_authDefaulTimeout);
	if(Session_inactivity_timeout == 0 )
		return;
	if(idleTime == 0)
	{
        var date = new Date();
        date.setTime(date.getTime() + (Session_inactivity_timeout * 1000));
        var expires = ";expires=" + date.toGMTString();                   
        document.cookie ="DWRLOGGEDUSER="+"admin"+expires;
        document.cookie ="DWRLOGGEDTIMEOUT="+Session_inactivity_timeout+expires;
		document.cookie ="DWRLOGGEDSESSION="+session_token+expires;
	}
	idleTime = idleTime + 1;
	/*if (idleTime > ((Session_inactivity_timeout/60)-1))
	{	
        clearInterval(global_AuthTimeoutHandler);
        clearCookies();
		var request = $.ajax(
		{
			type: "POST",
			url: "cgi-bin/qcmap_auth",
			data:
			{
				type: "close",
				timeout: Session_inactivity_timeout
			 },
			dataType: "text"
		});
        alert(global_lang['login1']['session-logout']);
        window.location = "login.html";
        return;        
    }*/
}

function clearCookies() {

     clearInterval(global_AuthTimeoutHandler);
     clearInterval(global_up5sTimeoutHandler);
     clearInterval(global_nwUsageTimeoutHandler);
     document.cookie ="DWRLOGGEDUSER=;expires=Thu, 01-Jan-70 00:00:00 GMT;";
     document.cookie ="DWRLOGGEDTIMEOUT=;expires=Thu, 01-Jan-70 00:00:00 GMT;";

}

function loginApi_logout() {

    var conf = confirm(global_lang["login1"]["logout_alert"]);
	var timeout_update = ui_config["login_timeout"];
    if (conf) {
         var request = $.ajax({
            url: "cgi-bin/qcmap_auth",
            type: "POST",
			data:
			{
				type: "close",
				timeout: timeout_update
			},
            dataType: "json"
        });
       
       clearCookies();          
       window.location = "login.html";        
    }

}

function loginApi_check_auth() {
    if (getCookie("DWRLOGGEDUSER") == null ) {
       
       // alert(global_lang['login1']['session-logout']);
        window.location = "login.html";
        return;
    } else {
		update_timeout = Session_inactivity_timeout;
		var date = new Date();
		date.setTime(date.getTime() + (update_timeout * 1000));
		var expires = ";expires=" + date.toGMTString();
		document.cookie ="DWRLOGGEDTIMEOUT="+update_timeout+expires;
		global_AuthTimeout = update_timeout; 
		global_authDefaulTimeout = ui_config["login_timeout"];
		$("#all").show();
  }
}


function loginApi_check_auth_reset() {

    if (getCookie("DWRLOGGEDUSER") == null ) {
       
       /* alert(global_lang['login1']['session-logout']);*/
        window.location = "login.html";
        return;
    } else {
            /* ReSet the timeout cookie as per latest timeout 
               Note: This happens when you refresh the control panel page and we need to revaidate the cookie            
            */
			update_timeout = Session_inactivity_timeout;
            var date = new Date();
            date.setTime(date.getTime() + (update_timeout * 1000));
            var expires = ";expires=" + date.toGMTString();
            document.cookie ="DWRLOGGEDTIMEOUT="+update_timeout+expires;
            global_AuthTimeout = global_authDefaulTimeout;
  }
}

