/**
 * JUBA Materiais de Construção - Landing Page Script
 * Funcionalidades interativas de alta fidelidade
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAV BAR FIXED ON SCROLL
       ========================================================================== */
    const header = document.getElementById('home');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. MOBILE MENU (HAMBURGER)
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
            
            // Alterar link ativo visualmente
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    /* ==========================================================================
       3. SISTEMA DE DETEÇÃO DE HORÁRIO EM TEMPO REAL (ABERTO / FECHADO)
       ========================================================================== */
    const checkStoreStatus = () => {
        const statusPulse = document.getElementById('statusPulse');
        const statusText = document.getElementById('statusText');
        const weektimeText = document.getElementById('weektime');
        
        const now = new Date();
        const day = now.getDay(); // 0: Domingo, 1: Segunda, ..., 6: Sábado
        const month = now.getMonth(); // 0: Janeiro, ..., 11: Dezembro
        const hour = now.getHours();
        const minute = now.getMinutes();
        const timeInMinutes = hour * 60 + minute;

        let isOpen = false;
        let scheduleNote = "";

        // Detetar se estamos no horário de Verão (Maio a Outubro, meses 4 a 9) ou Inverno
        const isSummer = (month >= 4 && month <= 9);

        if (day === 0) {
            // Domingo
            isOpen = false;
            scheduleNote = "Fechado hoje (Descanso Semanal)";
        } else if (day === 6) {
            // Sábado: 08:00 às 12:00
            const start = 8 * 60;
            const end = 12 * 60;
            if (timeInMinutes >= start && timeInMinutes < end) {
                isOpen = true;
                scheduleNote = "Aberto (Sábado: até às 12h00)";
            } else {
                isOpen = false;
                scheduleNote = "Fechado (Sábado: funcionou das 08h00 às 12h00)";
            }
        } else {
            // Segunda a Sexta
            if (isSummer) {
                // Verão: 07h30-13h00 e 15h00-19h00
                const morningStart = 7 * 60 + 30;
                const morningEnd = 13 * 60;
                const afternoonStart = 15 * 60;
                const afternoonEnd = 19 * 60;

                if ((timeInMinutes >= morningStart && timeInMinutes < morningEnd) || 
                    (timeInMinutes >= afternoonStart && timeInMinutes < afternoonEnd)) {
                    isOpen = true;
                    if (timeInMinutes < morningEnd) {
                        scheduleNote = "Aberto (Horário de Verão: encerra às 13h00 para almoço)";
                    } else {
                        scheduleNote = "Aberto (Horário de Verão: encerra às 19h00)";
                    }
                } else {
                    isOpen = false;
                    if (timeInMinutes < morningStart) {
                        scheduleNote = "Fechado (Abre hoje às 07h30 - Horário de Verão)";
                    } else if (timeInMinutes >= morningEnd && timeInMinutes < afternoonStart) {
                        scheduleNote = "Fechado para Almoço (Reabre hoje às 15h00)";
                    } else {
                        scheduleNote = "Fechado (Abre amanhã às 07h30 - Horário de Verão)";
                    }
                }
            } else {
                // Inverno: 08h00-13h00 e 14h30-18h30
                const morningStart = 8 * 60;
                const morningEnd = 13 * 60;
                const afternoonStart = 14 * 60 + 30;
                const afternoonEnd = 18 * 60 + 30;

                if ((timeInMinutes >= morningStart && timeInMinutes < morningEnd) || 
                    (timeInMinutes >= afternoonStart && timeInMinutes < afternoonEnd)) {
                    isOpen = true;
                    if (timeInMinutes < morningEnd) {
                        scheduleNote = "Aberto (Horário de Inverno: encerra às 13h00 para almoço)";
                    } else {
                        scheduleNote = "Aberto (Horário de Inverno: encerra às 18h30)";
                    }
                } else {
                    isOpen = false;
                    if (timeInMinutes < morningStart) {
                        scheduleNote = "Fechado (Abre hoje às 08h00 - Horário de Inverno)";
                    } else if (timeInMinutes >= morningEnd && timeInMinutes < afternoonStart) {
                        scheduleNote = "Fechado para Almoço (Reabre hoje às 14h30)";
                    } else {
                        scheduleNote = "Fechado (Abre amanhã às 08h00 - Horário de Inverno)";
                    }
                }
            }
        }

        // Aplicar estado visual no HTML
        if (isOpen) {
            statusPulse.className = "status-pulse open";
            statusText.innerHTML = `<span style="color: #2ECC71;">Loja Aberta</span> &bull; ${scheduleNote}`;
        } else {
            statusPulse.className = "status-pulse closed";
            statusText.innerHTML = `<span style="color: #E74C3C;">Loja Fechada</span> &bull; ${scheduleNote}`;
        }

        // Destacar o horário atual na tabela descritiva do site
        if (isSummer) {
            weektimeText.innerHTML = `<strong>07:30 - 13:00 / 15:00 - 19:00 (Horário de Verão Ativo)</strong><br><span style="font-size: 0.8rem; opacity: 0.8;">Inverno: 08:00 - 13:00 / 14:30 - 18:30</span>`;
        } else {
            weektimeText.innerHTML = `07:30 - 13:00 / 15:00 - 19:00 (Verão)<br><strong>08:00 - 13:00 / 14:30 - 18:30 (Horário de Inverno Ativo)</strong>`;
        }
    };

    // Correr de imediato e configurar atualização a cada minuto
    checkStoreStatus();
    setInterval(checkStoreStatus, 60000);

    /* ==========================================================================
       4. CARROSSEL DE MARCAS PARCEIRAS (INFINITE TRACK CLONE)
       ========================================================================== */
    const brandsTrack = document.getElementById('brandsTrack');
    if (brandsTrack) {
        const slides = Array.from(brandsTrack.children);
        // Clonar o conjunto de marcas 2 vezes para garantir fluxo contínuo e sem interrupções visuais no loop CSS
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            brandsTrack.appendChild(clone);
        });
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            brandsTrack.appendChild(clone);
        });
    }

    /* ==========================================================================
       5. VALIDAÇÃO DO FORMULÁRIO DE ORÇAMENTO COM LEADS REALISTAS
       ========================================================================== */
    const quoteForm = document.getElementById('quoteForm');
    const formSuccessAlert = document.getElementById('formSuccessAlert');

    const validateInput = (input, errorEl, validationFn) => {
        const isValid = validationFn(input.value);
        const group = input.closest('.form-group');
        
        if (isValid) {
            group.classList.remove('error');
        } else {
            group.classList.add('error');
        }
        return isValid;
    };

    // Regras de Validação
    const validateName = (val) => val.trim().length >= 3;
    const validatePhone = (val) => {
        // Validação de telemóvel em Portugal: 9 dígitos, iniciando geralmente por 9, 2 ou 3
        const num = val.replace(/\s+/g, '');
        return /^[923]\d{8}$/.test(num);
    };
    const validateEmail = (val) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    };
    const validateSelect = (val) => val !== "";

    // Ouvintes dinâmicos de input para limpar o erro assim que o utilizador corrige
    const nameInput = document.getElementById('userName');
    const nameError = document.getElementById('nameError');
    nameInput.addEventListener('input', () => validateInput(nameInput, nameError, validateName));

    const phoneInput = document.getElementById('userPhone');
    const phoneError = document.getElementById('phoneError');
    phoneInput.addEventListener('input', () => validateInput(phoneInput, phoneError, validatePhone));

    const emailInput = document.getElementById('userEmail');
    const emailError = document.getElementById('emailError');
    emailInput.addEventListener('input', () => validateInput(emailInput, emailError, validateEmail));

    const typeSelect = document.getElementById('materialType');
    const typeError = document.getElementById('typeError');
    typeSelect.addEventListener('change', () => validateInput(typeSelect, typeError, validateSelect));

    // Ação de Submissão
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar todos os campos antes de avançar
        const isNameValid = validateInput(nameInput, nameError, validateName);
        const isPhoneValid = validateInput(phoneInput, phoneError, validatePhone);
        const isEmailValid = validateInput(emailInput, emailError, validateEmail);
        const isTypeValid = validateInput(typeSelect, typeError, validateSelect);

        if (isNameValid && isPhoneValid && isEmailValid && isTypeValid) {
            const submitBtn = document.getElementById('submitBtn');
            
            // Simular envio assíncrono (Loading UI)
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>A Enviar Orçamento...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            setTimeout(() => {
                // Simulação concluída com sucesso
                quoteForm.style.display = 'none';
                formSuccessAlert.style.display = 'block';
                formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        } else {
            // Focar no primeiro elemento com erro
            const firstError = quoteForm.querySelector('.form-group.error input, .form-group.error select');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    /* ==========================================================================
       6. SCROLL REVEAL (EFEITOS VISUAIS SUAVES DE INTERAÇÃO)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.service-card, .status-card, .section-title, .step-card, .faq-item, .audience-card, .testimonial-card, .delivery-card');
    
    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Configurar estados iniciais para efeitos de animação
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Disparar uma vez no carregamento inicial

    /* ==========================================================================
       7. ACORDIÃO DE PERGUNTAS FREQUENTES (FAQ)
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os FAQs abertos antes de abrir o atual (comportamento de acordeão clássico)
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = '0';
            });
            
            // Se o item clicado não estava ativo, abre-o
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                // Definimos dinamicamente a altura máxima com base no conteúdo para uma transição suave
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       8. BOTÃO VOLTAR AO TOPO (USABILIDADE)
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       9. CONTAGEM ANIMADA DE NÚMEROS (STATS COUNTUP)
       ========================================================================== */
    const countupElements = document.querySelectorAll('.countup');
    
    const startCountup = (el) => {
        const target = +el.getAttribute('data-target');
        let count = 0;
        const duration = 1800; // 1.8 segundos de duração total
        const speed = 30; // ms por tick
        const totalTicks = duration / speed;
        const increment = Math.ceil(target / totalTicks);

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                el.innerText = target.toLocaleString('pt-PT');
                clearInterval(timer);
            } else {
                el.innerText = count.toLocaleString('pt-PT');
            }
        }, speed);
    };

    const countupObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCountup(entry.target);
                observer.unobserve(entry.target); // Animizar apenas uma vez
            }
        });
    }, { threshold: 0.2 });

    countupElements.forEach(el => countupObserver.observe(el));

    /* ==========================================================================
       10. PROCESSAMENTO E VALIDAÇÃO DO UPLOAD DE FICHEIROS (ORÇAMENTO CONCORRENTE)
       ========================================================================== */
    const fileInput = document.getElementById('budgetFile');
    const fileNameSpan = document.getElementById('fileNameSpan');
    const fileWrapper = document.querySelector('.file-upload-wrapper');

    if (fileInput && fileNameSpan && fileWrapper) {
        // Detetar alteração de ficheiro (seleção manual)
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileName = file.name;
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                
                // Limite de 10 MB
                if (file.size > 10 * 1024 * 1024) {
                    alert('Erro: O ficheiro excede o tamanho limite de 10 MB. Escolha um ficheiro mais pequeno.');
                    fileInput.value = ''; // Limpar o campo
                    fileNameSpan.innerText = 'Escolha um ficheiro ou arraste-o aqui';
                    fileWrapper.style.borderColor = '#E74C3C';
                } else {
                    fileNameSpan.innerText = `${fileName} (${fileSizeMB} MB)`;
                    fileWrapper.style.borderColor = 'var(--primary)';
                    fileWrapper.style.backgroundColor = 'var(--primary-light)';
                }
            } else {
                fileNameSpan.innerText = 'Escolha um ficheiro ou arraste-o aqui';
                fileWrapper.style.borderColor = '#CBD5E1';
                fileWrapper.style.backgroundColor = 'var(--bg-main)';
            }
        });

        // Efeitos visuais para Drag & Drop (arrastar ficheiros)
        ['dragenter', 'dragover'].forEach(eventName => {
            fileInput.addEventListener(eventName, () => {
                fileWrapper.classList.add('dragover');
                fileWrapper.style.borderColor = 'var(--primary)';
                fileWrapper.style.backgroundColor = 'var(--primary-light)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileInput.addEventListener(eventName, () => {
                fileWrapper.classList.remove('dragover');
                if (fileInput.files.length === 0) {
                    fileWrapper.style.borderColor = '#CBD5E1';
                    fileWrapper.style.backgroundColor = 'var(--bg-main)';
                }
            }, false);
        });
    }

    /* ==========================================================================
       11. SCROLL SUAVE E LIGAÇÃO DINÂMICA DOS CTAs AO FORMULÁRIO
       ========================================================================== */
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();

                // Lógica de autopreenchimento do formulário se houver categoria definida
                const category = link.getAttribute('data-category');
                if (category) {
                    const selectEl = document.getElementById('materialType');
                    if (selectEl) {
                        selectEl.value = category;
                        // Disparar o evento 'change' para limpar possíveis classes de erro visuais
                        const changeEvent = new Event('change');
                        selectEl.dispatchEvent(changeEvent);
                    }
                }

                // Calcular altura dinâmica da Navbar fixa para evitar sobreposições
                const headerEl = document.querySelector('.main-header');
                const offset = headerEl ? headerEl.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

