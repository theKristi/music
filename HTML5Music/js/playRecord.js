/*PlayRecord.js this should handle recording tracks and playback*/

var mouseDown=false;
var notesPlayed;
var currentTime;
var Timer;
var recording=false;


function setUpPlay()
{
	$("#recordButton").mouseup(recmouseup);
	$("#playButton").mouseup(playMouseUp);
	Timer=new Timer();
	
}
function recmouseup(event)
{
	if(!recording)
	{
	notesPlayed=[];
	Timer.start();
	console.log("recording");
	$(".light").addClass("glow");
	$("#recordButton").addClass("pressed");
	recording=true;
	}
	else
	{
		$(".light").removeClass("glow");
		$("#recordButton").removeClass("pressed");
		recording=false;
		console.log("!recording");
		Timer.stop();
	
	}
	
}
function playMouseUp()
{
	if($("#playButton").hasClass("pressed"))
		$("#playButton").removeClass("pressed");
	else
		$("#playButton").addClass("pressed");

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