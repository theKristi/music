var whiteNoteDictionary=["C","D","E","F","G","A","B"];
var blackNoteDictionary=["Db","Eb","Gb","Ab","Bb"];
function buildPiano()
{
	$("#playTab").append("<div id='pianoBody'></div>");
	$("#pianoBody").append("<div id='pianoSounds' style='display:none;'></div>");
	buildOctaves();
}//end buildPiano
function addSound(keyid)
{
	//add white keys

	$("#pianoSounds").append("<audio preload='auto' id='"+keyid+"_sound' controls><source src='sondfonts/acoustic_grand_piano-mp3/"+keyid+".mp3' type='audio/mpeg'></audio>");
//console.log("trying to play: "+keyid);
	$("#"+keyid).mousedown([keyid],playAudio);
	$("#"+keyid).mouseup([keyid],keymouseup);
	$("#"+keyid).mouseout([keyid],keymouseup);
	$("#"+keyid+"_sound").on("ended",[keyid],noteEnded);
	

	
}


function buildOctaves()
{ 
 for(i=0;i<9;i++)
 {	
 var octaveid="o"+i;

 $("#pianoBody").append("<div id="+octaveid+" class='octave'></div>")
	if(i===0)
	{
		addWhiteKeys(octaveid,i,2,50);
		addBlackKey(octaveid,"Bb0",25,35.16)
		
	}
	else if(i===8)
	{
		addWhiteKeys(octaveid,i,1,100);
		
	}
	else
	{
		addWhiteKeys(octaveid,i,7,undefined);
		var flatsID=octaveid+"_flats";
		$("#"+octaveid).append("<div class='flats' id="+flatsID+"></div>")
		addBlackKeys(flatsID,i);
	}

 }
 
}
function addWhiteKeys(octave,index,numberToAdd, width)
{
	var y=0;
	while(y<numberToAdd)
	{
	var id;
	if(index!=0)
		id=whiteNoteDictionary[y]+index;
	else
		id=whiteNoteDictionary[y+5]+index;
	addWhiteKey(octave,id,width);
	y++;
	}
}
function addWhiteKey(octave,id,width)
{
	var key;
	if(width!=undefined)
	{
	key="\
	<div class='keyWhite' id="+id+" style='width:"+width+"%'></div>";
	}
	else
	{
	key="\
	<div class='keyWhite' id="+id+"></div>";
	}
	$("#"+octave).append(key);
	addSound(id);

} 
function addBlackKeys(flatOctave,index)
{
	var v=0
	while(v<5)
	{ 
	 addBlackKey(flatOctave,blackNoteDictionary[v]+index,undefined,undefined);
	 v++;
	}
}
function addBlackKey(octave,id,width,left)
{
	var key;
	if(width!=undefined && left!=undefined)
	{
	key="\
	<div class='keyBlack' id="+id+" style='width:"+width+"%; left:"+left+"%'></div>";
	}
	else
	{
		key="\
	<div class='keyBlack' id="+id+"></div>";
	}
	$("#"+octave).append(key);
	addSound(id);
}