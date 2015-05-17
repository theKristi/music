/*Song.js is just a container for the tracks. Can create and display tracks*/

/**TODO:needs "song" functions like download(), play(), pause(), stop()**/
var player=MIDI.Player;
/*This function is the constructor for the song object*/
Song=function()
{
	this.tracks=new Array();
	this.createTracks(4);
}
/************************************************Song Gui******************************************************************************************/
/*
*This function creates and array of tracks based on the number passed in
*@param numberToCreate{integer} the number of tracks to create
*/
Song.prototype.createTracks=function(numberToCreate)
{
	for(i=0;i<numberToCreate;i++)
	{
		this.tracks.push(new Track(i));
		//this.tracks[i].createTab();
	}
}

/*
* This function is responsible for displaying the number of tabs selected by the "number of tracks selector"
* calls tabSwitch() and hidetabs(){see setUp.js} to make sure a tab is always being displayed 
*/
Song.prototype.displayTracks=function()
{
	var numberToDisplay=$('#userTrackNumber option:selected').val();
	var active=$("#menu .active a")[0].id;
	for(var i=0;i<song.tracks.length;i++)
	{
		if(i<numberToDisplay)
		{
			if(!song.tracks[i].displayed)
			{
				song.tracks[i].createTab();
			}
		
		}
		else if(song.tracks[i].displayed)
		{
			if(song.tracks[i].name===active)
			{
				hideTabs(song.tracks[numberToDisplay-1].name)
				active=$("#menu .active a")[0].id;
			}
			song.tracks[i].removeTab();
		}
	}
	tabSwitch();
	hideTabs(active);
	
	
}
/****************************************************************End song Gui***************************************************************************/
/**TODO:Add Documentaion**/
function makeSongFromTracks(tracks)
{
/**TODO:check to make sure tracks is an array**/	

//jsmidi stuff here
	midiTracks=[]
	for(var i=0;i<tracks.length;i++)
	{
		//send notes[] through MidiEvent.createNote(note) to create note Events.
		var track=tracks[i];
		/**TODO:test if channel is added to notes if i>1**/	
		var noteEvents=[];
		track.notes.forEach(function(note){
			if (i<0)
				note.channel=i;
			Array.prototype.push.apply(noteEvents, MidiEvent.createNote(note,true));
			});
	
		//create new midi track from note events MidiTrack
		var onetrack=new MidiTrack({ events: noteEvents });
		midiTracks.push(onetrack);
	}	
		var song  = MidiWriter({ tracks: midiTracks });
		return song;
		
}
