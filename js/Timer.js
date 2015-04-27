
/**@Author Kristi Marks*/ 


/**Timer.js: A Timer Class giving a timer's functionality using an observer type pattern**/
/**
***TODO: Add a String Format for the toString method
***TODO: clean up old event stuff
*/

//var CurrentTimer;

/**A global Array that holds all timers in the project**/
var timers=[];
/**
*A Constructor for a timer.
*@param intrval{integer} the interval,in milliseconds, with which you want the timers event and listeners to fire
*@param id{integer or String} the index of the timer in the global timers array
**/
Timer=function(intrval,id)
{
/**This Attribute is the "current time" of the timer it basically keeps count of how many times increment has fired  **/
		this.currentTime=0;
/**This Attribute is the interval, in milliseconds, on which the functions fire **/
		this.intervalTime=intrval;
/**This Attribute is the Event that is listened for in the Observer Pattern**/		
		//this.incrementEvent=new CustomEvent('increment',{detail:{timer:this}});
//document.addEventListener('increment',this.increment,false)*/
/**This Attribute is the array of listeners that are called every time the timer is incremented**/
		this.listeners=[];
		if(id===undefined)
		{
			
			timers.push(this);
			this.ID=timers.length-1;
			id=timers.length-1;
		}
		else
		{
			this.ID=id;
			if (timers[id]!==undefined)
			{
				alert("id passed in is not unique, so it cannot be added to the global array");
				return;
			}
			timers[id]=this;
			timers.length++;
		}

/**
*This function starts the Timer.
**/		
this.start=function()
	{
	
	//CurrentTimer=this;
		//this.currentTime=0;
//console.log("Time started:"+this.currentTime);
		this.interval=setInterval(function(){ 
		var time=timers[id]; 
		time.dispatchIncrement(time.incrementEvent)},
		this.intervalTime);
//console.log("Timer"+id+" has started");
	}
/**
*This function increments the Timer's currentTime.
*OLD*@param e{Event} The event used for the Observer type pattern.
**/	
Timer.prototype.increment=function(/*e*/)
	{
//var timer=e.detail.timer;
		this.currentTime++;
//console.log("ID: "+timer.ID+" currTime: "+ timer.currentTime);
	}

/**
*This function is responsible for calling all of the functions that are listening to the Timed Events.
*OLD*@param event{Event} The event used for the Observer type pattern.
**/	
Timer.prototype.dispatchIncrement=function(/*event*/)
{
//document.dispatchEvent(event);
//console.log("dispatch inc");
	this.increment();
	for(var i=0;i<this.listeners.length;i++)
	{
		this.listeners[i].call();
	}
} 

/**
*This function stops the Timer.
**/		
Timer.prototype.stop=function()
{
		this.currentTime=0;
		clearInterval(this.interval);
//alert("Timestopped:");
}
/**
*This function returns the currentTime of the Timer.
*@return this.currentTime 
**/	
Timer.prototype.getTime=function()
{
		return this.currentTime;
}
/**
*@return The String representation of this Timer object 
**/
Timer.prototype.toString=function()
{ 
		var time;
		var minutes=Math.floor(this.currentTime/60000);
		time=this.currentTime%60000;
		var seconds=Math.floor(time/100);
		time=time%100;
//console.log("Minutes: "+minutes+" Seconds: "+seconds+" mili: "+time);
		return ""+minutes+":"+seconds+"."+time;

}

/**
*This function adds a Function object to the listeners array
*@param toadd{function} the function that is made into a Function object and added to the Listeners Array
*@param param{Array} the Array of parameters needed in order to call the corresponding function.
**/
Timer.prototype.addListener=function(toadd,param)
{
		if(typeof toadd==='function')
			this.listeners.push(new Function(toadd, param));
		else
		{
			alert("cannot add listener"+toadd+"because it is not a function" )
		}
		//console.log("Listener "+toadd+" added to "+this.ID)
}
/**
*This function gets rid of the last instance of the target function found in this.listeners
*@param target{function} the function that you want to delete from this.listeners
*@return Boolean: true if deletion was successful and false if deletion failed
**/
Timer.prototype.deleteListener=function(target)
{
	var index=-1;
	for(var i=0;i<this.listeners.length;i++)
	{
		var listener=this.listeners[i];
		if(listener.func===target)
			index=i
	}
	
	if(index===-1)
	return false;
	else
	{
		this.listeners.splice(index,1);
		return true;
	}
}
/************************************************************************Function********************************************************************************/
/**
*A constructor for a Function object. A convenience wrapper object for internal use to make keeping an array of functions and parameters easier.
*@param fun{function} the function to be kept.
*@param param{array} The array of parameters used to call the function.
**/	
Function=function(fun,param)
{
	if(typeof fun==='function')
	{	
	this.func=fun;
	this.params=param;
	}
/**
*Calls this function with the corresponding params.
**/
this.call=function()
	{
//console.log("calling function: "+this.func)
		this.func(this.params);
	}	
}
};
