document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("navSidebar");
    const btnOpen = document.getElementById("btnOpen");
    const btnClose = document.getElementById("btnClose");
    const linkClicked = sessionStorage.getItem("linkClicked");

    if (!sidebar) return;

    // Temporarily disable transitions to avoid animation on page load
    sidebar.classList.add("no-transition");
    
    let savedState = sessionStorage.getItem("sidebarState");

    if (!savedState) {
        if (window.innerWidth > 768) {
            savedState = "open"; // Default to open on larger screens
        }
        else {
            savedState = "closed"; // Default to closed on smaller screens
        }
    }

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

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".post-content img");

    images.forEach(img => {
        img.addEventListener("click", function () {
            // create overlay
            const overlay = document.createElement("div");
            overlay.className = "img-overlay";

            const bigImg = document.createElement("img");
            bigImg.src = this.src;
            bigImg.alt = this.alt;

            overlay.appendChild(bigImg);
            document.body.appendChild(overlay);

            // close on click
            overlay.addEventListener("click", function () {
                overlay.remove();
            });
        });
    });
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        document.querySelector(".img-overlay")?.remove();
    }
});