// Variables globales
let userData = { name: '', birthDate: '' };
let isHoldingHeart = false;
let holdProgress = 0;
let holdInterval;
let heartInterval;

// Función para calcular días hasta el próximo cumpleaños
function updateDayCounter() {
    if (!userData.birthDate) return;

    const today = new Date('2025-07-19'); // Fecha actual fija para la aplicación
    const birthDate = new Date(userData.birthDate);
    
    // Comprobamos si hoy es el cumpleaños comparando mes y día
    const isBirthday = today.getMonth() === birthDate.getMonth() && 
                    today.getDate() === birthDate.getDate();

    if (isBirthday) {
        const counterElement = document.getElementById('dayCounter');
        if (counterElement) {
            counterElement.textContent = "¡Hoy es tu día! 🎉";
            counterElement.style.fontSize = "1.3rem"; // Ajustamos el tamaño para el mensaje
        }
        return;
    }

    // Si no es el cumpleaños, calculamos los días restantes
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // Si el cumpleaños de este año ya pasó, calculamos para el próximo año
    if (today > nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    // Si el cumpleaños de este año ya pasó, calculamos para el próximo año
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const timeDiff = nextBirthday.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const counterElement = document.getElementById('dayCounter');
    if (counterElement) {
        counterElement.style.fontSize = "1rem"; // Restauramos el tamaño original
        counterElement.textContent = `${daysDiff} días para tu cumpleaños`;
    }
}

// Mensajes románticos para los corazones interactivos
const loveMessages = [
    "Eres mi razón de sonreír cada día",
    "Tu mirada ilumina mi mundo",
    "Contigo el tiempo se detiene",
    "Eres mi lugar favorito",
    "Tu amor es mi mayor tesoro",
    "Juntos creamos magia",
    "Eres mi sueño hecho realidad",
    "Tu felicidad es mi prioridad",
    "Cada momento contigo es perfecto",
    "Eres la melodía de mi corazón",
    "Tu risa es mi canción favorita",
    "Eres mi hogar y mi aventura"
];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    createFloatingHearts();
    setupEventListeners();
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    const mainHeart = document.getElementById('mainHeart');
    const userForm = document.getElementById('userForm');
    const book = document.getElementById('book');

    // Verificar que los elementos existen
    if (!mainHeart) {
        console.error('Main heart element not found!');
        return;
    }
    
    if (!userForm) {
        console.error('User form element not found!');
        return;
    }

    // Eventos del corazón principal (mouse)
    mainHeart.addEventListener('mousedown', startHeartHold);
    mainHeart.addEventListener('mouseup', stopHeartHold);
    mainHeart.addEventListener('mouseleave', stopHeartHold);
    
    // Eventos del corazón principal (touch para móviles)
    mainHeart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startHeartHold();
    });
    mainHeart.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopHeartHold();
    });

    // Evento del formulario - CRÍTICO
    userForm.addEventListener('submit', (e) => {
        console.log('Form submit event triggered'); // Debug
        handleFormSubmit(e);
    });

    // Evento del libro (si existe)
    if (book) {
        book.addEventListener('click', openBook);
    }
    
    // Prevenir comportamiento por defecto en dispositivos móviles
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('#mainHeart')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    console.log('Event listeners set up successfully'); // Debug
}

/**
 * Inicia el proceso de mantener presionado el corazón
 */
function startHeartHold() {
    isHoldingHeart = true;
    holdProgress = 0;
    
    holdInterval = setInterval(() => {
        if (isHoldingHeart) {
            holdProgress += 2;
            updateProgressBar(holdProgress);
            
            if (holdProgress >= 100) {
                stopHeartHold();
                showFormScreen();
            }
        }
    }, 50);
}

/**
 * Detiene el proceso de mantener presionado el corazón
 */
function stopHeartHold() {
    isHoldingHeart = false;
    
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }
    
    // Resetear progreso gradualmente si no se completó
    setTimeout(() => {
        if (holdProgress < 100) {
            updateProgressBar(0);
            holdProgress = 0;
        }
    }, 100);
}

/**
 * Actualiza la barra de progreso
 * @param {number} progress - Porcentaje de progreso (0-100)
 */
function updateProgressBar(progress) {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
}

/**
 * Muestra la pantalla del formulario
 */
function showFormScreen() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const formScreen = document.getElementById('formScreen');
    
    welcomeScreen.classList.remove('active');
    
    setTimeout(() => {
        formScreen.classList.add('active');
    }, 500);
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento del formulario
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('userName');
    const birthDateInput = document.getElementById('birthDate');
    
    const name = nameInput.value.trim();
    const birthDate = birthDateInput.value;
    
    console.log('Form submitted with:', { name, birthDate }); // Debug
    
    // Validación
    if (!name) {
        alert('Por favor, ingresa tu nombre');
        nameInput.focus();
        return;
    }
    
    if (!birthDate) {
        alert('Por favor, selecciona tu fecha de nacimiento');
        birthDateInput.focus();
        return;
    }
    
    // Guardar datos del usuario
    userData.name = name;
    userData.birthDate = birthDate;
    
    console.log('User data saved:', userData); // Debug
    
    // Iniciar la actualización diaria del contador
    setInterval(updateDayCounter, 86400000); // 24 horas en milisegundos
    
    // Cambiar pantalla
    showContentScreen();
}

