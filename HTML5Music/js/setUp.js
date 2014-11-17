$(document).ready(setUp); // End Document Ready
function setUp()
{
setUpPlay();
tabSwitch();
 var name=$("#userInstrument option:selected").text();
 
 var instrument=buildInstrument(name);
 
 instrument.build();
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

