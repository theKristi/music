/*Track.js*/
var trackPlaying;

/*
*This function is a constructor for the track object
*@param{integer} this is the index of the track in the song.tracks array plus 1 
*to make it 1 based for naming purposes
*/
Track=function(trackNum)
{
	this.name="track"+(trackNum);
	this.channel=trackNum;
	this.notes=[];
	this.displayed=false;
	this.color=colorTable[trackNum];
	this.timer=new Timer(10);
	this.timer.addListener(updateTimer,[this.timer,this.name+"recordingTimer"]);
	this.recording=false;
	this.instrument="";
	this.midiTrack;
}
/*
*This function returns the string representation of a track
*@return res{String} a list of the notes contained in the track.
*/
Track.prototype.toString=function()
{
	var res=this.name+" \n";
	for(var i=0; i<this.notes.length;i++)
	{
		res+=this.notes[i].toString();
	}
	return res;
}

/*************************************Note Object*******************************************/

/*
*This is a function that defines a data structure for a Note 
*@param id{String} the name of the Note.
*@param time{Integer} the time(in milliSeconds) which the note was played
*@param channel{Integer} the channel on which the note is to be played
*/
function Note(id, time, channel)
{
this.name=id
 this.pitch=noteTable[id];
 //this.channel=channel;
	if (time!=undefined)
	{
		this.timePlayed=time;
		this.duration=computeTicks(2000);
	}
	else
		this.timePlayed=-1;
	this.toString=function()
	{
		return "[Note: "+this.name+"TimePlayed: "+this.timePlayed+"Duration: "+this.duration+"]\n";
	};
}

/*
*This function accepts a millisecond duration and converts it into midi ticks to use with jsmidi
*@param milliseconds{Number} the time to convert to ticks
*@return ticks{Number} the midi representation of the number of milliseconds passed in
*/
function computeTicks(milliseconds)
{
	//beats per minute
	var bpm=parseInt($("#tempo").val());
	//Ticks per beat (by default ticks per beat is 128 in jsmidi)
	var tpb=128;
	var ticks=(bpm*tpb*milliseconds)/60000;
	if(ticks<0)
		throw new Error("negative tick value");
	return ticks;
}

/*
*This function calculates the durations for an array of notes
*by iterating through the array and calculating the amount of 
*time between consecutive notes played.
*@param notes{Array} the array of notes with which to calculate durations 
*/
function calculateDurations(notes)
{
	var initialTicks=computeTicks(2000);
		/** TODO: debug: second to last note duration always too long*/
		for(var i=0;i<notes.length;i++)
		{
			
			var currnote=notes[i];
			var nextnote=notes[i+1];
			if(nextnote)
			{
				if(nextnote.timePlayed==-1)
				{
					if(currnote.timePlayed==-1)
						currnote.duration=0;
					nextnote.duration=0;
				
				}
				else
				{
				
					var milliDur=nextnote.timePlayed-currnote.timePlayed;
					if(milliDur<0)
					throw new Error("Negative duration at: i= "+i+" nextnote.timePlayed= "+nextnote.timePlayed+" currnote.timePlayed= "+currnote.timePlayed)
					currnote.duration= computeTicks(milliDur*10);
				
				}
			}
		}
}

/*********************************End Note Object*******************************************/

/****************************create/remove Gui tab ****************************************/

/*
*This function creates all the html for a tab which represents a track, and adds it to the tabs currently being displayed.
*it grabs all of its data from the track attributes to which this function belongs.  
*/
Track.prototype.createTab=function()
{
	//add tab
	var $trackTab="<li id='"+this.name+"tab'class='' style='background:"+this.color+"'>\
	<a href='' id='"+this.name+"'style='background:"+this.color+"'>track"+(this.channel+1)+"</a>\
	</li>"
		
	$("#menu").append($trackTab);
	
		
	//add content
	var $trackPlayer="<div class='"+this.name+"'  id='track' >\
	<div id='trackColor' style='background:"+this.color+"'><label class='userInstrument'>Instrument:  <Select id='"+this.name+"Instrument'>\
	<option>Piano</option>\
	</Select></label></div>\
	<div id='player'>\
	<div class='button playerElement recordButton' id='"+this.name+"recordButton' ><div class='light'></div><div class='text'>  REC</div>\</div>\
	<div class='timer playerElement' id='"+this.name+"recordingTimer'>0:00.00</div>\
	<div class='button playerElement saveButton pressed' id='"+this.name+"saveButton'>SAVE TRACK</div>\
	<div class='button playerElement playButton pressed' id='"+this.name+"playButton'><div id='graphicContainer' class='tricontainer'><div class='triangle'></div></div></div>\
	<div class='button playerElement stopButton pressed' id='"+this.name+"stopButton'><div class='square'></div></div>\
    </div>\
	<div id='"+this.name+"_notes'></div>";					
	
		$("#content").append($trackPlayer);
		this.changeInstrument();
		this.displayed=true;
		this.setEventHandlers();
		if(this.midiTrack!==undefined)
		{
			$("#"+this.name+"recordingTimer").text(this.timer);
			activatePlayer(this.channel);
		}
}

