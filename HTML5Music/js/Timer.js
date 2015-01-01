/*Timer.js*/
var CurrentTimer;
Timer=function(intrval,GUIid)
{
	this.currentTime=0;
	this.intervalTime=intrval;
	this.GUI=GUIid;
	this.incrementEvent=new Event('increment',{});
	window.addEventListener('increment',this.increment);
	

Timer.prototype.start=function()
{
	CurrentTimer=this;
	this.currentTime=0;
	//alert("Time started:"+this.currentTime);
	this.interval=setInterval(this.increment,this.intervalTime);
}
 Timer.prototype.increment=function()
{
	CurrentTimer.currentTime++;
	//console.log("CurrentTime:"+this.currentTime);
	$("#"+CurrentTimer.GUI).text(CurrentTimer.toString());
}
Timer.prototype.dispatchIncrement=function(evt)
{
	dispatchEvent(evt);
} 
Timer.prototype.stop=function()
{
	clearInterval(this.interval);
	//alert("Timestopped:");
	
}
Timer.prototype.getTime=function()
{
	return this.currentTime;
}
Timer.prototype.toString=function()
{ var time;
	var minutes=Math.floor(this.currentTime/60000);
	time=this.currentTime%60000;
	var seconds=Math.floor(time/100);
	time=time%100;
	//console.log("Minutes: "+minutes+" Seconds: "+seconds+" mili: "+time);
	return ""+minutes+":"+seconds+"."+time;

}
};
