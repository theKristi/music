/*his is the setup for the main driver*/ 
$(document).ready(setUp); // End Document Ready
/*Global variables*/
/*colorTable: this is the array that defines the color for each track*/
var colorTable=["rgb(255, 0, 0)", "rgb(0, 128, 0)", "rgb(0, 0, 255)","rgb(255, 255, 0)"]
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
MIDI.Player.addListener(updateTrack);
MIDI.Player.setAnimation(listenForEnd)

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

 

