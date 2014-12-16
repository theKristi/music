/*piano.js build piano gui, and handles playing piano audio*/

var whiteNoteDictionary=["C","D","E","F","G","A","B"];
var blackNoteDictionary=["Db","Eb","Gb","Ab","Bb"];
Piano=function()
{
midiNumber:0;
}
Piano.prototype.build=function(tab)
{
	$("."+tab).append("<div id='pianoBody'></div>");
	//$("#pianoBody").append("<div id='pianoSounds' style='display:none;'></div>");
	$("#content_container").mouseup(keymouseup);
	buildOctaves();
	loadSound();
}//end buildPiano
function addSound(keyid)
{
	//add white keys

	//$("#pianoSounds").append("<audio preload='auto' id='"+keyid+"_sound' controls><source src='sondfonts/acoustic_grand_piano-mp3/"+keyid+".mp3' type='audio/mpeg'></audio>");
//console.log("trying to play: "+keyid);
	$("#"+keyid).mousedown([keyid],keymousedown);
	$("#"+keyid).mouseenter([keyid],keymouseenter);
	$("#"+keyid).mouseout([keyid],keymouseout);
	//$("#"+keyid+"_sound").on("ended",[keyid],noteEnded);
	

	
}

function keymouseup(event)
{
	mouseDown=false;
	//var id=event.data[0];
	
	$(".keyWhite").css("background", "");
	$(".keyBlack").css("background", "");
}
function keymousedown(event)
{
	mouseDown=true;
	//console.log("playing: "+event.data[0]);
	var keyid=event.data[0];
	$("#"+keyid).css("background", "red");
	playNote(event.data[0]);
}
function keymouseenter(event)
{
	var keyid=event.data[0];
	if(mouseDown)
	{
			
		playNote(keyid);
		var keyid=event.data[0];
	$("#"+keyid).css("background", "red");
	}
}
function keymouseout(event)
{
if(mouseDown)
	{
		var keyid=event.data[0];
	$("#"+keyid).css("background", "");
	}
}

function loadSound()
{MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: "acoustic_grand_piano",
		callback: function() {
			console.log("piano loaded");
			
		}
	});
	}
function playNote(keyid)
{
	//
	var note=MIDI.keyToNote[keyid];
//console.log("playing: "+note);
var delay = 0; 

			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
	if(recording)
	{
		saveNote(note);
	}
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
function buildOctaves()
{ 
 for(i=0;i<9;i++)
 {	
 var octaveid="o"+i;

 $("#pianoBody").append("<div id="+octaveid+" class='octave'></div>")
	if(i===0)
	{
		addWhiteKeys(octaveid,i,2,50);
		addBlackKey(octaveid,"Bb0",25,35.16)
		
	}
	else if(i===8)
	{
		addWhiteKeys(octaveid,i,1,100);
		
	}
	else
	{
		addWhiteKeys(octaveid,i,7,undefined);
		var flatsID=octaveid+"_flats";
		$("#"+octaveid).append("<div class='flats' id="+flatsID+"></div>")
		addBlackKeys(flatsID,i);
	}

 }
 
}
function addWhiteKeys(octave,index,numberToAdd, width)
{
	var y=0;
	while(y<numberToAdd)
	{
	var id;
	if(index!=0)
		id=whiteNoteDictionary[y]+index;
	else
		id=whiteNoteDictionary[y+5]+index;
	addWhiteKey(octave,id,width);
	y++;
	}
}
function addWhiteKey(octave,id,width)
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
	addSound(id);

} 
function addBlackKeys(flatOctave,index)
{
	var v=0
	while(v<5)
	{ 
	 addBlackKey(flatOctave,blackNoteDictionary[v]+index,undefined,undefined);
	 v++;
	}
}
function addBlackKey(octave,id,width,left)
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
	addSound(id);
}