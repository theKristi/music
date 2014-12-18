$(document).ready(setUp); // End Document Ready
var colorTable=["red", "green", "blue","yellow"]
var song;
function setUp()
{
//setUpPlay();
//changeInstrument();
 song=new Song(); 
//song.createTracks($('#userTrackNumber option:selected').val());
$("#userTrackNumber").change(song.displayTracks);
//song.createTracks(4);
song.displayTracks(); 
hideTabs("welcome");

 }
 
function hideTabs(notToHide)
{
	
	$("#"+notToHide).trigger("click");
	
}
		
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

