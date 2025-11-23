// Добавьте этот код в конец тега <script> перед закрывающим </body>

// Подключаем SweetAlert2
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
document.head.appendChild(script);

// Ждем загрузки библиотеки
script.onload = function() {
    initValidation();
};

function initValidation() {
    // Валидация email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Валидация телефона
    function validatePhone(phone) {
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Валидация VIN
    function validateVIN(vin) {
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
        return vinRegex.test(vin);
    }

    // Валидация госномера
    function validateLicensePlate(plate) {
        const plateRegex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;
        return plateRegex.test(plate.replace(/\s/g, ''));
    }

    // Валидация даты (не прошедшая)
    function validateFutureDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(date.getTime()) && date >= today;
    }

    // Показать ошибку SweetAlert2
    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: message,
            confirmButtonColor: '#1e293b',
            confirmButtonText: 'Понятно'
        });
    }

    // Показать успех SweetAlert2
    function showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: 'Успешно!',
            text: message,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Отлично'
        });
    }

    // Валидация формы для автобусов
    const busForm = document.querySelector('#bus-appointment-form form');
    if (busForm) {
        busForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            let errorMessage = '';

            // Валидация даты
            const dateInput = document.getElementById('bus-date');
            if (!dateInput.value) {
                errorMessage = 'Выберите дату';
                isValid = false;
            } else if (!validateFutureDate(dateInput.value)) {
                errorMessage = 'Дата не может быть в прошлом';
                isValid = false;
            }

            // Валидация времени
            const timeInput = document.getElementById('bus-time');
            if (isValid && !timeInput.value) {
                errorMessage = 'Выберите время';
                isValid = false;
            }

            // Валидация марки и модели
            const modelInput = document.getElementById('bus-model');
            if (isValid && !modelInput.value.trim()) {
                errorMessage = 'Введите марку и модель ТС';
                isValid = false;
            }

            // Валидация категории
            const categoryInput = document.getElementById('bus-category');
            if (isValid && !categoryInput.value) {
                errorMessage = 'Выберите категорию ТС';
                isValid = false;
            }

            // Валидация VIN
            const vinInput = document.getElementById('bus-vin');
            if (isValid && !vinInput.value.trim()) {
                errorMessage = 'Введите VIN номер';
                isValid = false;
            } else if (isValid && !validateVIN(vinInput.value)) {
                errorMessage = 'Неверный формат VIN номера';
                isValid = false;
            }

            // Валидация госномера
            const numberInput = document.getElementById('bus-number');
            if (isValid && !numberInput.value.trim()) {
                errorMessage = 'Введите госномер';
                isValid = false;
                } else if (isValid && !validateLicensePlate(numberInput.value)) {
                errorMessage = 'Неверный формат госномера';
                isValid = false;
            }

            // Валидация телефона
            const phoneInput = document.getElementById('bus-phone');
            if (isValid && !phoneInput.value.trim()) {
                errorMessage = 'Введите номер телефона';
                isValid = false;
            } else if (isValid && !validatePhone(phoneInput.value)) {
                errorMessage = 'Неверный формат телефона';
                isValid = false;
            }

            // Валидация email
            const emailInput = document.getElementById('bus-email');
            if (isValid && emailInput.value.trim() && !validateEmail(emailInput.value)) {
                errorMessage = 'Неверный формат email';
                isValid = false;
            }

            if (!isValid) {
                showError(errorMessage);
            } else {
                showSuccess('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                busForm.reset();
            }
        });

        // Реальная-time валидация для формы автобусов
        const busInputs = busForm.querySelectorAll('input, select');
        busInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateBusField(this);
            });
        });
    }

    // Валидация общей формы
    const generalForm = document.querySelector('#general-appointment-form form');
    if (generalForm) {
        generalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            let errorMessage = '';

            // Валидация ФИО
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                errorMessage = 'Введите ФИО';
                isValid = false;
            }

            // Валидация телефона
            const phoneInput = document.getElementById('phone');
            if (isValid && !phoneInput.value.trim()) {
                errorMessage = 'Введите номер телефона';
                isValid = false;
            } else if (isValid && !validatePhone(phoneInput.value)) {
                errorMessage = 'Неверный формат телефона';
                isValid = false;
            }

            // Валидация марки и модели
            const vehicleInput = document.getElementById('vehicle');
            if (isValid && !vehicleInput.value.trim()) {
                errorMessage = 'Введите марку и модель ТС';
                isValid = false;
            }

            // Валидация даты
            const dateInput = document.getElementById('date');
            if (isValid && !dateInput.value) {
                errorMessage = 'Выберите дату';
                isValid = false;
            } else if (isValid && !validateFutureDate(dateInput.value)) {
                errorMessage = 'Дата не может быть в прошлом';
                isValid = false;
            }

            // Валидация времени
            const timeInput = document.getElementById('time');
            if (isValid && !timeInput.value) {
                errorMessage = 'Выберите время';
                isValid = false;
            }

            if (!isValid) {
                showError(errorMessage);
            } else {
                showSuccess('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                generalForm.reset();
            }
        });

        // Реальная-time валидация для общей формы
        const generalInputs = generalForm.querySelectorAll('input, select, textarea');
        generalInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateGeneralField(this);
            });
        });
    }

    // Функции валидации отдельных полей в реальном времени
    function validateBusField(field) {
        let errorMessage = '';

        switch(field.id) {
            case 'bus-date':
                if (!field.value) {
                    errorMessage = 'Выберите дату';
                } else if (!validateFutureDate(field.value)) {
                    errorMessage = 'Дата не может быть в прошлом';
                }
                break;
                
            case 'bus-time':
                if (!field.value) {
                    errorMessage = 'Выберите время';
                }
                break;
                
            case 'bus-model':
                if (!field.value.trim()) {
                    errorMessage = 'Введите марку и модель ТС';
                }
                break;
                
            case 'bus-category':
                if (!field.value) {
                    errorMessage = 'Выберите категорию ТС';
                }
                break;
                
            case 'bus-vin':
                if (!field.value.trim()) {
                    errorMessage = 'Введите VIN номер';
                } else if (!validateVIN(field.value)) {
                    errorMessage = 'Неверный формат VIN номера';
                }
                break;
                
            case 'bus-number':
                if (!field.value.trim()) {
                    errorMessage = 'Введите госномер';
                } else if (!validateLicensePlate(field.value)) {
                    errorMessage = 'Неверный формат госномера';
                }
                break;
                
            case 'bus-phone':
                if (!field.value.trim()) {
                    errorMessage = 'Введите номер телефона';
                } else if (!validatePhone(field.value)) {
                    errorMessage = 'Неверный формат телефона';
                }
                break;
                
            case 'bus-email':
                if (field.value.trim() && !validateEmail(field.value)) {
                    errorMessage = 'Неверный формат email';
                }
                break;
        }

        if (errorMessage) {
            // Показываем маленькое уведомление для реального времени
            Swal.fire({
                icon: 'warning',
                title: 'Проверьте поле',
                text: errorMessage,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    }

    function validateGeneralField(field) {
        let errorMessage = '';

        switch(field.id) {
            case 'name':
                if (!field.value.trim()) {
                    errorMessage = 'Введите ФИО';
                }
                break;
                
            case 'phone':
                if (!field.value.trim()) {
                    errorMessage = 'Введите номер телефона';
                } else if (!validatePhone(field.value)) {
                    errorMessage = 'Неверный формат телефона';
                }
                break;
                
            case 'vehicle':
                if (!field.value.trim()) {
                    errorMessage = 'Введите марку и модель ТС';
                }
                break;
                
            case 'date':
                if (!field.value) {
                    errorMessage = 'Выберите дату';
                } else if (!validateFutureDate(field.value)) {
                    errorMessage = 'Дата не может быть в прошлом';
                }
                break;
                
            case 'time':
                if (!field.value) {
                    errorMessage = 'Выберите время';
                }
                break;
        }

        if (errorMessage) {
            // Показываем маленькое уведомление для реального времени
            Swal.fire({
                icon: 'warning',
                title: 'Проверьте поле',
                text: errorMessage,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    }
    // Валидация контактных данных на странице
    function validateContacts() {
        // Валидация email в контактах
        const emailElement = document.querySelector('a[href^="mailto:"]');
        if (emailElement) {
            const email = emailElement.textContent || emailElement.href.replace('mailto:', '');
            if (!validateEmail(email)) {
                console.warn('Неверный формат email в контактах:', email);
            }
        }

        // Валидация телефонов
        const phoneElements = document.querySelectorAll('a[href^="tel:"]');
        phoneElements.forEach(element => {
            const phone = element.textContent || element.href.replace('tel:', '');
            if (!validatePhone(phone)) {
                console.warn('Неверный формат телефона в контактах:', phone);
            }
        });
    }

    // Запускаем валидацию контактов при загрузке
    document.addEventListener('DOMContentLoaded', function() {
        validateContacts();
    });
}