/*piano.js build piano gui, and handles playing piano audio*/
var pianoLoaded=false;
var whiteNoteDictionary=["C","D","E","F","G","A","B"];
var blackNoteDictionary=["Db","Eb","Gb","Ab","Bb"];
Piano=function()
{
midiNumber:0;
this.loaded=false;
}
Piano.prototype.build=function(tab)
{
	$("."+tab).append("<div id='"+tab+"pianoBody'></div>");
	//$("#pianoBody").append("<div id='pianoSounds' style='display:none;'></div>");
	$("#content_container").mouseup(keymouseup);
	this.buildOctaves(tab);
	
}//end buildPiano
Piano.prototype.addSound=function(keyid)
{
	//add white keys

	//$("#pianoSounds").append("<audio preload='auto' id='"+keyid+"_sound' controls><source src='sondfonts/acoustic_grand_piano-mp3/"+keyid+".mp3' type='audio/mpeg'></audio>");
//console.log("trying to play: "+keyid);
	$("#"+keyid).mousedown([keyid,this],this.keymousedown);
	$("#"+keyid).mouseenter([keyid,this],this.keymouseenter);
	$("#"+keyid).mouseout([keyid,this],this.keymouseout);
	//$("#"+keyid).on("tap",[keyid,this],tap);
	
	//$("#"+keyid+"_sound").on("ended",[keyid],noteEnded);
	

	
}
function tap(event)
{
	alert("tapped"+event.data[0]);
}
function keymouseup(event)
{
	mouseDown=false;
	//var id=event.data[0];
	
	$(".keyWhite").css("background", "");
	$(".keyBlack").css("background", "");
}
Piano.prototype.keymousedown=function(event)
{
	mouseDown=true;
	//alert("playing: "+event.data[0]);
	var keyid=event.data[0];
	$("#"+keyid).css("background", song.tracks[parseInt(event.data[0].charAt(0))-1].color);
	event.data[1].playNote(keyid);
}
Piano.prototype.keymouseenter=function(event)
{

	if(mouseDown)
	{
			
		event.data[1].playNote(event.data[0]);
	$("#"+event.data[0]).css("background", song.tracks[parseInt(event.data[0].charAt(0))-1].color);
	}
}
Piano.prototype.keymouseout=function(event)
{
if(mouseDown)
	{
		var keyid=event.data[0];
	$("#"+keyid).css("background", "");
	}
}

Piano.prototype.loadSound=function()
{MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: "acoustic_grand_piano",
		callback: function() {
			pianoLoaded=true;
			//alert("pianoLoaded");
			
		}
	});
	}
Piano.prototype.playNote=function(trackkeyid)
{
	var keyid=trackkeyid.substring(1);
	var trackNum=parseInt(trackkeyid.charAt(0))-1;
	var note=MIDI.keyToNote[keyid];
	song.tracks[trackNum].notePlayed(keyid);
//console.log("playing: "+note);
var delay = 0; 

			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
	
	/*var sound= document.getElementById(keyid+"_sound");
	sound.pause();
	if(sound.currentTime!=0)
	{
//console.log("currentTime: "+sound.currentTime);
	currentTime=sound.currentTime;
	if(recording)
	$("#"+keyid+"_sound").trigger("ended",[keyid]);
	sound.currentTime=0;	
	}
	sound.play();*/

	
}
Piano.prototype.buildOctaves=function(tab)
{ 
 for(j=0;j<9;j++)
 {	
 var octaveid=tab+"o"+j;

 $("#"+tab+"pianoBody").append("<div id="+octaveid+" class='octave'></div>")
 $("#"+tab+"pianoBody").addClass("pianoBody");
	if(j===0)
	{
		this.addWhiteKeys(octaveid,j,2,50,tab.charAt(5));
		this.addBlackKey(octaveid,tab.charAt(5)+"Bb0",25,35.16)
		//$("#"+octaveid).removeClass("octave");
		$("#"+octaveid).css({"width":"3.846%"});
		
	}
	else if(j===8)
	{
		this.addWhiteKeys(octaveid,j,1,100,tab.charAt(5));
		//$("#"+octaveid).removeClass("octave");
		$("#"+octaveid).css({"width":"1.923%"});
		
	}
	else
	{
		this.addWhiteKeys(octaveid,j,7,undefined,tab.charAt(5));
		var flatsID=octaveid+"_flats";
		$("#"+octaveid).append("<div class='flats' id="+flatsID+"></div>")
		this.addBlackKeys(flatsID,j,tab.charAt(5));
	}

 }
 
}
Piano.prototype.addWhiteKeys=function(octave,index,numberToAdd, width,trackNum)
{
	var y=0;
	while(y<numberToAdd)
	{
	var id;
	if(index!=0)
		id=trackNum+whiteNoteDictionary[y]+index;
	else
		id=trackNum+whiteNoteDictionary[y+5]+index;
	this.addWhiteKey(octave,id,width);
	y++;
	}
}
Piano.prototype.addWhiteKey=function(octave,id,width)
{
	var key;
	if(width!=undefined)
	{
	key="\
	<div class='keyWhite' id="+id+" style='width:"+width+"%'></div>";
	}
	else
	{
	key="\
	<div class='keyWhite' id="+id+"></div>";
	}
	$("#"+octave).append(key);
	this.addSound(id);

} 
Piano.prototype.addBlackKeys=function(flatOctave,index,trackNum)
{
	var v=0
	while(v<5)
	{ 
	 this.addBlackKey(flatOctave,trackNum+blackNoteDictionary[v]+index,undefined,undefined);
	 v++;
	}
}
Piano.prototype.addBlackKey=function(octave,id,width,left)
{
	var key;
	if(width!=undefined && left!=undefined)
	{
	key="\
	<div class='keyBlack' id="+id+" style='width:"+width+"%; left:"+left+"%'></div>";
	}
	else
	{
		key="\
	<div class='keyBlack' id="+id+"></div>";
	}
	$("#"+octave).append(key);
	this.addSound(id);
}