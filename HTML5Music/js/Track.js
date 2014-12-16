/****Track.js******/
//needs click 
//needs instrument
Track=function(trackNum)
{
	this.name="track"+trackNum;
	this.notes=[];
	this.displayed=false;
	this.color=colorTable[trackNum-1];
	this.timer=new Timer(this.name);
	this.recording=false;
}
function Note(id, time)
{
 this.note=id;
	if (time!=undefined)
		this.timePlayed=time;
	else
		this.timePlayed=-1;
}

/****************************create/remove Gui tab *********************************/
Track.prototype.createTab=function()
{
//add tab
	var $trackTab="<li id='"+this.name+"tab'class='' style='background:"+this.color+"'>\
					<a href='' id='"+this.name+"'>"+this.name+"</a>\
							</li>"
		$("#menu").append($trackTab);
	
		
	//add content
	var $trackPlayer="<div class='"+this.name+"'  id='track' >\
	<div id='trackColor' style='background:"+this.color+"'></div>\
	<div id='player'>\
	<div class='button playerElement recordButton' id='"+this.name+"recordButton' ><div class='light'></div><div class='text'>REC</div></div>\
						<div class='timer playerElement' id='"+this.name+"recordingTimer'>0:00.00</div>\
						<div class='button playerElement playButton' id='"+this.name+"playButton'><div class='triangle'><div></div></div>\
						</div>\
    					</div>\	"

		$("#content").append($trackPlayer);
		this.displayed=true;
		this.setEventHandlers();
	
}
Track.prototype.removeTab=function()
{
	
	$("."+this.name).remove();
	$("#"+this.name).remove();
	$("#"+this.name+"tab").remove();
	this.displayed=false;
}
/************************************End Create/remove GUI tab***************************************/
/************************************Attribute Setters***********************************************/
Track.prototype.changeInstrument=function()
{
var name=$("#"+this.name+"Instrument option:selected").text();
 
  instrument:buildInstrument(name);
 
  this.instrument.build();
}
/*************************************End Attribute setters******************************************/
/*************************************recording handlers*********************************************/
Track.prototype.saveNote=function(note,time)
{
 var n=new Note(note, time);
 
 console.log("saving note:"+note);
 notes.push(n);
}
/*************************************End recording handlers******************************************/
/*************************************Track Player handlers*******************************************/

function recMouseUp(event)
{
var track=event.data;
	if(!recording)
	{
	track.notes=[];
	track.timer.start();
	console.log("recording "+track.name);
	$(".light").addClass("glow");
	$("#"+track.name+"recordButton").addClass("pressed");
	track.recording=true;
	}
	else
	{
		$(".light").removeClass("glow");
		$("#"+track.name+"recordButton").removeClass("pressed");
		track.recording=false;
		console.log("!recording "+track.name);
		track.timer.stop();
	
	}
	
}
function playMouseUp()
{
	if($("#"+this.name+"playButton").hasClass("pressed"))
		$("#"+this.name+"playButton").removeClass("pressed");
	else
		$("#"+this.name+"playButton").addClass("pressed");

}
Track.prototype.setEventHandlers=function()
{
	$("#"+this.name+"recordButton").click(this,recMouseUp);
	//$("#"+this.name+"playButton").click(this.playMouseUp);

}