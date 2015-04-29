/*Track.js*/
 
/*
*This function is a constructor for the track object
*@param{integer} this is the index of the track in the song.tracks array plus 1 
*to make it 1 based for naming purposes
*/
Track=function(trackNum)
{
	this.name="track"+trackNum;
	this.notes=[];
	this.displayed=false;
	this.color=colorTable[trackNum-1];
	this.timer=new Timer(10);
	this.recording=false;
	this.instrument="";
	
	//console.log("making"+this.name);
}

/*
*This is a function that defines a data structure for a Note 
*@param id{String} the name of the Note.
*@param time{Integer} the time(in milliSeconds) which the note was played
*/
function Note(id, time, channel)
{
 this.pitch=noteTable[id];
 this.channel=channel;
	if (time!=undefined)
	{
		this.timePlayed=time;
		this.duration=computeTicks(2000)
	}
	else
		this.timePlayed=-1;
}
function computeTicks(milliseconds)
{
	//beats per minute
	var bpm=parseInt($("#tempo").val());
	//Ticks per beat (by default ticks per beat is 128 in jsmidi)
	var tpb=128;
	var ticks=(bpm*tpb*milliseconds)/60000;
	return ticks;
}

/****************************create/remove Gui tab *********************************/

/*
*This function creates all the html for a tab which represents a track, and adds it to the tabs currently being displayed.
*it grabs all of its data from the track attributes to which this function belongs.  
*/
Track.prototype.createTab=function()
{
//add tab
	var $trackTab="<li id='"+this.name+"tab'class='' style='background:"+this.color+"'>\
					<a href='' id='"+this.name+"'style='background:"+this.color+"'>"+this.name+"</a>\
							</li>"
		$("#menu").append($trackTab);
	
		
	//add content
	var $trackPlayer="<div class='"+this.name+"'  id='track' >\
	<div id='trackColor' style='background:"+this.color+"'><label class='userInstrument'>Instrument:  <Select id='"+this.name+"Instrument'>\
								<option>Piano</option>\
								</Select></label></div>\
	<div id='player'>\
	<div class='button playerElement recordButton' id='"+this.name+"recordButton' ><div class='light'></div><div class='text'>REC</div></div>\
						<div class='timer playerElement' id='"+this.name+"recordingTimer'>0:00.00</div>\
						<div class='button playerElement saveButton' id='"+this.name+"saveButton'>SAVE</div>\
						<div class='button playerElement playButton' id='"+this.name+"playButton'><div class='triangle'><div></div></div>\
						</div>\
    					</div>\	"
	
	
		$("#content").append($trackPlayer);
		this.changeInstrument();
		this.displayed=true;
		this.setEventHandlers();
		if(this.timer.currentTime!==0)
		{
			$("#"+this.name+"recordingTimer").text(this.timer);
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
*This function saves a note that has been played to this tracks note array  
*@param note{String} the name of the Note to be saved.
*@param time{Integer} the time(in milliSeconds) which the note to be saved was played.
*/
Track.prototype.saveNote=function(note,time)
{
 var n=new Note(note, time,this.trackNum);
 
 console.log("saving note:"+note);
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
*  changes the button look, starts/stops this tracks timer, and sets this tracks recording flag attribute. 
*/
function recMouseUp(event)
{
var divid=this.id;
var trackNum=parseInt(divid.charAt(5));
var track=song.tracks[trackNum-1];
	if(!track.recording)
	{
	track.notes=[];
	track.timer.start();
	console.log("recording "+track.name);
	$(".light").addClass("glow");
	$("#"+divid).addClass("pressed");
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
			track.notes.push(new Note("C9",0, track.trackNum));
	
	}
	
}
/*
*This function handles what happens when the play button is clicked
*changes look to pressed
*/
/**TODO: Functionality needs to be added when playback is actually possible**/
function playMouseUp()
{
	
	var sound=$("#lowClick")[0];
	sound.play();
}
/*
*This function handles what happens when the save button is pressed
*/
Track.prototype.saveMouseUp=function(event)
{
	var track=event.data[0];
	if(track.notes.length===0)
		alert("There is no track to save.");
	else 
	{
//jsmidi stuff here
	//send notes[] through MidiEvent.createNote(note) to create note Events.
	var noteEvents=[];
		track.notes.forEach(function(note) {
    Array.prototype.push.apply(noteEvents, MidiEvent.createNote(note,true));
});
	//create new midi track from note events MidiTrack
		var onetrack=new MidiTrack({ events: noteEvents });
		var song  = MidiWriter({ tracks: [onetrack] });
		song.save(true);
	}
}
/*
*This function sets the event handlers for this track's elements
*/
Track.prototype.setEventHandlers=function()
{
	$("#"+this.name+"recordButton").on("click",recMouseUp);
	$("#"+this.name+"Instrument").change(this.changeInstrument);
	$("#"+this.name+"saveButton").click([this],this.saveMouseUp);
	this.timer.addListener(updateTimer,[this.timer,this.name+"recordingTimer"]);
	$("#"+this.name+"playButton").click(playMouseUp);

}
/**
*This function handles what happens to update the timer
*@param timerArray{Array} an array of params that really just holds the timer to update.
**/
function updateTimer(timerArray)
{
	var timer=timerArray[0];
	var name=timerArray[1];
console.log("updateTimer:"+timer)
	$("#"+name).text(timer);
}
