/* Global variables */ 
var GLOBALS = {
    lang: 'en',
    update_url: 'about:blank',
    use_torrent: true,
    torrent_port: 6800,
	langs_count: 0
};

/* ---- Set globals routine ----*/
function setUpdateURL(szURL)            { GLOBALS.update_url = szURL.replace(/[\/\\]$/g, ''); }
function setOptionsUseTorrent( bUse )   { GLOBALS.use_torrent = true; if (bUse != "TRUE") GLOBALS.use_torrent = false; }
function setOptionsTorrentPort( nPort ) { GLOBALS.torrent_port = nPort; }

/*-------  Set progress bar position (value: [0,100] )---*/
function setProgress(dwProgress, szStats)
{
	progress = Math.min(Math.max((0 + dwProgress), 0), 100);
	val = "" + progress + "%";
	if (val != $('#windowProgressBar-active').css('width'))
		$('#windowProgressBar-active').css("width", val);
		
	if (szStats != $('#windowProgressBarStats').html())
		$('#windowProgressBarStats').html(szStats);
}
/*-------  Set status message ---*/
function setStatusMsg(szMsg, nStatusType)
{
	$('#windowProgressBarStatus').html(szMsg);
	$('#windowProgressBarStatus').attr('class', nStatusType);
}
/* --- Set current operation statis Icon ---- */
function setStatusIcon(nIcon)
{
	$('#windowStatusIcon').attr('class', nIcon);
}
/*-------  Set server status Online/Offline ---*/
function setServerStatus(val)
{
    $('.wot_server_status').hide();

	if (val == 1) 
		$('.wot_server_status.online').show();
	else
		$('.wot_server_status.offline').show();

}
/* --- Button state ----*/
function setMainButton(nType)
{
	$('.windowMainButton').hide();
	$('#mainBtn_' + String(nType)).show();
}
/* ---- Append language to list ----*/
function AppendLang(szLangID)
{
	GLOBALS.langs_count += 1;
	$('#id_lang_' + szLangID).show();
	if (GLOBALS.langs_count > 1) 
	{
		$('.lang-menu').show();
	}
}
/* ---- Set active language ----*/
function SelectLang(szLandID, bSilent)
{
    GLOBALS.lang = szLandID;

    var lang_item = $('#id_lang_'+szLandID);
    if (!lang_item.length)
        return;

    $('#id_lang_active').attr('src', $('img', lang_item).attr('src'));

	if (bSilent != "TRUE")
	{
		cmd_onSelectLang(szLandID);
	}
}
/* ---- Get localized string from main html ----*/
function getLocalized(szContextID)
{
    var tag = $('#id_localize_'+szContextID);
    if (tag.length)
        return tag.text();
    else
        return szContextID;
}

/* ---- Show Message box ----*/
function ShowMessageBox(szTitle, szWhat, nType)
{
    var MBF_OK             = 0x0001;
    var MBF_OKCANCEL       = 0x0002;
    var MBF_ICONQUESTION   = 0x0100;
    var MBF_ICONERROR      = 0x0200;

	var msg_box = $("#id_message_box").clone();
    $(".ui-text", msg_box).html(szWhat);
    
    var buttons = {};
    buttons[getLocalized('BtnOk')] = function() { $(this).dialog("close"); };

    if (nType & MBF_OKCANCEL)
        alert('not realized yet');
        
    if (nType & MBF_ICONQUESTION)
       $('.ui-icon', msg_box).addClass('ui-icon-question'); 

    if (nType & MBF_ICONERROR)
       $('.ui-icon', msg_box).addClass('ui-icon-error'); 

	msg_box.dialog( { 
		title: szTitle,
		closeText: '',
		modal: true,
		resizable: false,
		stack: false,
		width: 350,
//		minHeight: 300,
		closeOnEscape: true,
		buttons: buttons
	} );

}
/* Show Options dialog */ 
function ShowOptions()
{
    var dlg = $('#id_options_dialog').clone();
    var title = $('h1', dlg).remove().text();

    var use_torrent = $('#id_options_use_torrent', dlg);
    var torrent_port = $('#id_options_torrent_port', dlg);

    if (GLOBALS.use_torrent)
        use_torrent.addClass('checked');
    else
        use_torrent.removeClass('checked');

    torrent_port.val(GLOBALS.torrent_port);

    $('#id_options_use_torrent', dlg).parent().click(function() {
        var check = $('#id_options_use_torrent', $(this));
        if (check.hasClass('checked'))
            check.removeClass('checked');
        else
            check.addClass('checked');
    });

    var buttons = {};
    buttons[getLocalized('BtnOk')] = function() { 
      	doCMD({ cmd: "PCMD_ON_CHANGE_OPTIONS", 
                use_torrent: $('#id_options_use_torrent', this).hasClass('checked'), 
                torrent_port: $('#id_options_torrent_port', this).val() });
        $(this).remove();
    };
    buttons[getLocalized('BtnCancel')] = function() { $(this).remove(); }

   	dlg.dialog({
        title: title,
		resizable: false,
		stack: false,
		modal: true,
        closeText: '',
        closeOnEscape: true,
        buttons: buttons
    });
}
/* Show launcher restarting message */ 
function ShowRestartMsg()
{
    var dlg = $('#id_restart_msg').clone();

   	dlg.dialog({
        title: '',
		resizable: false,
		stack: false,
		modal: true,
        closeText: '',
        closeOnEscape: false,
        buttons: {}
    });
}
// bind event handlers for language popup
function BindLanguageHandlers()
{
    $(".lang-menu .active").live('click', function() {
        $("#id_lang_popup").slideToggle('fast');
    });

    $("body").live('click', function() {
        $("#id_lang_popup").hide();
    })

    $("#id_lang_popup li").hide().live('click', function() {
        
        var lang_id = $(this).attr('id'); //expected string like "id_lang_ru"
        var lang = lang_id.substr(lang_id.length-2);
        if (lang.length)
            SelectLang(lang, false);

        $("#id_lang_popup").slideToggle('fast');
    });
}

