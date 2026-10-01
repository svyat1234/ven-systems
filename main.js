const menuButton = document.querySelector(".header__menu-toggle");
const menu = document.querySelector("#header-menu");

if (menuButton && menu) {
    const mobileBreakpoint = window.matchMedia("(max-width: 1400px)");

    const setMenuOpen = (isOpen) => {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
        menu.classList.toggle("is-open", isOpen);
    };

    menuButton.addEventListener("click", () => {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            menuButton.focus();
        }
    });

    mobileBreakpoint.addEventListener("change", () => setMenuOpen(false));
}
