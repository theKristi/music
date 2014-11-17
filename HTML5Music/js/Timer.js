/*Timer.js*/
var currentTime;
var interval;
Timer=function()
{
	currentTime=0;
	console.log("ConstructTime:"+currentTime);
}

Timer.prototype.start=function()
{
	currentTime=0;
	console.log("Time started:"+currentTime);
	interval=setInterval(increment,10);
}
function increment(event)
{
	currentTime++;
	//console.log("CurrentTime:"+currentTime);
	$("#recordingTimer").text(getMinuteString());
} 
Timer.prototype.stop=function()
{
	clearInterval(interval);
	console.log("Timestopped:"+currentTime);
	
}
Timer.prototype.getTime=function()
{
	return currentTime;
}
function getMinuteString()
{ var time;
	var minutes=Math.floor(currentTime/60000);
	time=currentTime%60000;
	var seconds=Math.floor(time/100);
	time=time%100;
	//console.log("Minutes: "+minutes+" Seconds: "+seconds+" mili: "+time);
	return ""+minutes+":"+seconds+"."+time;

}