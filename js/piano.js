/**piano.js build piano gui, and handles playing piano audio**/

/**global flag to be sure piano soundfont was loaded**/
var pianoLoaded=false;

/**global flag to tell if left mouse button is down for play fluidity**/
var mouseDown;

/**array used for naming white keys on the keyboard**/
var whiteNoteDictionary=["C","D","E","F","G","A","B"];

/**array used for naming black keys on the keyboard**/
var blackNoteDictionary=["Db","Eb","Gb","Ab","Bb"];

/**
*This function is a constructor for the piano
*/
Piano=function()
{
//midiNumber is an attribute used of identifying the instrument in midi.js
midiNumber:0;
}

/**
* This function drives building the piano
*@param tab{String} the tab on which to build the piano
*/
Piano.prototype.build=function(tab)
{
	$("."+tab).append("<div id='"+tab+"pianoBody'></div>");
	$("#content_container").mouseup(keymouseup);
	this.buildOctaves(tab);
								//$("#pianoBody").append("<div id='pianoSounds' style='display:none;'></div>");
}//end buildPiano


/*
*This function sets the event handlers which will make the instrument make noise
*@param keyid{String} the name of the div that will listen for the events to occur.
*/
Piano.prototype.addSound=function(keyid)
{

								//$("#pianoSounds").append("<audio preload='auto' id='"+keyid+"_sound' controls><source src='sondfonts/acoustic_grand_piano-mp3/"+keyid+".mp3' type='audio/mpeg'></audio>");
	$("#"+keyid).mousedown([keyid,this],this.keymousedown);
	$("#"+keyid).mouseenter([keyid,this],this.keymouseenter);
	$("#"+keyid).mouseout([keyid,this],this.keymouseout);
	
	
								//$("#"+keyid+"_sound").on("ended",[keyid],noteEnded);
	

	
}

/*
*This function handles what happens when the left mouse button comes up.
*@param event{Event} the event that represents keymouseup.
*/
function keymouseup(event)
{
	mouseDown=false;
	
	$(".keyWhite").css("background", "");
	$(".keyBlack").css("background", "");
	$(".keyWhite").removeClass("pressed");
	$(".keyBlack").removeClass("pressed")
}

/*
*This function handles what happens when you press the left mouse button while the cursor is over a key on the keyboard(piano).
*@param event{Event} the event that represents keymousedown.
*/
Piano.prototype.keymousedown=function(event)
{
	event.preventDefault();
	mouseDown=true;
	var keyid=event.data[0];
	lightKey(event.data[0],song.tracks[parseInt(event.data[0].charAt(0))].color);
	$("#"+event.data[0]).addClass("pressed");
	event.data[1].playNote(keyid);
}

/*
*This function handles what happens when the cursor enters a div which represents a key on the keyboard(piano)
*it only does something when the left mouse button is down. 
*@param event{Event} the event that represents keymouseenter.
*/
Piano.prototype.keymouseenter=function(event)
{

	if(mouseDown)
	{
			
		event.data[1].playNote(event.data[0]);
		lightKey(event.data[0],song.tracks[parseInt(event.data[0].charAt(0))].color);
		$("#"+event.data[0]).addClass("pressed");
	}
}
function lightKey(note,color)
{
	//keymouseup();
	$("#"+note).css("background", color);
}
function unlightKey(note)
{
	$("#"+note).css("background", "");
}
function clearColorFromAllKeys(color)
{
	var whiteKeys=$(".keyWhite").filter(function()
	{
		var keycolor=$(this).css("background-color").toLowerCase();
		if (keycolor==color)
			return this;
	});
	whiteKeys.css("background-color","");
	var blackKeys=$(".keyBlack").filter(function()
	{
		var keycolor=$(this).css("background").toLowerCase();
		if (keycolor==color)
			return this;
	});
	blackKeys.css("background","");
}

/*
*This function handles what happens when the cursor exits a div which represents a key on the keyboard(piano)
*it only does something when the left mouse button is down. 
*@param event{Event} the event that represents keymouseenter.
*/
Piano.prototype.keymouseout=function(event)
{
if(mouseDown)
	{
		var keyid=event.data[0];
	$("#"+keyid).css("background", "");
	$("#"+event.data[0]).removeClass("pressed");
	}
}

/*
* This function is responsible for loading the soundfont for the piano.
*/
function loadPianoSound()
{
	MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: "acoustic_grand_piano",
		callback: function() {
			pianoLoaded=true;
			
		}
	});
}

/*
*This function is responsible for actually playing the audio that corresponds to the note.
*@param trackkeyid{string} the name of the div that was clicked  
*/	
Piano.prototype.playNote=function(trackkeyid)
{
	var keyid=trackkeyid.substring(1);
	var trackNum=parseInt(trackkeyid.charAt(0));
	var note=MIDI.keyToNote[keyid];
	song.tracks[trackNum].notePlayed(keyid);
	var delay = 0; 

			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
}
/*
*This function drives the building of the GUI of all the octaves on the piano
*@param tab{String} the tab on which we are building the piano
*/
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
		this.addBlackKey(octaveid,tab.charAt(5)+"Bb0",25,35.16);
		$("#"+octaveid).css({"width":"3.846%"});
		
	}
	else if(j===8)
	{
		this.addWhiteKeys(octaveid,j,1,100,tab.charAt(5));
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

/*
*This function builds a parameter determined number of white keys and adds them to the octave passed in.
*@param octave{String} the id of the octave to which we are adding the keys.
*@param index{Integer} the number representation of where we are in the octave.
*@param numberToAdd{Integer} the number of keys to build
*@param width {number} the percentage width of the keys to be built.(only used on first and last octave)
*@param trackNum{Integer} the index of the track in song.tracks plus 1(used for naming purposes) 
*/
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

/*
*This function builds a single white key with the parameter width and adds it to the parameter octave
*@param octave{String} the octave which to add the white key to.
*@param id{String} the id for the new key.
*@param width{number} the width of the new key(only used on first and last octave)
*/
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

/*
*This function builds an octave worth of black keys.
*@param flatOctave{String} the name of the octave we are adding black keys to
*@param index{Integer} the index of where we are in the octave
*@param trackNum{Integer} the index of the track in song.tracks plus 1(used for naming purposes)
*/ 
Piano.prototype.addBlackKeys=function(flatOctave,index,trackNum)
{
	var v=0
	while(v<5)
	{ 
	 this.addBlackKey(flatOctave,trackNum+blackNoteDictionary[v]+index,undefined,undefined);
	 v++;
	}
}

/*
*This function builds a single black key
*@param octave{String} the name of the octave to which we are adding the key
*@param id{String} the id of the key being built.
*@param width{number} the percentage width of the key being built.(only used on first and last octave)
*@param left{number} the percentage to move the key left.(only used on first and last octave)
*/
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