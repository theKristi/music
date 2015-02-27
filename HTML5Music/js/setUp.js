/*his is the setup for the main driver*/ 
$(document).ready(setUp); // End Document Ready
/*Global variables*/
/*colorTable: this is the array that defines the color for each track*/
var colorTable=["red", "green", "blue","yellow"]
/*song:the data structure that holds everything "song" related*/
var song;
/*
*This function creates the song and the corresponding tabs.
* Also sets the onChange event handler for the "number of voices" selector
*/
function setUp()
{

 song=new Song(); 
$("#userTrackNumber").change(song.displayTracks);
song.displayTracks(); 
hideTabs("welcome");

 }
 /*
 * This function hides all tabs content except the parameter
 *@param notToHide {string} id of the content tab you don't want to hide.(The one you want to show)
 */
function hideTabs(notToHide)
{
	
	$("#"+notToHide).trigger("click");
	
}
/*
* handles displaying the content based on which tab has been clicked.
*/		
function tabSwitch()
{
		$('#menu').find("li a").on('click',function(e)
				{
					e.preventDefault();
					    				
    				var parentID = this.id;
					
					/*
					 * Update the menu buttons to show active button (Button Clicked)
					 */
  					$('#menu .active').removeClass('active');
    				$(this).parent('li').addClass('active');
    				
    				/*
    				 * Switch the content views. Hide all divs but the button clicked
    				 */
    				$("#content_container").find("#content > div").each(
    					function()
    					{
    						(this.className == parentID) ?  $(this).removeAttr("style") : $(this).attr("style","display:none;");
    					}
    				);
				});
				
}//end tabSwitch
function updateTimer(timerArray)
{
	var timer=timerArray[0];
//console.log("updateTimer:"+timer)
	$("#timer"+(timer.ID+1)).text(timer);
}

