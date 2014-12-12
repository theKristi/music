/****Track.js******/
//needs click 
//needs instrument
track=function()
{
	channels:[15];
}
function Note(id, time)
{
 this.note=id;
	if (time!=undefined)
		this.timePlayed=time;
	else
		this.timePlayed=-1;
}