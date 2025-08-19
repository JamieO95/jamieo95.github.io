
const main = document.getElementById("main");
const navSidebar = document.getElementById("navSidebar");

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    navSidebar.style.width = "15%";
    navSidebar.style.minWidth = "250px";
    main.style.marginLeft = "0";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    navSidebar.style.width = "0";
    navSidebar.style.minWidth = "0";
    main.style.marginLeft = "0";
  }

