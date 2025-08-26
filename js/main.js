document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("navSidebar");
    const btnOpen = document.getElementById("btnOpen");
    const btnClose = document.getElementById("btnClose");
    const linkClicked = sessionStorage.getItem("linkClicked");

    if (!sidebar) return;

    // Temporarily disable transitions to avoid animation on page load
    sidebar.classList.add("no-transition");
    
    const savedState = sessionStorage.getItem("sidebarState");

    if (savedState === "open") {
        sidebar.classList.add("open");
    } else if (savedState === "closed") {
        sidebar.classList.remove("open");
    }

    // Re-enable transitions after a short delay
    void sidebar.offsetWidth; 
    sidebar.classList.remove("no-transition");

    btnOpen.addEventListener("click", () => {
        sidebar.classList.add("open");
        sessionStorage.setItem("sidebarState", "open");
        console.log("Sidebar open");
    });

    btnClose.addEventListener("click", () => {
        sidebar.classList.remove("open");
        sessionStorage.setItem("sidebarState", "closed");
        console.log("Sidebar closed");
    });

    // Close sidebar when clicking outside of it on small screens
    const navbarLinks = sidebar.querySelectorAll("a");
    navbarLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 480) {
                sessionStorage.setItem("linkClicked", "true");
                
            }
        });
    });

    if (linkClicked === "true" && window.innerWidth <= 480) {
                sidebar.classList.remove("open");
                sessionStorage.setItem("sidebarState", "closed");
                console.log("Sidebar closed via link click");
                sessionStorage.removeItem("linkClicked");
    }
});