/* Open external url depend on current language */
function RedirectTo(target)
{
    cmd_onNavigate(GLOBALS.update_url + '/redirect?target='+target + '&lang=' +GLOBALS.lang);
}
/* ---- Form processing  ----*/
function isDebug() { return (document.location.hash); }
function addForm(szForm, szAction, szMethod)
{
	if (document.forms[szForm]) return;
	document.body.innerHTML += "<form action='" + szAction + "' method='" + szMethod + "' name='" + szForm + "'></form>";
}
function addParamToForm(szForm, szParam, szVal)
{
	document.forms[szForm].innerHTML += "<input type='hidden' name='" + szParam + "' value='" + szVal + "'>";
}
function clearForm(szForm) { document.forms[szForm].innerHTML = ""; }
function submitForm(szForm)
{
	if (isDebug()) return;
	document.forms[szForm].submit();
}

var sCmdFormName = "cmd_form";
var sCmdFormAction = "wot_launcher:";
var sCmdFormMethod = "post";
function doCMD(parameters)
{
	addForm(sCmdFormName, sCmdFormAction, sCmdFormMethod);
	for (var param in parameters)
	{
		addParamToForm(sCmdFormName, param, parameters[param]);
	}
	submitForm(sCmdFormName);
	clearForm(sCmdFormName);
}
function cmd_onMinimize()
{
	doCMD({ cmd: "PCMD_ON_MINIMIZE" });
}
function cmd_onExit()
{
	doCMD({ cmd: "PCMD_ON_EXIT" });
}
function cmd_onContinue()
{
	doCMD({ cmd: "PCMD_ON_CONTINUE" });
}
function cmd_onCancel()
{
	doCMD({ cmd: "PCMD_ON_CANCEL" });
}
function cmd_onPlay()
{
	doCMD({ cmd: "PCMD_ON_PLAY" });
}
function cmd_onStartDrag(wX, wY)
{
	doCMD({ cmd: "PCMD_ON_STARTDRAG", x: wX, y: wY });
}
function cmd_onSelectLang(lang_id)
{
	//??? show message box to ask for changing
	doCMD({ cmd: "PCMD_ON_CHANGE_LANG", lang: lang_id });
}
function cmd_onLoadLauncher()
{
	doCMD({ cmd: "PCMD_ON_LOAD_LAUNCHER" });
}
function cmd_onNavigate(szURI)
{
	if (isDebug())
	{
		window.open(szURI, "wnd_debug");
	}
	else
	{
		doCMD({ cmd: "PCMD_ON_OPEN_URI", uri: szURI });
	}
}
function cmd_onNavigateLocal(szFile)
{
	if (isDebug())
	{
		window.open(szFile, "wnd_debug");
	}
	else
	{
		doCMD({ cmd: "PCMD_ON_OPEN_LOCAL_URI", file: szFile });
	}
}
function cmd_onMailTo(szAddr)
{
	doCMD({ cmd: "PCMD_ON_MAILTO", addr: szAddr });
}

/* ---- Document events  ----*/
function onLoad()
{
    //Play via ENTER
    $('body').live('keydown', function(event) {
        if (event.keyCode != 13)
            return;

        if ($('.ui-widget-overlay').length) //any dialog found
            return;
        
        if ($('#mainBtn_PLAY').is(':hidden')) //no play button available
            return;

        cmd_onPlay();
    })

    //Disable all "native" anchors 
    $('a').live('click', function(event) {
        event.cancelBubble = true;
	    if (event.stopPropagation) event.stopPropagation();
        return false;
    });

	setProgress(0, '');
	setStatusMsg('', 'NORMAL');
	setStatusIcon('WAITING_ICON');
	setServerStatus(1);
	setMainButton('CANCEL');
        
    BindLanguageHandlers();

	cmd_onLoadLauncher();
    

	if (isDebug())
	{
		loadContent();
	}
}
function onStartDrag(ev)
{
	ev = ev || window.event;
	cmd_onStartDrag(ev.x, ev.y);
}

/*-------  Load external dynamic content ---*/
function loadContent(szUrl)
{   
	if (!szUrl)
	{
    	szUrl = unescape(document.location.hash.slice(1));
        szUrl += (szUrl.indexOf('?') < 0 ? '?' : '&') + 'rnd=' + Math.random();
	}

	$("#dynamicContent").load(szUrl, '', function(responseText, textStatus, XMLHttpRequest) {
    
        //checking for valid content
        if (responseText.indexOf('b-dinamic-background') < 0)
            textStatus = 'InvalidContent';

		if (textStatus != "success") 
        {
            $('#staticContent .loader').fadeOut(200);
            $('#staticContent .error').fadeIn(500);
            return;
        }

		$("#staticContent").fadeOut(750);
	});
}