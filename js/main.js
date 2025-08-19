document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("navSidebar");
    const btnOpen = document.getElementById("btnOpen");
    const btnClose = document.getElementById("btnClose");

    btnOpen.addEventListener("click", () => {
        sidebar.classList.add("open");
        console.log("Sidebar open");
    });

    btnClose.addEventListener("click", () => {
        sidebar.classList.remove("open");
        console.log("Sidebar closed");
    });
});
