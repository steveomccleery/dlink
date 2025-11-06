
var global_macWhiteFilterlen;

var global_macBlackFilterlen;

 ui_config.Dyn_Status["mac_filter"]  = new Object();
 ui_config.Dyn_Status["mac_filter"]["entries"]  = new Array();
 var old_list = new Array();
function wifi_clients_get() {

	var request = $.ajax({
        url: "cgi-bin/qcmap_web_cgi",        
        dataType: "text",
	async: global_cploaded
    });
    request.done(function( responseData,textStatus, jqXHR ) {
    	ui_config["wi-fi_clients"] = responseData;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function wifi_clients_get2() {

	var request = $.ajax({
		type: "POST",
		url: "cgi-bin/qcmap_web_cgi",
		data:
		{
			Page: "GetWiFiClients",
			token: session_token
		},
		dataType: "text",
		
    });
    request.done(function( responseData,textStatus, jqXHR ) {

    	ui_config["wi-fi_clients"] = responseData;
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function wifi_status_get() {
	var request = $.ajax({
        url: "cgi-bin/qcmap_web_cgi",        
        dataType: "text",
		async: global_cploaded
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
        	ui_config["wi-fi_status"] = responseData;
		    ui_config["wi-fi_wps_status"] = responseData["wps"];
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function wifi_status_get2() {
	var request = $.ajax({
        url: "cgi-bin/qcmap_web_cgi",        
        dataType: "text"		
    });
    request.done(function( responseData,textStatus, jqXHR ) {  
        	ui_config["wi-fi_status"] = responseData;
		    ui_config["wi-fi_wps_status"] = responseData["wps"];
    });
    request.fail(function( jqXHR, textStatus, errorThrown) {	 
    });
    request.always(function(responseData,textStatus, jqXHR ) {       
    });
}

function wifi_api_getDetails() {
	var request = $.ajax({
			type: "POST",
			url: "cgi-bin/qcmap_web_cgi",
			data:
			{
				Page: "GetMacFilter",
				mask: "0",
				token: session_token
			},
			dataType: "text"
    });
    
    request.done(function(responseData,textStatus, jqXHR ) {
	var obj = removeInvalidChar(responseData);
	obj = jQuery.parseJSON(obj);		
        ui_config.Dyn_Status["mac_filter"] = obj;	

    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });
}

function wifi_macTemplate() {   
    var startIndex = 0;
    var newIndex =0; 
    var mac_data = new Array();
    old_list=new Array();
	         	$.each(ui_config.Dyn_Status["mac_filter"]["entries"],function(key,value) {
			    mac_data[newIndex] = value;
				old_list[newIndex]=value;
			    newIndex = newIndex + 1;
		      });					
		
    var tmpl_mac_data = {
	"macFilter_Mode":ui_config.Dyn_Status["mac_filter"]["macFilter_Mode"],
	"mac_data":mac_data
	};
    var pagefn = doT.template(document.getElementById('tf1_script_macTemplate').text); 
    $("#tf1_macTemplate").html(pagefn(tmpl_mac_data));
}

function wifi_onloadMacFilter() {
  
       wifi_api_getDetails();
//   doGetMacFilter();
    wifi_macTemplate();
	if(old_list.length > 0)
	datatable("tf1_wifiMacBlackFilterTbl");
	
	$("#tf1_btn_macFilter").val(global_lang['common']['apply']);
	
	onloadCall(wifi_onloadMacFilterToggle, {
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
	
	enableTextFieldByAnchorClick('tf1_macFilterMode', '','','tf1_MacFilterBlock'); 
}


function wifi_onloadMacFilterToggle(toggleObj, thisObj) {
	onAnchorToggle(toggleObj);
	var imgId = thisObj.id;
	switch(imgId) {
		case 'tf1_macFilterMode':
			enableTextFieldByAnchorClick('tf1_macFilterMode', '','','tf1_MacFilterBlock');
		break;	 

	}
}

function wifi_macFilterReset(frmId) {
    $("#" + frmId).reset();
   	resetImgOnOff(frmId);  

}

function wifi_macFilter_addFormReset(){
	$("#tf1_macAddress").val("");
}


function wifi_showCurrentList() {

    var selFilter = radioCheckedValueGet('tf1_macFmethod');

    if (selFilter == "o") {
         $("#tf1_wifiMacBlackFilterTbl").hide();
         $("#tf1_wifiMacWhiteFilterTbl").show();
         if (global_macWhiteFilterlen > 0 ){
            datatable('tf1_wifiMacWhiteFilterTbl');
            }
         $("#tf1_currentFilterCounter").html("Current White List ( " +global_macWhiteFilterlen+" / 10 )");

    } else {
        $("#tf1_wifiMacWhiteFilterTbl").hide();
         $("#tf1_wifiMacBlackFilterTbl").show();
         
         if (global_macBlackFilterlen > 0 ){
        datatable('tf1_wifiMacBlackFilterTbl');
        }
        $("#tf1_currentFilterCounter").html("Current Black List (  " +global_macBlackFilterlen+" / 10 )");
    }

}



function wifi_api_addMac() {

//	alert("wifi_api_addMac");
	var mac_list1='';
	for(var i = 0;i < old_list.length;i++)
	{
		mac_list1 = mac_list1+"Y,x_mac"+i+","+ old_list[i].macFilter_MAC+";";	
		//mac_list1.push(";");
	}
	var mac_list2=mac_list1.split(";");
	var mac_list2_address;
	var mac_list3=[];
	var re = false;
	for (var j = 0; j < mac_list2.length-1;j++){
		mac_list2_address = mac_list2[j].split(",");
		mac_list3.push(mac_list2_address[2]);
	}
	for (var k = 0; k < mac_list3.length;k++){
		if($("#tf1_macAddress").val() == mac_list3[k]){
			re = true;
			break;
		}		
	}
	if(re){
		alert(global_lang['alerts_set']['mac_add_repeat']);
		return;
	}
	mac_list1=mac_list1+"Y,x_mac"+old_list.length+","+$("#tf1_macAddress").val()+";";
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
         alert(global_lang['alerts_set']['mac_add_success']);
		 $("#tf1_btn_macFilterAdd").val(global_lang['common']['apply']);
		 wifi_onloadMacFilter();
		 $(".configForm").show();
	     $(".configTableForm").hide();

			wifi_showCurrentList();		 
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
           
    });
    request.always(function(responseData,textStatus, jqXHR ) {
            
    });

}

function wifi_macFilterValidate(frmId) {

	 $("#tf1_showPleaseWait").show();

       var  mac_list1='';
	   var filter_mode;
	   var idx = 0;
	       /* Update even the Mode */
	if ($("#tf1_macFilterMode").attr("class") == "enable-disable-on" ) {
		
		var filter_mode = 2;
		
	} else {
		
		var filter_mode = 1;
	}

       $(".chkBlack").each(function( ) {
          if ($(this).is(":checked")) {          
          }
		  else
		  {
			mac_list1 = mac_list1+"Y,x_mac"+idx+","+ $(this).attr("chk-id")+";" ;	
			idx ++;	  	
		  }
       });
		var request = $.ajax({
			url: "cgi-bin/qcmap_web_cgi",
			type: "POST",		
			data:
			{ 
				Page: "SetMacFilter",
				mask: "0",
				filter_mode: filter_mode,
				filter_list: mac_list1,
				token: session_token
			},
			dataType: "text"
		});
            
		request.done(function(responseData,textStatus, jqXHR ) {
			$("#tf1_showPleaseWait").hide();
			alert(global_lang['alerts_set']['mac_update_success']);
			wifi_onloadMacFilter();
			if(filter_mode == 1)
				HideDialog('tf1_dialog', 'tf1_overlay');

		});
		request.fail(function(jqXHR, textStatus, errorThrown) {
			   
		});
		request.always(function(responseData,textStatus, jqXHR ) {
				
		});
}



function wifi_api_usePinMode() {
		
	var pinMode = 0;	
	
	if ($("#tf1_wifiEnablePin").attr("class") == "enable-disable-on") {
		pinMode = 2;
	}
	else
		pinMode = 1;
	
	var request = $.ajax({
            type: "POST",
            url: "cgi-bin/qcmap_web_cgi",
            data: 
			{
				Page: "SetWPSInfo",
				mask: 0,
				wps_type: pinMode,
				wps_role: 0,
				wps_ap_pin: "",
				wps_enrollee_pin: "",
				wps_WscConfStatus: ui_config["wps_info"]["wps_enable"],
				token: session_token
			},
            dataType: "json"
            });
            
            request.done(function( responseData,textStatus, jqXHR ) {     
			ui_config["wps_info"]["wps_type"] = pinMode ;                      
            
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
              //  alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });
	
	
	
}

function wifiApi_stopwps() {

            /* Get auth Id */


            var request = $.ajax({
            url: "/cgi-bin/qcmap_web_cgi",
            type: "POST",
            data: JSON.stringify(post_data),
            dataType: "json"
            });
            
            request.done(function( responseData,textStatus, jqXHR ) {    
                              
            
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
                //alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });

}

function wifiApi_startPBC(callback) {

            /* Get auth Id */
            var ap_pin = $("#tf1_enterPin").val();
            var request = $.ajax({
            url: "cgi-bin/qcmap_web_cgi",
            type: "POST",         
            data: {
			Page: "SetWPSInfo",
			mask: "0",
			wps_type: 1,
			wps_role : 0,
			wps_ap_pin : ap_pin,
			wps_enrollee_pin : 0,
			wps_WscConfStatus : 2,
			token: session_token
		   },          
            dataType: "text"
            });
		
            request.done(function( responseData,textStatus, jqXHR ) {
				//console.log(responseData);
				var obj = jQuery.parseJSON(responseData);
				if (obj.result == "Fail")
				{
					dialogAlert(global_lang['common']['please_wait']);
					return -1;
				}
				callback();				
				wps_start = 1;
				ui_config["wps_info"]["wps_type"] = 1 ; 
				wifi_api_loop();
				global_wifiPbcPinTimeoutHandler = setInterval(function(){ wifi_api_loop()},3000);                    
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });
}



function wifi_api_loop() {	
	if (con_timer  >= 120) {		
		wps_start = 0;
		con_timer=3;
		clearInterval(global_wifiPbcPinTimeoutHandler);
		global_wifiPbcPinTimeoutHandler = false;		
		wifi_onloadWps();
		alert(global_lang['wifi_popup']['wps_connect_failed']);
	} else {
		wps_start = 1;
		if ($("#tf1_wps_statusMeter").length > 0) {
			con_timer = con_timer+3; 
			width_perc = (con_timer/120)*100;
			width_perc = Math.round(width_perc);
			
			$("#tf1_wps_statusMeter").width(width_perc+"%");
			$(".usageDisplay").html(global_lang['wifi_popup']['searching_incoming_clients']);		
		}
		getWPSStatus();	
	}
}

function wifiApi_startPin(modest,pinno,callback) {

           var request = $.ajax({
            	url: "cgi-bin/qcmap_web_cgi",
            	type: "POST",         
            	data: {
					Page: "SetWPSInfo",
					mask: "0",
					wps_type: 2,
					wps_role : 0,
					wps_ap_pin : pinno,
					wps_enrollee_pin : "",
					wps_WscConfStatus : ui_config["wps_info"]["wps_enable"],
					token: session_token
		   		},          
            	dataType: "text"
            });
                     
            request.done(function( responseData,textStatus, jqXHR ) { 
				var obj = jQuery.parseJSON(responseData);
				if (obj.result == "Fail")
				{
					dialogAlert(global_lang['common']['please_wait']);
					return;
				}
				callback();
				wps_start = 1;
				ui_config["wps_info"]["wps_type"] = 2 ; 
				wifi_api_loop();
				global_wifiPbcPinTimeoutHandler = setInterval(function(){ wifi_api_loop()},3000);            
            
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
                //alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });
			
			
}




function wifiApi_enrollPin_set(enrollpinno) {

            var post_data={"enrollee_pin":enrollpinno,"CfgType":"wps","authID":auth_id};  
           

            var request = $.ajax({
            url: "/cgi-bin/qcmap_web_cgi",
            type: "POST",
            data: JSON.stringify(post_data),
            dataType: "json"
            });
            
            request.done(function( responseData,textStatus, jqXHR ) {   
                alert(global_lang['alerts_set']['enroll_pin_success']);                 
                wifi_generate_wpspin();
            });
            request.fail(function( jqXHR, textStatus, errorThrown) { 
                //alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });
}



function wifiApi_wifimode_set() {

            /* Get auth Id */

			var wifi_turnOnOffSt = parseInt($("#tf1_wifiEnable2point4GhValue").val(),10);
			
			 
		    
            var post_data={"apsta_turnon":wifi_turnOnOffSt,"CfgType":"set_apsta_onoff","authID":auth_id};  
           

            var request = $.ajax({
            url: "/cgi-bin/qcmap_web_cgi",
            type: "POST",
            data: JSON.stringify(post_data),
            dataType: "json"
            });
            
            request.done(function( responseData,textStatus, jqXHR ) {   
            	alert(global_lang['alerts_set']['config_save_success']);
			});
            request.fail(function( jqXHR, textStatus, errorThrown) { 
               // alert("Invalid");
            });
            request.always(function(responseData,textStatus, jqXHR ) {  
               
            });
}


function wpa2_key_get(){

		var post_data= {"cmd":"random_wpa2key","CfgType":"wifi_genkey","authID":auth_id} 
		var request = $.ajax({
	        url: "/cgi-bin/qcmap_web_cgi",
	        type: "POST",
	        data: JSON.stringify(post_data),
	        dataType: "json"
	    	});
	    	
    		request.done(function( responseData,textStatus, jqXHR ) {    
    			
    		});
		    request.fail(function( jqXHR, textStatus, errorThrown) { 
		    	//alert("Invalid");
		    });
		    request.always(function(responseData,textStatus, jqXHR ) {	
		       
		    });
		
		var request = $.ajax({
	    url: "/cgi-bin/qcmap_web_cgi",      
        dataType: "json"
		});
		request.done(function( responseData,textStatus, jqXHR ) {  
			document.getElementById("tf1_preSharedkey").value = responseData.key;	 
		});
		request.fail(function( jqXHR, textStatus, errorThrown) {	
		});
		request.always(function(responseData,textStatus, jqXHR ) {       
		});
		

}
