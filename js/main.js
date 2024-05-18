
$(document).ready( function()
{ 
  includeHTML();
/* 	getHoursOfOperation();
    getLeagueInformation();
    getBowlingProducts(); */

  // Get the element with id="defaultOpen" and click on it
  


/* var elem = document.getElementById('productsTablesParent'); //YOUR DIV ELEMENT WHICH YOU WANT TO SCROLL
var scroll = 0; //SETTING INITIAL SCROLL TO 0

window.setInterval(function(){ 

 if(elem.scrollLeft > scroll)
  scroll = elem.scrollLeft;

 elem.scrollTo({ right: scroll, behavior: 'smooth' }) //SCROLL THE ELEMENT TO THE SCROLL VALUE WITH A SMOOTH BEHAVIOR
 scroll += 1; //AUTOINCREMENT SCROLL
}, 50); //THIS WILL RUN IN EVERY 50 MILISECONDS */

}); // end (document).ready


// **************** Header Navbar Functionality ***************************
function openTab(tabName,elmnt,color) 
{

  document.getElementById("defaultOpen").style.display = "none";

  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(tabName).style.display = "block";
  elmnt.style.backgroundColor = color;
  
}

// *** WW3 Schools Script to input other HTML here ***
function includeHTML() 
{
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
