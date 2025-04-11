
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menuIcon");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const blocksMenu = document.getElementById("blocksMenu");
    const menuItems = document.querySelectorAll(".menu-item");
    const submenus = document.querySelectorAll(".submenu");
    const menuTitle = document.getElementById("menu-title");
    
    let breadcrumb = ["Blocks"];

    function updateBreadcrumb() {
        menuTitle.innerHTML = breadcrumb.join(" > ");
    }

    function resetMenu() {
        blocksMenu.style.display = "grid";
        submenus.forEach((submenu) => submenu.classList.remove("show"));
        breadcrumb = ["Blocks"];
        updateBreadcrumb();
    }

    menuButton.addEventListener("click", function (event) {
        dropdownMenu.classList.toggle("show");
        resetMenu();
        event.stopPropagation();
    });

    menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.stopPropagation();
            const sectionId = this.getAttribute("data-section");

            if (sectionId) {
                document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
                const targetSection = document.getElementById(sectionId);
                targetSection.style.display = "block";
                targetSection.classList.add("keep-open");
                dropdownMenu.classList.remove("show");
            }
        });
    });

    menuItems.forEach((trigger, index) => {
        trigger.addEventListener("click", function (event) {
            event.stopPropagation();
            blocksMenu.style.display = "none";
            submenus.forEach((submenu) => submenu.classList.remove("show"));
            submenus[index].classList.add("show");
            
            let menuName = this.innerText.trim();
            if (!breadcrumb.includes(menuName)) {
                breadcrumb.push(menuName);
            }
            updateBreadcrumb();
        });
    });

    menuTitle.addEventListener("click", function (event) {
        if (breadcrumb.length > 1) {
            event.stopPropagation();
            breadcrumb.pop();
            updateBreadcrumb();

            if (breadcrumb.length === 1) {
                resetMenu();
            } else {
                submenus.forEach((submenu) => submenu.classList.remove("show"));
                let lastMenu = breadcrumb[breadcrumb.length - 1];
                let lastMenuIndex = [...menuItems].findIndex(trigger => trigger.innerText.trim() === lastMenu);
                if (lastMenuIndex !== -1) {
                    submenus[lastMenuIndex].classList.add("show");
                }
            }
        }
    });

    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && event.target !== menuButton) {
            dropdownMenu.classList.remove("show");
            resetMenu();
        }
    });

    document.querySelectorAll(".submenu-item").forEach((item) => {
        item.addEventListener("click", function (event) {
            event.stopPropagation();
            const sectionId = item.getAttribute("data-section");
            const selectedText = item.querySelector("span").innerText.toLowerCase();

            document.querySelectorAll("section").forEach((sec) => sec.style.display = "none");
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = "block";
                const dropdownBtn = targetSection.querySelector(".dropdown-btn");
                if (dropdownBtn) {
                    dropdownBtn.textContent = selectedText;
                }
            } else {
                console.error("Section not found:", sectionId);
            }
            dropdownMenu.classList.remove("show");
        });
    });

    document.querySelectorAll(".dropdown-btn").forEach((btn) => {
        btn.addEventListener("click", function (event) {
            event.stopPropagation();
            document.querySelectorAll(".dropdown-content").forEach((content) => {
                if (content !== this.nextElementSibling) content.classList.remove("show");
            });
            this.nextElementSibling.classList.toggle("show");
        });
    });

    document.querySelectorAll(".dropdown .option").forEach((option) => {
        option.addEventListener("click", function (event) {
            event.stopPropagation();
            const dropdown = this.closest(".dropdown");
            dropdown.querySelector(".dropdown-btn").textContent = this.textContent;
            dropdown.querySelectorAll(".option").forEach((opt) => opt.classList.remove("selected"));
            this.classList.add("selected");
            dropdown.querySelector(".dropdown-content").classList.remove("show");
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown-content").forEach((content) => content.classList.remove("show"));
    });

        const sections = document.querySelectorAll(".div-block, .style-block, .keyframe-block");
     
        // Function to update the section state
        function updateSectionState(section, isExpanded) {
            const expandableBlock = section.querySelector(".open");
            const toggleBtn = section.querySelector(".toggle-btn");
            const chevronIcon = toggleBtn.querySelector("i");
            const closeSpan = section.querySelector(".close");
            const keyframeContent = section.querySelector(".keyframe-content");
     
            expandableBlock.classList.toggle("expanded", isExpanded);
            chevronIcon.classList.toggle("fa-chevron-down", isExpanded);
            chevronIcon.classList.toggle("fa-chevron-right", !isExpanded);
     
            if (keyframeContent) {
                keyframeContent.style.display = isExpanded ? "block" : "none";
            }
            if (closeSpan) {
                closeSpan.style.display = isExpanded ? "block" : "none";
            }
        }
     
        sections.forEach(section => {
            const toggleBtn = section.querySelector(".toggle-btn");
            const closeBtns = section.querySelectorAll(".close-btn");
            const expandableBlock = section.querySelector(".open");
            const addBtn = section.querySelector(".add-btn");
            const keyframeStep = section.querySelector(".keyframe-step");
            const removeBtn = keyframeStep ? keyframeStep.querySelector(".remove-btn") : null;
     
            let isExpanded = expandableBlock.classList.contains("expanded");
     
            // Apply initial state
            updateSectionState(section, isExpanded);
     
            // Toggle block on click
            if (toggleBtn) {
                toggleBtn.addEventListener("click", function () {
                    isExpanded = !isExpanded;
                    updateSectionState(section, isExpanded);
                });
            }
     
            // Close section on close button click
            closeBtns.forEach(closeBtn => {
                closeBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    section.style.display = "none";
                });
            });
     
            // Show keyframe-step on + button click
            if (addBtn && keyframeStep) {
                addBtn.addEventListener("click", function () {
                    keyframeStep.classList.add("show");
                });
            }
     
            // Remove keyframe-step on remove button click
            if (removeBtn) {
                removeBtn.addEventListener("click", function () {
                    keyframeStep.classList.remove("show");
                });
            }
        });
     
        // Fix for dynamically hiding keyframe-step when clicked outside
        document.addEventListener("click", function (event) {
            const allKeyframeSteps = document.querySelectorAll(".keyframe-step.show");
            allKeyframeSteps.forEach(step => {
                if (!step.contains(event.target) && !event.target.classList.contains("add-btn")) {
                    step.classList.remove("show");
                }
            });
        });
  
});
