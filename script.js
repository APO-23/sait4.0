document.addEventListener("DOMContentLoaded", function () {
    // === 🔧 ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ ===
    const header = document.querySelector("header");
    const currentPath = window.location.pathname;
    const isMainPage = currentPath.endsWith("index.html") || currentPath === "/";
    let lastScrollTop = 0;

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const fillFormBtn = document.getElementById("fillFormBtn");
    const conversionCounter = document.getElementById("conversionCounter");

    const authModal = document.getElementById("authModal");
    const closeBtn = document.querySelector(".close");
    const modalTitle = document.getElementById("modalTitle");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const authActionBtn = document.getElementById("authActionBtn");
    const registerBtnAction = document.getElementById("registerBtnAction");

    const toggleToRegister = document.getElementById("toggleToRegister");
    const toggleToLogin = document.getElementById("toggleToLogin");

    const regName = document.getElementById("regname");
    const regEmail = document.getElementById("regEmail");
    const regPass = document.getElementById("regPass");
    const confirmPass = document.getElementById("confirmPass");

    const errorText = document.getElementById("errorText");
    const loginError = document.getElementById("loginError");

    const dobInput = document.getElementById("dob");

    const toggleBtn = document.getElementById("toolsToggle");
    const toolsMenu = document.getElementById("toolsMenu");

    // === 📅 Ограничение ввода даты рождения ===
    if (dobInput) {
        dobInput.addEventListener("input", function () {
            let parts = this.value.split("-");
            if (parts.length === 3) {
                parts[0] = parts[0].substring(0, 4);
                this.value = parts.join("-");
            }
        });
    }

    // === 👁️ Переключение пароля ===
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = document.getElementById(this.dataset.target);
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            this.textContent = isPassword ? '🚫' : '👁️';
        });
    });

    // === 📜 Плавный скролл ===
    function smoothScroll(targetId) {
        let targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    const homeBtn = document.querySelector("nav ul li a[href='#']");
    const aboutBtn = document.querySelector("nav ul li a[href='#about']");
    const contactsBtn = document.getElementById("contactsBtn");
    const convertersBtn = document.getElementById("convertersBtn");

    if (homeBtn) homeBtn.addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    if (aboutBtn) aboutBtn.addEventListener("click", e => { e.preventDefault(); smoothScroll("about"); });
    if (contactsBtn) contactsBtn.addEventListener("click", e => { e.preventDefault(); smoothScroll("contact"); });
    if (convertersBtn) convertersBtn.addEventListener("click", e => { e.preventDefault(); smoothScroll("converters"); });

    // === 🧢 Скрытие хедера при прокрутке на главной ===
    if (isMainPage && header) {
        window.addEventListener("scroll", function () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            header.classList.toggle("hidden", scrollTop > lastScrollTop);
            lastScrollTop = scrollTop;
        });
    } else if (header) {
        header.classList.remove("hidden");
    }

    // === 🔐 Авторизация: Проверка статуса входа ===
    function updateConversionCounterVisibility() {
        const isLoggedIn = localStorage.getItem("userEmail") !== null;
        if (!conversionCounter) return;

        if (isLoggedIn) {
            conversionCounter.style.display = "none";
        } else {
            const remaining = parseInt(localStorage.getItem("remainingConversions") || '3');
            conversionCounter.style.display = "block";
            conversionCounter.textContent = `Осталось ${remaining} конвертации`;
        }
    }

    function checkLoginStatus() {
        const email = localStorage.getItem("userEmail");
        const isLoggedIn = !!email;

        loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
        registerBtn.style.display = isLoggedIn ? "none" : "inline-block";
        fillFormBtn.style.display = isLoggedIn ? "inline-block" : "none";
        logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";

        updateConversionCounterVisibility();
    }

    // === 🧾 Регистрация ===
   registerBtnAction.addEventListener("click", function () {
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const pass = regPass.value.trim();
    const confirm = confirmPass.value.trim();

    errorText.style.display = "none";
    loginError.style.display = "none";

    const forbiddenSymbols = /[<>"'&]/;
    const hasUppercase = /[A-Z]/;
    const hasDigit = /\d/;
    const hasSpecial = /[!@#$%^*()_+=\-{}[\]:;.,?]/; // допустимые спецсимволы

    // Проверка email
    if (!email.includes("@gmail.com") || forbiddenSymbols.test(email)) {
        errorText.textContent = "Email должен содержать @gmail.com и не содержать < > \" ' &";
        errorText.style.display = "block";
        return;
    }

    // Проверка пароля
    if (pass.length < 8) {
        errorText.textContent = "Пароль должен содержать минимум 8 символов.";
        errorText.style.display = "block";
        return;
    }

    if (forbiddenSymbols.test(pass)) {
        errorText.textContent = "Пароль не должен содержать символы: < > \" ' &";
        errorText.style.display = "block";
        return;
    }

    if (!hasUppercase.test(pass)) {
        errorText.textContent = "Пароль должен содержать хотя бы одну заглавную букву.";
        errorText.style.display = "block";
        return;
    }

    if (!hasDigit.test(pass)) {
        errorText.textContent = "Пароль должен содержать хотя бы одну цифру.";
        errorText.style.display = "block";
        return;
    }

    if (!hasSpecial.test(pass)) {
        errorText.textContent = "Пароль должен содержать хотя бы один специальный символ.";
        errorText.style.display = "block";
        return;
    }

    if (pass !== confirm) {
        errorText.textContent = "Пароли не совпадают!";
        errorText.style.display = "block";
        return;
    }

    // Если всё ок — сохраняем
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ email, pass });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userEmail", email);
    localStorage.setItem("remainingConversions", '3');

    authModal.style.display = "none";
    checkLoginStatus();
});

    // === 🔓 Вход ===
    authActionBtn.addEventListener("click", function () {
        const email = document.getElementById("loginEmail").value.trim();
        const pass = document.getElementById("loginPass").value.trim();

        loginError.style.display = "none";

        if (!email.includes("@gmail.com") || pass.length < 8) {
            loginError.textContent = "Неверный формат email или короткий пароль.";
            loginError.style.display = "block";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let foundUser = users.find(user => user.email === email && user.pass === pass);

        if (foundUser) {
            localStorage.setItem("userEmail", email);
            authModal.style.display = "none";
            checkLoginStatus();
        } else {
            loginError.textContent = "Неверный email или пароль. Зарегистрируйтесь.";
            loginError.style.display = "block";
        }
    });

    // === 🚪 Выход ===
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("userEmail");
        localStorage.setItem("remainingConversions", '3');
        checkLoginStatus();
    });

    // === 🧊 Окно авторизации ===
    authModal.style.display = "none";
    loginBtn.addEventListener("click", () => showModal("Вход"));
    registerBtn.addEventListener("click", () => showModal("Регистрация"));

    toggleToRegister.addEventListener("click", e => { e.preventDefault(); showModal("Регистрация"); });
    toggleToLogin.addEventListener("click", e => { e.preventDefault(); showModal("Вход"); });

    function showModal(mode) {
        authModal.style.display = "flex";
        modalTitle.innerText = mode;
        loginForm.style.display = mode === "Вход" ? "block" : "none";
        registerForm.style.display = mode === "Регистрация" ? "block" : "none";
        loginError.style.display = "none";
        errorText.style.display = "none";
    }

    closeBtn.addEventListener("click", () => authModal.style.display = "none");
    window.addEventListener("click", e => { if (e.target === authModal) authModal.style.display = "none"; });

    // === 🍔 Меню/инструменты ===
    document.querySelectorAll(".menu-btn").forEach(btn => {
        btn.addEventListener("click", function (event) {
            let menu = this.nextElementSibling;
            menu.style.display = menu.style.display === "block" ? "none" : "block";
            event.stopPropagation();
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".menu").forEach(menu => menu.style.display = "none");
    });

    toggleBtn?.addEventListener("click", e => {
        e.stopPropagation();
        toolsMenu.style.display = toolsMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", e => {
        if (!toolsMenu.contains(e.target) && e.target !== toggleBtn) {
            toolsMenu.style.display = "none";
        }
    });

    checkLoginStatus(); // Запуск при загрузке
});