/**
 * Muestra la pantalla de contenido principal
 */
function createRainEffect() {
    const rain = document.createElement('div');
    rain.className = 'rain';
    document.body.appendChild(rain);

    const numberOfDrops = 50;
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = Math.random() * 1 + 2 + 's';
        rain.appendChild(drop);
    }
}

function showContentScreen() {
    const formScreen = document.getElementById('formScreen');
    const contentScreen = document.getElementById('contentScreen');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const soundToggle = document.getElementById('soundToggle');
    
    // Crear efecto de lluvia cuando se muestre la pantalla de contenido
    createRainEffect();
    
    console.log('Changing to content screen...'); // Debug
    
    if (formScreen) {
        formScreen.classList.remove('active');
    }
    
    setTimeout(() => {
        if (contentScreen) {
            contentScreen.classList.add('active');
            setupContentScreen();
            
            // Iniciar la música cuando se muestre la pantalla de contenido
            if (backgroundMusic) {
                backgroundMusic.play().catch(err => console.log('Error playing audio:', err));
            }
            
            // Configurar el control de sonido
            if (soundToggle) {
                soundToggle.addEventListener('click', () => {
                    if (backgroundMusic.paused) {
                        backgroundMusic.play();
                        soundToggle.textContent = '🔊';
                    } else {
                        backgroundMusic.pause();
                        soundToggle.textContent = '🔈';
                    }
                });
            }
            setupContentScreen();
            contentScreen.classList.add('active');
            console.log('Content screen should be visible now'); // Debug
            
            // Actualizar el contador de días
            updateDayCounter();
            
            // Crear corazones interactivos después de un pequeño delay
            setTimeout(() => {
                createInteractiveHearts();
            }, 500);
        } else {
            console.error('Content screen element not found!');
        }
    }, 800); // Aumenté el tiempo para asegurar la transición
}

/**
 * Configura la pantalla de contenido con datos personalizados
 */
function setupContentScreen() {
    const greeting = document.getElementById('personalGreeting');
    
    if (!greeting) {
        console.error('Greeting element not found!');
        return;
    }
    
    if (!userData.name) {
        console.error('User name not found in userData:', userData);
        return;
    }
    
    console.log('Setting up content screen for:', userData.name); // Debug
    
    const birthDate = new Date(userData.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Ajustar edad si el cumpleaños no ha pasado este año
    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    greeting.textContent = `Hola ${userData.name} ✨`;
    console.log('Greeting set successfully'); // Debug
}

/**
 * Maneja la apertura del libro interactivo
 */
let messageState = 0;

function openBook() {
    const book = document.getElementById('book');
    const bookContent = document.getElementById('bookContent');
    
    if (!book.classList.contains('opened')) {
        book.classList.add('opened');
        messageState = 0;
        showFirstMessage(bookContent);
    } else if (messageState === 0) {
        book.classList.remove('opened');
        setTimeout(() => {
            messageState = 1;
            showSecondMessage(bookContent);
            book.classList.add('opened');
        }, 500);
    } else if (messageState === 1) {
        book.classList.remove('opened');
        messageState = 2;
    }
}

function showFirstMessage(bookContent) {
    bookContent.innerHTML = `
        <div style="font-size: clamp(1.2rem, 4vw, 1.5rem); margin-bottom: 10px; color: #c44569; padding: 5px;">
            Para ${userData.name} ❤️
        </div>
        <div style="line-height: 1.8; color: #8e44ad; font-size: clamp(0.9rem, 3vw, 1.1rem); padding: 10px;">
            Sé que cometí errores y que te lastimé, y no sabes cuánto me pesa en el corazón.
            Eres demasiado importante para mí,<br>
            por favor, regálame una oportunidad<br>
            <small style="color: #c44569; font-style: italic; font-size: clamp(0.8rem, 2.5vw, 1rem);">
                "No quiero perderte… te lo pido con todo mi corazón." 💖
            </small><br><br>
            <div style="font-size: 0.9rem; color: #c44569; margin-top: 10px;">
                Continuar...
            </div>
        </div>
    `;
}

function showSecondMessage(bookContent) {
    bookContent.innerHTML = `
        <div style="font-size: clamp(1.2rem, 4vw, 1.5rem); margin-bottom: 10px; color: #c44569; padding: 10px; max-width: 100%; overflow-wrap: break-word;">
            Por favor, escúchame ❤️
        </div>
        <div style="line-height: 1.8; color: #8e44ad; font-size: clamp(0.9rem, 3vw, 1.1rem); padding: 10px;">
            "No quiero que esto quede así entre nosotros,porque "no puedo dejar de pensar en ti,
            Me encantaría que me des la oportunidad de verte."<br>
            <small style="color: #c44569; font-style: italic; font-size: clamp(0.8rem, 2.5vw, 1rem);">
                "Déjame invitarte a salir,<br>
                y demostrarte que puedo hacerlo mejor." 💖
            </small><br><br>
        </div>
            <button onclick="sendWhatsAppMessage()" style="
                background: linear-gradient(135deg, #ff6b9d, #c44569);
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 1rem;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                max-width: 100%;
            ">
                Sí, acepto ❤️
            </button>
        
    `;
}

function sendWhatsAppMessage() {
    // Reemplaza este número con tu número de WhatsApp (incluye el código de país)
    const phoneNumber = '593985365554';
    const message = `¡Sí acepto la salida podemos cuadrar el dia en que podamos salir! ❤️`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

/**
 * Crea corazones flotantes en el fondo
 */
function createFloatingHearts() {
    const container = document.createElement('div');
    container.className = 'floating-hearts-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';
    document.body.appendChild(container);

    const maxHearts = 15; // Limitar el número máximo de corazones
    let activeHearts = 0;

    heartInterval = setInterval(() => {
        if (activeHearts >= maxHearts) return;

        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        activeHearts++;
        
        // Alternar entre diferentes emojis de corazón
        const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💞'];
        heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        // Posición aleatoria con transform para mejor rendimiento
        const xPos = Math.random() * 100;
        heart.style.transform = `translateX(${xPos}%)`;
        heart.style.animationDuration = (4 + Math.random() * 2) + 's'; // Reducir la variación
        heart.style.fontSize = (15 + Math.random() * 10) + 'px'; // Reducir la variación
        heart.style.willChange = 'transform'; // Optimización de rendimiento
        
        container.appendChild(heart);
        
        // Remover después de la animación
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
                activeHearts--;
            }
        }, 6000); // Reducir el tiempo de vida
    }, 1000); // Aumentar el intervalo
}