/*
*This function removes tab content from those being displayed.
*/
Track.prototype.removeTab=function()
{
	
	$("."+this.name).remove();
	$("#"+this.name).remove();
	$("#"+this.name+"tab").remove();
	this.displayed=false;
}
/************************************End Create/remove GUI tab***************************************/

/************************************Attribute Setters***********************************************/
/*
*This function is the onChange event handler for the "instrument" selector found in each track
*/
Track.prototype.changeInstrument=function()
{
	var name=$("#"+this.name+"Instrument option:selected").text();
	this.instrument=buildInstrument(name);
	this.instrument.build(this.name);
}
/*************************************End Attribute setters******************************************/

/*************************************recording handlers*********************************************/

/*
*This function saves a note that has been played to this track's note array  
*@param note{String} the name of the Note to be saved.
*@param time{Integer} the time(in milliSeconds) which the note to be saved was played.
*/
Track.prototype.saveNote=function(note,time)
{
	var n=new Note(note, time);
	/*if(this.notes.length>0)
	{
		var lastNote=this.notes[this.notes.length-1];
		lastNote.duration=computeTicks(time-lastNote.timePlayed);
	}*/
	this.notes.push(n);
}

/*
*This function handles what happens when a note is played in the track
*@param note{String} the name of the note played.
*/
Track.prototype.notePlayed=function(note)
{
	if(this.recording)
		this.saveNote(note,this.timer.getTime());
}
/*************************************End recording handlers******************************************/

/*************************************Track Player handlers*******************************************/

/*
*This function handles what happens when the record button is pressed 
*changes the button look, starts/stops this tracks timer, and sets this tracks recording flag attribute. 
*/
function recMouseUp(event)
{
	var divid=this.id;
	var trackNum=parseInt(divid.charAt(5));
	var track=song.tracks[trackNum];
	
	if(!track.recording)
	{
		track.notes=[];
		track.timer.start();
		$(".light").addClass("glow");
		$("#"+divid).addClass("pressed");
		deactivatePlayer(track.channel)
		track.recording=true;
	}
	
	else
	{
		$(".light").removeClass("glow");
		$("#"+divid).removeClass("pressed");
		track.recording=false;
		//alert("!recording "+track.name);
		track.timer.stop();
		if(track.notes.length!=0)
		{	//$("#"+track.name+"_notes").text(track);
			track.notes.push(new Note("C9",-1, track.channel));
			track.notes.push(new Note("C9",-1, track.channel));
			calculateDurations(track.notes);
			activatePlayer(track.channel);
		
		// call makeSongFromTracks
	
		 track.midiTrack=makeSongFromTracks([track]);
			
		}	
	
	}
	
}

/*
*This function handles what happens when the play button is clicked
*@param event{event} the event that was fired when the playButton was clicked
*/
function playMouseUp(event)
{
	
	if(!($(this).hasClass("pressed")))
	{	
		var track=event.data[0];
		
		//var track64="data:audio/midi;base64,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"

	/**TODO: enable Stop button**/
		if(track.midiTrack.b64==="TVRoZAAAAAYAAAAAAIA=")
			alert("just hedr");

		//alert(midiTrack.src());
		if(!player.playing)
		{
			player.loadFile(track.midiTrack.src(),player.start());
			//track.play();
		}
		else
			track.pause();
		togglePlay(this);
	}
	
}

/*
*This function handles what happens when the save track button is pressed
*@param event{Event} the click event that was fired
*/
function saveMouseUp(event)
{
	if(!($(this).hasClass("pressed")))
	{
		var track=event.data[0];
		if(track.notes.length===0)
			alert("There is nothing recorded");
		else 
		{
			//alert("no audio will be generated on download. Still calculating durations")
			var tracksong=makeSongFromTracks([track]);
			tracksong.save(true);
		}
	}		
	
}

