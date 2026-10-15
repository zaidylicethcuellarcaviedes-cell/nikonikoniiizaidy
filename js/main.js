
/* =========================================
   NIKO NIKO NIII
   Archivo: main.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. CAMBIAR COLORES DE LAS LUCES LED
    // =====================================

    const colorButtons = document.querySelectorAll(".color-btn");

    colorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedColor = button.dataset.color;

            if (!selectedColor) return;

            document.documentElement.style.setProperty(
                "--neon",
                selectedColor
            );

            // Guardar visualmente el botón seleccionado
            colorButtons.forEach((btn) => {
                btn.style.transform = "scale(1)";
                btn.style.outline = "none";
            });

            button.style.transform = "scale(1.15)";
            button.style.outline = "2px solid white";
            button.style.outlineOffset = "4px";

            // Efecto de destello al cambiar el color
            createAurora(
                window.innerWidth / 2,
                100,
                selectedColor,
                18
            );
        });
    });


    // =====================================
    // 2. FILTRAR LOS PRODUCTOS
    // =====================================

    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            // Marcar el filtro activo
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            // Mostrar productos según la categoría
            productCards.forEach((card) => {
                const category = card.dataset.category;

                if (
                    selectedFilter === "todos" ||
                    category === selectedFilter
                ) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });


    // =====================================
    // 3. MENÚ RESPONSIVE PARA CELULARES
    // =====================================

    const menuButton = document.getElementById("menuBtn");
    const navigation = document.querySelector(".nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        // Cerrar el menú al seleccionar una página
        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            });
        });

        // Cerrar el menú con la tecla Escape
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navigation.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            }
        });
    }


    // =====================================
    // 4. EFECTO AURORA AL TOCAR O HACER CLIC
    // =====================================

    function createAurora(x, y, color, quantity = 12) {
        const colors = [
            color,
            "#168cff",
            "#ff36bd",
            "#ffffff",
            "#ff304f"
        ];

        for (let i = 0; i < quantity; i++) {
            const spark = document.createElement("span");

            spark.className = "aurora-burst";

            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 100;

            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            const sparkColor =
                colors[Math.floor(Math.random() * colors.length)];

            const size = 3 + Math.random() * 7;

            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;

            spark.style.setProperty("--burst-color", sparkColor);
            spark.style.setProperty("--move-x", `${moveX}px`);
            spark.style.setProperty("--move-y", `${moveY}px`);

            document.body.appendChild(spark);

            // Eliminar cada destello al terminar la animación
            spark.addEventListener("animationend", () => {
                spark.remove();
            }, { once: true });
        }
    }

    // Detectar clics y toques sin bloquear los botones
    document.addEventListener("click", (event) => {
        // Evitar destellos adicionales al pulsar controles
        if (event.target.closest(
            ".color-btn, .filter-btn, .menu-btn, .back-top"
        )) {
            return;
        }

        const currentColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue("--neon").trim() || "#168cff";

        createAurora(
            event.clientX,
            event.clientY,
            currentColor,
            10
        );
    });


    // =====================================
    // 5. BOTÓN VOLVER ARRIBA
    // =====================================

    const backTopButton = document.getElementById("backTop");

    if (backTopButton) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
                backTopButton.classList.add("visible");
            } else {
                backTopButton.classList.remove("visible");
            }
        });

        backTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // =====================================
    // 6. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    // =====================================

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const emailInput = contactForm.querySelector(
                'input[type="email"]'
            );

            const nameInput = contactForm.querySelector(
                'input[name="nombre"], input[name="name"]'
            );

            const messageInput = contactForm.querySelector(
                "textarea"
            );

            let messageBox = contactForm.querySelector(
                ".form-message"
            );

            if (!messageBox) {
                messageBox = document.createElement("p");
                messageBox.className = "form-message";
                messageBox.setAttribute("role", "status");
                contactForm.appendChild(messageBox);
            }

            // Comprobar campos obligatorios
            if (nameInput && !nameInput.value.trim()) {
                messageBox.textContent =
                    "Por favor, escribe tu nombre.";
                nameInput.focus();
                return;
            }

            if (emailInput) {
                const email = emailInput.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(email)) {
                    messageBox.textContent =
                        "Escribe un correo electrónico válido.";
                    emailInput.focus();
                    return;
                }
            }

            if (messageInput && !messageInput.value.trim()) {
                messageBox.textContent =
                    "Por favor, escribe tu mensaje.";
                messageInput.focus();
                return;
            }

            messageBox.textContent =
                "¡Formulario validado correctamente! Para enviar el mensaje, conecta el formulario a un servicio de envío.";

            contactForm.reset();
        });
    }


    // =====================================
    // 7. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
    // =====================================

    const copyright = document.querySelector(".copyright");

    if (copyright) {
        copyright.textContent =
            `© ${new Date().getFullYear()} Niko Niko Niii. Proyecto académico.`;
    }


    // =====================================
    // 8. EFECTO DE ENTRADA EN LAS TARJETAS
    // =====================================

    const cards = document.querySelectorAll(
        ".product-card, .feature-card"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        cards.forEach((card) => observer.observe(card));
    }

    console.log("🎮 Niko Niko Niii está listo. ¡Modo gamer activado!");
});