/**
 * Crea corazones interactivos en la pantalla de contenido
 */
function createInteractiveHearts() {
    const container = document.createElement('div');
    container.className = 'interactive-hearts-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '1';
    document.body.appendChild(container);

    const numberOfHearts = Math.min(6, loveMessages.length); // Reducir el número máximo
    
    // Crear todos los corazones de una vez
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = createInteractiveHeart(i);
        fragment.appendChild(heart);
    }
    container.appendChild(fragment);
}

/**
 * Crea un corazón interactivo individual
 * @param {number} index - Índice del corazón
 * @returns {HTMLElement} - Elemento del corazón
 */
function createInteractiveHeart(index) {
    const heart = document.createElement('div');
    heart.className = 'interactive-heart';
    heart.innerHTML = '💝';
    
    // Posicionamiento aleatorio evitando los bordes
    const margin = 80;
    heart.style.left = (margin + Math.random() * (window.innerWidth - margin * 2)) + 'px';
    heart.style.top = (margin + Math.random() * (window.innerHeight - margin * 2)) + 'px';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    // Crear mensaje asociado
    const message = document.createElement('div');
    message.className = 'love-message';
    message.textContent = loveMessages[index % loveMessages.length];
    message.style.left = '50%';
    message.style.top = '-60px';
    message.style.transform = 'translateX(-50%)';
    
    heart.appendChild(message);
    
    // Event listeners para mostrar/ocultar mensaje
    heart.addEventListener('mouseenter', () => {
        message.classList.add('show');
    });
    
    heart.addEventListener('mouseleave', () => {
        message.classList.remove('show');
    });
    
    // Para dispositivos táctiles
    heart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        message.classList.add('show');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    });
    
    return heart;
}

/**
 * Función para limpiar intervalos y recursos
 */
function cleanup() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
    
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }
    
    // Remover corazones interactivos
    const interactiveHearts = document.querySelectorAll('.interactive-heart');
    interactiveHearts.forEach(heart => heart.remove());
    
    // Remover corazones flotantes
    const floatingHearts = document.querySelectorAll('.floating-heart');
    floatingHearts.forEach(heart => heart.remove());
}

/**
 * Función para reiniciar la aplicación
 */
function resetApp() {
    cleanup();
    
    // Resetear datos
    userData = { name: '', birthDate: '' };
    holdProgress = 0;
    isHoldingHeart = false;
    
    // Resetear UI
    updateProgressBar(0);
    
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar pantalla inicial
    document.getElementById('welcomeScreen').classList.add('active');
    
    // Limpiar formulario
    document.getElementById('userForm').reset();
    
    // Reinicializar
    initializeApp();
}

// Event listeners globales
window.addEventListener('beforeunload', cleanup);

// Permitir reinicio con tecla 'R' (para desarrollo)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetApp();
    }
});

// Manejo de redimensionado de ventana
window.addEventListener('resize', () => {
    // Reposicionar corazones interactivos si es necesario
    const interactiveHearts = document.querySelectorAll('.interactive-heart');
    interactiveHearts.forEach(heart => {
        const currentLeft = parseInt(heart.style.left);
        const currentTop = parseInt(heart.style.top);
        
        // Ajustar si están fuera de los límites
        if (currentLeft > window.innerWidth - 80) {
            heart.style.left = (window.innerWidth - 80) + 'px';
        }
        if (currentTop > window.innerHeight - 80) {
            heart.style.top = (window.innerHeight - 80) + 'px';
        }
    });
});