/*
*This function handles what happens when the stop button is pressed
*@param event{Event} the click event that was fired
*/
function stopMouseUp(event)
{
	if(!($(this).hasClass("pressed")))
	{
		var track=event.data[0];
		track.stop();
	}		
	
}

/*
*This function makes player buttons active for the specified track
*@param trackNum{integer} the index of the track whose buttons you wish to make active
*/ 
function activatePlayer(trackNum)
{
	$("#track"+trackNum+"saveButton").removeClass("pressed");
	$("#track"+trackNum+"playButton").removeClass("pressed");
}

/*
*This function makes player buttons inactive for the specified track
*@param trackNum{integer} the index of the track whose buttons you wish to make inactive
*/ 
function deactivatePlayer(trackNum)
{
	player.stop();
	$("#track"+trackNum+"saveButton").addClass("pressed");
	$("#track"+trackNum+"playButton").addClass("pressed");
}

/*
*This function sets the event handlers for this track's elements
*/
Track.prototype.setEventHandlers=function()
{
	$("#"+this.name+"recordButton").on("click",recMouseUp);
	$("#"+this.name+"Instrument").change(this.changeInstrument);
	$("#"+this.name+"saveButton").click([this],saveMouseUp);
	$("#"+this.name+"playButton").click([this],playMouseUp);
	$("#"+this.name+"stopButton").click([this],stopMouseUp);

}

/*
*This function plays the this track
*/
Track.prototype.play=function()
{
	//var player=MIDI.Player;
	trackPlaying=this;
	if(player.currentTime>0)
	player.resume();
	else
		player.start();
}

/*
*This function pauses the this track
*/
Track.prototype.pause=function()
{
	//alert("pause");
	
	player.pause();
	trackPlaying=undefined;
	
}
/*
*This function stops the track
*/
Track.prototype.stop=function()
{
	player.stop();
	trackPlaying= undefined;
}
/*********************************End Track Player handlers*******************************************/
/*************************************Helper Functions*******************************************/

/*
*This function handles what happens to update the timer
*@param timerArray{Array} an array of params that really just holds the timer to update.
*/
function updateTimer(timerArray)
{
	var timer=timerArray[0];
	var name=timerArray[1];
	$("#"+name).text(timer);
}

/* This function toggles play button graphic
@param button{jquery element} the play button whose graphic you want to toggle.
*/
function togglePlay(button)
{
	var graphicContainer=button.children[0];
	
	if($(graphicContainer.children[0]).hasClass("triangle"))
		{
		
			$(graphicContainer).removeClass("tricontainer");
			$(graphicContainer).empty();
			//add pause divs
			/**Kristi: use append**/
			$(graphicContainer).append("<div class='recPause left'></div><div class='recPause right'></div>");
		}
	else
		{
			//remove pause divs 
			/**Kristi: use remove**/
			$(graphicContainer).empty();
			//$(graphicContainer.children[0]).remove();
			//$(graphicContainer.children[1]).remove();
			//$(".rightRecPause").remove();
			$(graphicContainer).addClass("tricontainer");
			$(graphicContainer).append("<div class='triangle'></div>");
		}	
}

/*
*This function updates the track player and lights the keys while the track is playing
*@param data{event} an event containing all the necessary information to process an individual note
*/
function updateTrack(data) 
{
	/**TODO: when song is added make sure the right div is passed into lightKey and unlight key**/
	/**TODO: check for trackend and call togglePlay()**/
	var channel;
	if(trackPlaying==undefined)
		channel = data.channel; // channel note is playing on
	else
		channel=trackPlaying.channel;
    var note = MIDI.noteToKey[data.note];
	var message=data.message;
	if (message===144)
	{
		clearColorFromAllKeys(colorTable[channel]);
		lightKey(""+channel+note, colorTable[channel]);
	}
	else 
		unlightKey(""+channel+note)
}
function listenForEnd(data)
{
    var now = data.now; // where we are now
    var end = data.end; // time when song ends
	if(now==end)
	{
	var track=trackPlaying;
	var playbutton=$("#"+track.name+"playButton")[0];
		togglePlay(playbutton);
		keymouseup();
	}
    

}