// === 🎥 Асинхронная конвертация ===
function startConversion() {
    const fileInput = document.querySelector('input[type="file"]');
    const format = document.getElementById('format').value;
    const resultDiv = document.getElementById('conversionResult');
    const errorMsg = document.getElementById('errorMessage');
    const counterDisplay = document.getElementById('conversionCounter');

    resultDiv.innerHTML = "";
    errorMsg.style.display = "none";

    const isLoggedIn = localStorage.getItem("userEmail") !== null;

    if (!fileInput.files.length) {
        errorMsg.textContent = "Пожалуйста, выберите файл для конвертации.";
        errorMsg.style.display = "block";
        return;
    }

    if (!isLoggedIn) {
        let remaining = parseInt(localStorage.getItem("remainingConversions") || '3');

        if (remaining <= 0) {
            errorMsg.textContent = "Вы исчерпали лимит бесплатных конвертаций. Войдите в аккаунт для продолжения.";
            errorMsg.style.display = "block";
            return;
        }

        // Уменьшаем счётчик только для незарегистрированных пользователей
        remaining--;
        localStorage.setItem("remainingConversions", remaining);

        // Обновляем надпись
        if (counterDisplay) {
            counterDisplay.textContent = `Осталось ${remaining} конвертации`;
        }

        // Показываем сообщение, если попытки кончились
        if (remaining === 0) {
            errorMsg.textContent = "Вы исчерпали лимит бесплатных конвертаций. Войдите в аккаунт для продолжения.";
            errorMsg.style.display = "block";
        }
    }

    const file = fileInput.files[0];
   resultDiv.innerHTML = `<p>Файл "${file.name}" будет сконвертирован в формат <strong>${format.toUpperCase()}</strong>. (Функционал в разработке)</p>`;
}
// Заменяем текущий код галереи на этот
document.addEventListener("DOMContentLoaded", function() {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    // Инициализация Hammer.js для свайпа
    const hammer = new Hammer(gallery);
    hammer.on('swipeleft', function() {
        document.querySelector('.gallery-btn.right').click();
    });
    hammer.on('swiperight', function() {
        document.querySelector('.gallery-btn.left').click();
    });

    // Остальной код галереи остается без изменений
    const leftBtn = document.querySelector(".gallery-btn.left");
    const rightBtn = document.querySelector(".gallery-btn.right");
    const images = gallery.children;
    const imageCount = images.length;
    const visibleCount = 4;
    let index = 0;

    function updateGallery() {
        const imageWidth = images[0].offsetWidth + 20;
        const maxIndex = imageCount - visibleCount;
        const offset = -index * imageWidth;
        gallery.style.transform = `translateX(${offset}px)`;

        leftBtn.disabled = index === 0;
        rightBtn.disabled = index === maxIndex;
    }

    rightBtn.addEventListener("click", () => {
        if (index < imageCount - visibleCount) {
            index++;
            updateGallery();
        }
    });

    leftBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
            updateGallery();
        }
    });

    window.addEventListener("resize", updateGallery);
    updateGallery();
});
// Динамическая корректировка отступа для формы
document.addEventListener("DOMContentLoaded", function() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        const headerHeight = document.querySelector('header').offsetHeight;
        formContainer.style.marginTop = `${headerHeight + 30}px`;
    }
});