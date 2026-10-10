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
        if (!event.defaultPrevented && event.target instanceof Element && event.target.closest("a")) {
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
            if (document.querySelector(".header.is-catalog-open")) return;
            setMenuOpen(false);
            menuButton.focus();
        }
    });

    mobileBreakpoint.addEventListener("change", () => setMenuOpen(false));
}

const header = document.querySelector(".header");
const catalogLink = header?.querySelector(".header__link--catalog");
const headerMenu = header?.querySelector(".header__menu");

if (header instanceof HTMLElement && catalogLink instanceof HTMLAnchorElement && headerMenu instanceof HTMLElement) {
    const categories = [
        "Воздуховоды",
        "Вентиляторы",
        "Канальные вентиляторы",
        "Детали систем вентиляции",
        "Приборы автоматики",
        "Крепёж для вентиляции",
        "Фильтры для вентиляции",
        "Приточно-вытяжная вентиляция",
        "Акции",
        "Вентиляционные решетки и диффузоры",
        "Вентиляционные установки",
        "Канальные нагреватели",
    ];
    const ductSubcategories = [
        "Воздуховоды в огнезащите",
        "Воздуховоды круглого сечения",
        "Гибкие неизолированные воздуховоды",
        "Гибкие теплоизолированные воздуховоды",
        "Гибкие шумопоглощающие воздуховоды",
        "Круглые сварные воздуховоды",
        "Прямоугольные воздуховоды из оцинкованной и нержавеющей стали",
        "Прямоугольные сварные воздуховоды",
    ];
    const catalogPanel = document.createElement("section");
    catalogPanel.className = "header__catalog-panel";
    catalogPanel.id = "header-catalog";
    catalogPanel.setAttribute("aria-label", "Каталог товаров");
    catalogPanel.setAttribute("aria-hidden", "true");
    catalogPanel.innerHTML = `
        <div class="header__catalog-categories" role="group" aria-label="Категории каталога">
            ${categories.map((category, index) => `
                <button class="header__catalog-category${index === 0 ? " is-active" : ""}" type="button" data-category-index="${index}" aria-pressed="${index === 0}">
                    ${category}<span class="header__catalog-category-arrow" aria-hidden="true">›</span>
                </button>
            `).join("")}
        </div>
        <div class="header__catalog-content" aria-live="polite">
            <h2 class="header__catalog-title">Воздуховоды</h2>
            <div class="header__catalog-subcategories">
                ${ductSubcategories.map((subcategory) => `
                    <a class="header__catalog-subcategory" href="catalog-category.html">${subcategory}</a>
                `).join("")}
            </div>
        </div>
    `;
    headerMenu.append(catalogPanel);
    catalogLink.setAttribute("aria-haspopup", "true");
    catalogLink.setAttribute("aria-controls", catalogPanel.id);
    catalogLink.setAttribute("aria-expanded", "false");

    const categoryButtons = catalogPanel.querySelectorAll(".header__catalog-category");
    const content = catalogPanel.querySelector(".header__catalog-content");
    let closeTimer;

    const setCatalogOpen = (isOpen) => {
        window.clearTimeout(closeTimer);
        header.classList.toggle("is-catalog-open", isOpen);
        catalogLink.setAttribute("aria-expanded", String(isOpen));
        catalogPanel.setAttribute("aria-hidden", String(!isOpen));
    };

    const selectCategory = (button) => {
        const categoryIndex = Number(button.dataset.categoryIndex);
        const category = categories[categoryIndex];
        categoryButtons.forEach((categoryButton) => {
            const isActive = categoryButton === button;
            categoryButton.classList.toggle("is-active", isActive);
            categoryButton.setAttribute("aria-pressed", String(isActive));
        });

        if (!content) return;
        const subcategories = categoryIndex === 0
            ? `<div class="header__catalog-subcategories">${ductSubcategories.map((subcategory) => `<a class="header__catalog-subcategory" href="catalog-category.html">${subcategory}</a>`).join("")}</div>`
            : `<p class="header__catalog-empty">Подкатегории скоро появятся</p>`;
        content.innerHTML = `<h2 class="header__catalog-title">${category}</h2>${subcategories}`;
    };

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => selectCategory(button));
        button.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "mouse" && window.matchMedia("(min-width: 1401px)").matches) {
                selectCategory(button);
            }
        });
    });

    const scheduleClose = () => {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => setCatalogOpen(false), 250);
    };

    catalogLink.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse" && window.matchMedia("(min-width: 1401px)").matches) {
            setCatalogOpen(true);
        }
    });
    catalogLink.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "mouse") scheduleClose();
    });
    catalogPanel.addEventListener("pointerenter", () => window.clearTimeout(closeTimer));
    catalogPanel.addEventListener("pointerleave", scheduleClose);
    catalogLink.addEventListener("focus", () => setCatalogOpen(true));
    catalogPanel.addEventListener("focusin", () => setCatalogOpen(true));
    header.addEventListener("focusout", (event) => {
        if (event.relatedTarget instanceof Node && headerMenu.contains(event.relatedTarget)) return;
        window.setTimeout(() => {
            if (!headerMenu.contains(document.activeElement)) setCatalogOpen(false);
        });
    });

    catalogLink.addEventListener("click", (event) => {
        if (window.matchMedia("(max-width: 1400px)").matches && !header.classList.contains("is-catalog-open")) {
            event.preventDefault();
            event.stopPropagation();
            setCatalogOpen(true);
        }
    });

    document.addEventListener("click", (event) => {
        if (!header.contains(event.target)) setCatalogOpen(false);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && header.classList.contains("is-catalog-open")) {
            catalogLink.focus();
            setCatalogOpen(false);
        }
    });

    window.matchMedia("(max-width: 1400px)").addEventListener("change", () => setCatalogOpen(false));
}

const feedbackModal = document.querySelector(".feedback-modal");

if (feedbackModal instanceof HTMLDialogElement) {
    const feedbackTriggers = document.querySelectorAll(
        ".header__button, .hero__button--primary, .feedback__button"
    );
    const closeButton = feedbackModal.querySelector(".feedback-modal__close");

    feedbackTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => feedbackModal.showModal());
    });

    closeButton.addEventListener("click", () => feedbackModal.close());

    feedbackModal.addEventListener("click", (event) => {
        if (event.target === feedbackModal) {
            feedbackModal.close();
        }
    });
}

const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq__question");

    if (!(question instanceof HTMLButtonElement)) return;

    item.addEventListener("click", () => {
        const shouldOpen = !item.classList.contains("faq__item--active");

        faqItems.forEach((faqItem) => {
            faqItem.classList.remove("faq__item--active");
            faqItem.querySelector(".faq__question")?.setAttribute("aria-expanded", "false");
        });

        if (shouldOpen) {
            item.classList.add("faq__item--active");
            question.setAttribute("aria-expanded", "true");
        }
    });
});
