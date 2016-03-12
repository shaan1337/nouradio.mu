var player;
var status='pause';
var host='www.nouradio.mu';
var player_container_hidden = true;
var quality = 'high';
var current_radio_id = 'radioplus';
var me_setup_failed = true;

function isLessAndroid3(){
	var userAgent = navigator.userAgent;
	if(userAgent.match(/Android/i)){
		var versionStrings = userAgent.match(/Android\s+([\d\.]+)/);
		if(!versionStrings || versionStrings.length<2) return false;
		var versionString = versionStrings[1];
		
		var version = "";
		for(var i=0;i<versionString.length && versionString[i]!='.';i++) version+=versionString[i];
		version = parseInt(version);
		if(version<3){
			return true;
		}
	}
	return false;
}

function isiOS(){
	var userAgent = navigator.userAgent;
	if(userAgent.match(/iphone|ipod|ipad/i)){
		return true;
	}
	
	return false;
}

function showRTSPLinks(){
}

function showRadioStations(){
	var duration = 300;
	var offset = 500;
	
	$(".container div").each(function(i) {
		$(this).delay( offset + i*(duration/2) ).animate({opacity: 1.0,marginTop:0}, duration);
	});
}

function startPlayer(callback){
	player = new MediaElement('me-player',
	{
		defaultVideoWidth: 0,
		defaultVideoHeight: 0,
		startVolume: 1.0,
		success: function(mediaElement,domObject){
			mediaElement.addEventListener('playing',function(e){
				var radio_name = $("#"+current_radio_id).attr("name");
				setPlayerStatus(['Playing now:',radio_name]);
			},false);
			
			mediaElement.addEventListener('waiting',function(e){
				setPlayerStatus(['Loading...']);
			},false);
			me_setup_failed = false;
			callback();
		},
		error: function(mediaElement){
			callback();
		}
	});
}

function setPlayerStatus(status){
	x = "";
	for(var i=0;i<status.length;i++){
		x += "<li>" + status[i] + "</li>";
	}
	
	$('.st_text').html(x);
}

function setPlayerIcon(hover){
	var elem = $("#play_button img");
	var btnimg;
	
	if(status=='play'){
		btnimg='pause';
	}
	else if(status=='pause'){
		btnimg='play';
	}
	
	if(hover){
		btnimg+='_hover.png';
	}
	else{
		btnimg+='.png';
	}
	
	elem.attr("src","img/buttons/"+btnimg);		
}

function setPlayerState(nstatus){
	status = nstatus;
	
	if(status=='play'){
		setPlayerStatus(['Loading...']);
	
		player.play();
		if(player_container_hidden){
			$(".player_container").show();
			setPlayerControls();
			setToggleButton();
			setStatusTicker();	

			var duration = 500;
			$(".player_container").animate({bottom: 0}, duration);
			$(".spacer").height("80");
			player_container_hidden = false;
		}
	}
	else if(status=='pause'){
		var radio_name = $("#"+current_radio_id).attr("name");	
		setPlayerStatus(['Paused',radio_name]);		
		player.pause();
	}
}

function setPlayerControls(){
	$("#play_button img").mouseenter(function(){
		setPlayerIcon(true);
	});
	
	$("#play_button img").mouseleave(function(){
		setPlayerIcon(false);
	});	
	
	$("#play_button").click(function(){
		var elem = $("#play_button img");
	
		if(status=='pause'){
			setPlayerState('play');
			setPlayerIcon(true);
		}
		else if(status=='play'){
			setPlayerState('pause');
			setPlayerIcon(true);
		}		
	});	
}

function playRadio(){
	var radio_id = current_radio_id;
	
	if(quality=='low') radio_id+='_low';
	var src = 'http://'+host+'/hls/'+radio_id+'.m3u8';
	player.setSrc(src);
	setPlayerState('play');
	setPlayerIcon(true);
}

function checkOffline(radio_id){
	if($('#'+radio_id).attr("status")=='offline'){
		alert('This radio is currently offline :( Please try again later.');
		return true;
	}
	
	return false;
}

function isDesktop(){
	return navigator.userAgent.match(/windows|linux|os\s+x\s*[\d\._]+|solaris|bsd/i) && !navigator.userAgent.match(/linux.*android|windows\s+(?:ce|phone)/i);
}

function setRadioStationClickEvents(){
	var type = '';
	
	if(isLessAndroid3()){
		type='rtsp';
	}
	else if(isiOS()){
		type='hls_link';
	}
	else if(me_setup_failed){
		type='hls_link';
		if(isDesktop()){
			alert('Hello! NouRadio.mu requires that flash player is installed on your PC to work properly. You will be redirected to the flash player website when you press OK.');
			setTimeout(function(){
				document.location.href="https://get.adobe.com/flashplayer/";
			},3000);
		}
		else{
			alert('Hello! Your browser might not be compatible with NouRadio.mu. To test it, please click on one of the radio icons. If it does not work, please try using the latest version of your phone\'s native web browser or Google Chrome for best results.');
		}
	}
	else{
		type='hls_web';
	}
	
	if(type=='rtsp'){
		$(".container div").each(function(i){
			$(this).click(function(){
				var radio_id = $(this).attr("id");
				if(checkOffline(radio_id)) return;
				var url = 'rtsp://'+host+'/'+radio_id+'.sdp';
				window.location.href = url;
			});
		});
	}
	else if(type=='hls_link'){
		$(".container div").each(function(i){
			$(this).click(function(){
				var radio_id = $(this).attr("id");
				if(checkOffline(radio_id)) return;				
				var url = 'http://'+host+'/hls/'+radio_id+'.m3u8';
				window.location.href = url;
			});
		});		
	}
	else if(type=='hls_web'){
		$(".container div").each(function(i){
			$(this).click(function(){
				var radio_id = $(this).attr("id");
				if(checkOffline(radio_id)) return;				
				current_radio_id = radio_id;
				playRadio();
			});
		});
	}
}

function switchQuality(nquality){
	if(nquality == quality) return;
	quality = nquality;
	playRadio();
}

function setToggleButton(){
	$('.toggle').toggles({
	  drag: false,
	  click: true,
	  text: {
		on: 'HI',
		off: 'LO'
	  },
	  on: true,
	  animate: 250,
	  transition: 'swing',
	  checkbox: null,
	  clicker: null,
	  width: 50,
	  height: 20,
	  type: 'select'
	});
	
	$('.toggle').click(function(){
		if($('.toggle-on').hasClass("active")){
			switchQuality('high');
		}
		else{
			switchQuality('low');
		}		
	});
}

function setStatusTicker(){
	$("#webticker").webTicker();
}

function getNumViewers(){
	$.get( "status", function( data ) {
		var obj = JSON.parse(data);
		
		if(obj.num_connections==1){
			$('.viewers').html('1 user online.');		
		}
		else{
			$('.viewers').html(obj.num_connections+' users online.');				
		}
		
		var status = obj.status;
		for(var radio in status){
			if(status[radio]==0){
				$('#'+radio+' img').attr('src','img/icons/'+radio+'_offline.png');
				$('#'+radio).attr('status','offline');
			}
			else if(status[radio]==1){
				$('#'+radio+' img').attr('src','img/icons/'+radio+'.png');
				$('#'+radio).attr('status','online');				
			}
		}
	});
}

function getNumViewersAjax(){
	getNumViewers();
	setInterval(function(){
		getNumViewers();
	}, 15000);
}

$(document).ready(function() {
	async.series([
		startPlayer,
		setRadioStationClickEvents
	],function(err,results){
		console.log('An error has occured.');
	});

	getNumViewersAjax();	
	showRadioStations();
});