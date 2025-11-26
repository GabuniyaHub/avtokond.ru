/**
 * Формы и API для взаимодействия с бэкендом Avtokond
 */

const API_BASE_URL = 'http://localhost:3000/api';

// ============================================
// ФОРМА ЗАПИСИ НА ТЕХОСМОТР
// ============================================

class AppointmentForm {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Кнопки выбора типа ТС
        const serviceButtons = document.querySelectorAll('.service-type-btn');
        serviceButtons.forEach((button) => {
            button.addEventListener('click', () => this.onServiceTypeSelect(button));
        });

        // Формы записи
        const busForm = document.getElementById('bus-appointment-form');
        const generalForm = document.getElementById('general-appointment-form');

        if (busForm) {
            busForm.addEventListener('submit', (e) =>
                this.handleBusFormSubmit(e)
            );
        }

        if (generalForm) {
            generalForm.addEventListener('submit', (e) =>
                this.handleGeneralFormSubmit(e)
            );
        }
    }

    onServiceTypeSelect(button) {
        // Логика уже есть в index.html
    }

    /**
     * Обработка отправки формы для автобусов
     */
    async handleBusFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Получаем значения
        const fullName = 'Заказчик автобуса'; // Для автобусов может быть организация
        const phone = form.querySelector('#bus-phone').value;
        const email = form.querySelector('#bus-email').value;
        const vehicleModel = form.querySelector('#bus-model').value;
        const vehicleType = 'bus';
        const busCategory = form.querySelector('#bus-category').value;
        const appointmentDate = form.querySelector('#bus-date').value;
        const appointmentTime = form.querySelector('#bus-time').value;
        const vin = form.querySelector('#bus-vin').value;
        const licensePlate = form.querySelector('#bus-number').value;

        // Валидация
        if (
            !phone ||
            !email ||
            !vehicleModel ||
            !busCategory ||
            !appointmentDate ||
            !appointmentTime
        ) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Обработка...';

            // Отправляем запрос на бекенд
            const response = await fetch(`${API_BASE_URL}/appointment/request-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    phone,
                    email,
                    vehicleType,
                    vehicleModel,
                    appointmentDate,
                    appointmentTime,
                    vin,
                    licensePlate,
                    busCategory,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при обработке запроса');
            }

            // Показываем модальное окно для ввода кода
            this.showVerificationModal(email);

            // Очищаем форму
            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        } catch (error) {
            console.error('Error:', error);
            alert(`Ошибка: ${error.message}`);

            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    }

    /**
     * Обработка отправки общей формы (легковые, грузовые)
     */
    async handleGeneralFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Получаем значения
        const fullName = form.querySelector('#name').value;
        const phone = form.querySelector('#phone').value;
        const vehicleType = form.querySelector('#vehicle-type')?.value || 'car';
        const vehicleModel = form.querySelector('#vehicle').value;
        const appointmentDate = form.querySelector('#date').value;
        const appointmentTime = form.querySelector('#time').value;
        const email = form.querySelector('#email')?.value || '';
        const additionalInfo = form.querySelector('#message').value;

        // Валидация
        if (!fullName || !phone || !vehicleModel || !appointmentDate || !appointmentTime) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (!email) {
            alert('Пожалуйста, укажите email для подтверждения');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Обработка...';

            // Отправляем запрос на бекенд
            const response = await fetch(`${API_BASE_URL}/appointment/request-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    phone,
                    email,
                    vehicleType,
                    vehicleModel,
                    appointmentDate,
                    appointmentTime,
                    additionalInfo,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при обработке запроса');
            }

            // Показываем модальное окно для ввода кода
            this.showVerificationModal(email);

            // Очищаем форму
            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        } catch (error) {
            console.error('Error:', error);
            alert(`Ошибка: ${error.message}`);

            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    }

    /**
     * Показать модальное окно для ввода кода верификации
     */
    showVerificationModal(email) {
        // Создаем модальное окно, если его нет
        let modal = document.getElementById('verification-modal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'verification-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">Подтверждение email</h2>
          <p class="text-gray-600 mb-4">Мы отправили код подтверждения на ваш email:</p>
          <p class="font-bold text-center mb-6 text-accent">${email}</p>
          
          <form id="verification-form" class="space-y-4">
            <div>
              <label class="block text-gray-700 mb-2">Код подтверждения</label>
              <input 
                type="text" 
                id="verification-code" 
                placeholder="Введите 6-значный код" 
                maxlength="6"
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent text-center text-2xl tracking-widest"
                required
              >
            </div>
            
            <button 
              type="submit" 
              class="w-full bg-accent text-white py-2 rounded hover:bg-primary transition font-bold"
            >
              Подтвердить запись
            </button>
            
            <div class="text-center">
              <p class="text-gray-600 text-sm mb-2">Не получили код?</p>
              <button 
                type="button" 
                id="resend-btn"
                class="text-accent hover:text-primary transition text-sm font-medium"
              >
                Отправить заново
              </button>
            </div>
          </form>
          
          <button 
            onclick="document.getElementById('verification-modal').remove()"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      `;
            document.body.appendChild(modal);
        }

        // Обработка отправки кода
        const form = modal.querySelector('#verification-form');
        const resendBtn = modal.querySelector('#resend-btn');

        form.onsubmit = async (e) => {
            e.preventDefault();
            const code = document.getElementById('verification-code').value;

            try {
                const response = await fetch(`${API_BASE_URL}/appointment/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        code,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Ошибка при верификации');
                }

                alert(
                    'Успешно! Ваша запись на техосмотр подтверждена. На ваш email отправлено подтверждение.'
                );

                modal.remove();

                // Прокручиваем вверх
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Error:', error);
                alert(`Ошибка: ${error.message}`);
            }
        };

        // Обработка повторной отправки кода
        resendBtn.onclick = async (e) => {
            e.preventDefault();

            try {
                resendBtn.disabled = true;
                resendBtn.textContent = 'Отправляем...';

                const response = await fetch(`${API_BASE_URL}/appointment/resend-code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Ошибка при отправке кода');
                }

                alert('Новый код отправлен на ваш email');

                resendBtn.disabled = false;
                resendBtn.textContent = 'Отправить заново';

                // Очищаем поле ввода
                document.getElementById('verification-code').value = '';
            } catch (error) {
                console.error('Error:', error);
                alert(`Ошибка: ${error.message}`);

                resendBtn.disabled = false;
                resendBtn.textContent = 'Отправить заново';
            }
        };

        // Показываем модальное окно
        modal.style.display = 'flex';

        // Закрытие при клике вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// ============================================
// ФОРМА КОНТАКТОВ
// ============================================

class ContactForm {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Ищем форму контактов (может быть на отдельной странице)
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) =>
                this.handleSubmit(e)
            );
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Получаем значения
        const fullName = form.querySelector('#contact-name')?.value || '';
        const email = form.querySelector('#contact-email')?.value || '';
        const phone = form.querySelector('#contact-phone')?.value || '';
        const subject = form.querySelector('#contact-subject')?.value || '';
        const message = form.querySelector('#contact-message')?.value || '';

        // Валидация
        if (!fullName || !email || !subject || !message) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            // Отправляем запрос на бекенд
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    subject,
                    message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при отправке сообщения');
            }

            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');

            // Очищаем форму
            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить сообщение';
        } catch (error) {
            console.error('Error:', error);
            alert(`Ошибка: ${error.message}`);

            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить сообщение';
        }
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем формы
    new AppointmentForm();
    new ContactForm();

    console.log('✓ Formы инициализированы и готовы к работе');
});
