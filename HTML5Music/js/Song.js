/*Song.js this should handle recording tracks and playback*/

var mouseDown=false;
//var notesPlayed;
var currentTime;
var Timer;
var recording=false;
Song=function()
{
	this.tracks=new Array();
	this.createTracks(4);
	
}
Song.prototype.createTracks=function(numberToCreate)
{
	for(i=0;i<numberToCreate;i++)
	{
		this.tracks.push(new Track(i+1));
		//this.tracks[i].createTab();
	}
}
Song.prototype.displayTracks=function()
{
	var numberToDisplay=$('#userTrackNumber option:selected').val();
	var active=$("#menu .active a")[0].id;
	for(i=0;i<song.tracks.length;i++)
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



function saveNote(note)
{
 var n=new Note(note, Timer.getTime());
 
 console.log("saving note:"+note);
 notesPlayed.push(n);
}


function noteEnded(event)
{
	var id=event.data[0];
	//var time=event.data[1];
	//console.log("Time Played: "+currentTime);
	if(notesPlayed===undefined)
	{
		notesPlayed=new Array();
	}
	if(recording)
	{
	notesPlayed.push(new Note(id,currentTime));
	currentTime=-1;
	console.log("played: "+notesPlayed[notesPlayed.length-1].note+" for time "+notesPlayed[notesPlayed.length-1].timePlayed);
	}
}