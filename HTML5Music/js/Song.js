/*Song.js is just a container for the tracks. Can create and display tracks*/
/**TODO:needs "song" functions like download(), play(), pause(), stop()**/

/*This function is the constructor for the song object*/
Song=function()
{
	this.tracks=new Array();
	this.createTracks(4);
	
}

/*
*This function creates and array of tracks based on the number passed in
*@param numberToCreate{integer} the number of tracks to create
*/
Song.prototype.createTracks=function(numberToCreate)
{
	for(i=0;i<numberToCreate;i++)
	{
		this.tracks.push(new Track(i+1));
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



