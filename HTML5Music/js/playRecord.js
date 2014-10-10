var notesPlayed;
var currentTime;
var recording=false;
function Note(id, time)
{
 this.note=id;
	if (time!=undefined)
		this.timePlayed=time;
	else
		this.timePlayed=-1;
}
function keymouseup(event)
{
	var id=event.data[0];
	
	$("#"+id).css("background", "");
}
function recmouseup(event)
{
	if(!recording)
	{
	$("#recordButton").css("background","url(images/record_button_down.png)");
	recording=true;
	}
	else
	{
		$("#recordButton").css("background","");
		recording=false;
	}
	
}
function playAudio(event)
{
	var keyid=event.data[0];
	$("#"+keyid).css("background", "red");
	var sound= document.getElementById(keyid+"_sound");
	sound.pause();
	if(sound.currentTime!=0)
	{
//console.log("currentTime: "+sound.currentTime);
	currentTime=sound.currentTime;
	if(recording)
	$("#"+keyid+"_sound").trigger("ended",[keyid]);
	sound.currentTime=0;	
	}
	sound.play();
//console.log("playing: "+keyid);
	
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