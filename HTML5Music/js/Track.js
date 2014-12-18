/****Track.js******/
//needs click 
//needs instrument
Track=function(trackNum)
{
	this.name="track"+trackNum;
	this.notes=[];
	this.displayed=false;
	this.color=colorTable[trackNum-1];
	this.timer=new Timer(10,this.name+"recordingTimer");
	this.recording=false;
	
	//console.log("making"+this.name);
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
						<div class='button playerElement playButton' id='"+this.name+"playButton'><div class='triangle'><div></div></div>\
						</div>\
    					</div>\	"
	
	
		$("#content").append($trackPlayer);
		this.changeInstrument();
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
Track.prototype.initInstrument=function(tab)
{
	var name=$("#"+tab.name+"Instrument option:selected").text();
tab.instrument=buildInstrument(name); 
tab.instrument.build(tab.name);
}
Track.prototype.changeInstrument=function()
{
var name=$("#"+this.name+"Instrument option:selected").text();
this.instrument=buildInstrument(name);
 this.instrument.build(this.name);
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
	$("#"+this.name+"recordButton").on("click",recMouseUp);
	$("#"+this.name+"Instrument").change(this.changeInstrument);
	//$("#"+this.name+"playButton").click(this.playMouseUp);

}