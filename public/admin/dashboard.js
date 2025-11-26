/**
 * Admin Dashboard - управление записями и сообщениями
 */

const API_BASE = '/api';
let currentToken = null;
let currentAdmin = null;
let selectedAppointmentId = null;
let selectedMessageId = null;

// ==================== Инициализация ====================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');

    if (token) {
        verifyToken(token);
    }

    setupEventListeners();
});

// ==================== Управление токеном ====================
function setupEventListeners() {
    // Логин форма
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Выход
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Вкладки
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Фильтры и поиск
    document.getElementById('appointmentStatusFilter')?.addEventListener('change', loadAppointments);
    document.getElementById('appointmentSearch')?.addEventListener('input', handleAppointmentSearch);
    document.getElementById('refreshAppointments')?.addEventListener('click', loadAppointments);

    document.getElementById('messageStatusFilter')?.addEventListener('change', loadMessages);
    document.getElementById('messageSearch')?.addEventListener('input', handleMessageSearch);
    document.getElementById('refreshMessages')?.addEventListener('click', loadMessages);

    // Модальные окна - Записи
    document.getElementById('closeAppointmentModal')?.addEventListener('click', closeAppointmentModal);
    document.getElementById('closeAppointmentModalBtn')?.addEventListener('click', closeAppointmentModal);
    document.getElementById('saveAppointmentBtn')?.addEventListener('click', saveAppointmentChanges);

    // Модальные окна - Сообщения
    document.getElementById('closeMessageModal')?.addEventListener('click', closeMessageModal);
    document.getElementById('closeMessageModalBtn')?.addEventListener('click', closeMessageModal);
    document.getElementById('saveMessageBtn')?.addEventListener('click', saveMessageChanges);
    document.getElementById('deleteMessageBtn')?.addEventListener('click', deleteMessage);
}

// ==================== Аутентификация ====================
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка при входе');
        }

        currentToken = data.token;
        currentAdmin = data.admin;

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.admin.username);

        showDashboard();
        loadAppointments();
        loadMessages();
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

async function verifyToken(token) {
    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            currentToken = token;
            currentAdmin = data.admin;
            showDashboard();
            loadAppointments();
            loadMessages();
        } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUsername');
            showLoginPage();
        }
    } catch (error) {
        console.error('Token verification error:', error);
        showLoginPage();
    }
}

function handleLogout() {
    currentToken = null;
    currentAdmin = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    showLoginPage();
    document.getElementById('loginForm').reset();
}

// ==================== Управление UI ====================
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('adminUsername').textContent = currentAdmin?.username || '';
}

function handleTabSwitch(e) {
    const tabName = e.target.dataset.tab;

    // Обновляем кнопки вкладок
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'font-semibold');
        btn.classList.add('text-gray-600', 'hover:text-gray-800');
    });

    e.target.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'font-semibold');
    e.target.classList.remove('text-gray-600', 'hover:text-gray-800');

    // Обновляем содержимое вкладок
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
}

// ==================== Загрузка данных ====================
async function loadAppointments() {
    const tbody = document.getElementById('appointmentsTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center"><div class="spinner mx-auto"></div></td></tr>';

    try {
        const response = await fetch(`${API_BASE}/admin/appointments`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) throw new Error('Ошибка загрузки записей');

        const appointments = await response.json();

        updateAppointmentStats(appointments);
        displayAppointments(appointments);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">${error.message}</td></tr>`;
    }
}

async function loadMessages() {
    const tbody = document.getElementById('messagesTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center"><div class="spinner mx-auto"></div></td></tr>';

    try {
        const response = await fetch(`${API_BASE}/admin/messages`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) throw new Error('Ошибка загрузки сообщений');

        const messages = await response.json();

        updateMessageStats(messages);
        displayMessages(messages);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">${error.message}</td></tr>`;
    }
}

function updateAppointmentStats(appointments) {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;

    document.getElementById('totalAppointments').textContent = total;
    document.getElementById('pendingAppointments').textContent = pending;
}

function updateMessageStats(messages) {
    const newMessages = messages.filter(m => m.status === 'new').length;
    document.getElementById('totalMessages').textContent = newMessages;
}

function displayAppointments(appointments) {
    const tbody = document.getElementById('appointmentsTableBody');
    const statusFilter = document.getElementById('appointmentStatusFilter').value;
    const searchTerm = document.getElementById('appointmentSearch').value.toLowerCase();

    let filtered = appointments.filter(apt => {
        const matchStatus = !statusFilter || apt.status === statusFilter;
        const matchSearch = !searchTerm ||
            apt.fullName.toLowerCase().includes(searchTerm) ||
            apt.phone.includes(searchTerm) ||
            apt.email.toLowerCase().includes(searchTerm);
        return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Нет записей</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(apt => `
    <tr class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition" onclick="openAppointmentModal('${apt.id}')">
      <td class="px-6 py-4 text-sm text-gray-900">${apt.fullName}</td>
      <td class="px-6 py-4 text-sm text-gray-500">
        <div>${apt.phone}</div>
        <div class="text-xs">${apt.email}</div>
      </td>
      <td class="px-6 py-4 text-sm text-gray-900">${apt.vehicleType} (${apt.vehicleModel})</td>
      <td class="px-6 py-4 text-sm text-gray-500">${new Date(apt.appointmentDate).toLocaleDateString('ru-RU')} ${apt.appointmentTime}</td>
      <td class="px-6 py-4 text-sm">
        <span class="px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(apt.status)}">
          ${getStatusText(apt.status)}
        </span>
      </td>
      <td class="px-6 py-4 text-right text-sm">
        <button onclick="event.stopPropagation(); openAppointmentModal('${apt.id}')" class="text-blue-600 hover:text-blue-800 font-semibold">
          Подробнее
        </button>
      </td>
    </tr>
  `).join('');
}

function displayMessages(messages) {
    const tbody = document.getElementById('messagesTableBody');
    const statusFilter = document.getElementById('messageStatusFilter').value;
    const searchTerm = document.getElementById('messageSearch').value.toLowerCase();

    let filtered = messages.filter(msg => {
        const matchStatus = !statusFilter || msg.status === statusFilter;
        const matchSearch = !searchTerm ||
            msg.fullName.toLowerCase().includes(searchTerm) ||
            msg.email.toLowerCase().includes(searchTerm) ||
            msg.subject.toLowerCase().includes(searchTerm);
        return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Нет сообщений</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(msg => `
    <tr class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition" onclick="openMessageModal('${msg.id}')">
      <td class="px-6 py-4 text-sm text-gray-900">${msg.fullName}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${msg.email}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${msg.subject}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${new Date(msg.createdAt).toLocaleDateString('ru-RU')}</td>
      <td class="px-6 py-4 text-sm">
        <span class="px-2 py-1 rounded text-xs font-semibold ${getMessageStatusBadgeClass(msg.status)}">
          ${getMessageStatusText(msg.status)}
        </span>
      </td>
      <td class="px-6 py-4 text-right text-sm">
        <button onclick="event.stopPropagation(); openMessageModal('${msg.id}')" class="text-blue-600 hover:text-blue-800 font-semibold">
          Просмотреть
        </button>
      </td>
    </tr>
  `).join('');
}

function handleAppointmentSearch(e) {
    const appointments = document.querySelectorAll('#appointmentsTableBody tr');
    const term = e.target.value.toLowerCase();

    appointments.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

function handleMessageSearch(e) {
    const messages = document.querySelectorAll('#messagesTableBody tr');
    const term = e.target.value.toLowerCase();

    messages.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// ==================== Модальные окна - Записи ====================
async function openAppointmentModal(appointmentId) {
    try {
        const response = await fetch(`${API_BASE}/admin/appointments/${appointmentId}`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) throw new Error('Ошибка загрузки записи');

        const appointment = await response.json();
        selectedAppointmentId = appointmentId;

        document.getElementById('detailName').textContent = appointment.fullName;
        document.getElementById('detailPhone').textContent = appointment.phone;
        document.getElementById('detailEmail').textContent = appointment.email;
        document.getElementById('detailDateTime').textContent =
            `${new Date(appointment.appointmentDate).toLocaleDateString('ru-RU')} ${appointment.appointmentTime}`;
        document.getElementById('detailVehicleType').textContent = appointment.vehicleType;
        document.getElementById('detailVehicleModel').textContent = appointment.vehicleModel;
        document.getElementById('detailBusCategory').textContent = appointment.busCategory || 'N/A';
        document.getElementById('detailVin').textContent = appointment.vin;
        document.getElementById('detailLicensePlate').textContent = appointment.licensePlate;
        document.getElementById('detailStatus').value = appointment.status;

        document.getElementById('appointmentModal').classList.add('active');
    } catch (error) {
        alert(error.message);
    }
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').classList.remove('active');
    selectedAppointmentId = null;
}

async function saveAppointmentChanges() {
    if (!selectedAppointmentId) return;

    const newStatus = document.getElementById('detailStatus').value;

    try {
        const response = await fetch(`${API_BASE}/admin/appointments/${selectedAppointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error('Ошибка сохранения');

        closeAppointmentModal();
        loadAppointments();
    } catch (error) {
        alert(error.message);
    }
}

// ==================== Модальные окна - Сообщения ====================
async function openMessageModal(messageId) {
    try {
        const response = await fetch(`${API_BASE}/admin/messages/${messageId}`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) throw new Error('Ошибка загрузки сообщения');

        const message = await response.json();
        selectedMessageId = messageId;

        document.getElementById('msgName').textContent = message.fullName;
        document.getElementById('msgEmail').textContent = message.email;
        document.getElementById('msgPhone').textContent = message.phone;
        document.getElementById('msgSubject').textContent = message.subject;
        document.getElementById('msgText').textContent = message.message;
        document.getElementById('msgStatus').value = message.status;

        document.getElementById('messageModal').classList.add('active');
    } catch (error) {
        alert(error.message);
    }
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('active');
    selectedMessageId = null;
}

async function saveMessageChanges() {
    if (!selectedMessageId) return;

    const newStatus = document.getElementById('msgStatus').value;

    try {
        const response = await fetch(`${API_BASE}/admin/messages/${selectedMessageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) throw new Error('Ошибка сохранения');

        closeMessageModal();
        loadMessages();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteMessage() {
    if (!selectedMessageId) return;
    if (!confirm('Вы уверены что хотите удалить это сообщение?')) return;

    try {
        const response = await fetch(`${API_BASE}/admin/messages/${selectedMessageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) throw new Error('Ошибка удаления');

        closeMessageModal();
        loadMessages();
    } catch (error) {
        alert(error.message);
    }
}

// ==================== Вспомогательные функции ====================
function getStatusText(status) {
    const statuses = {
        'pending': 'Ожидает подтверждения',
        'confirmed': 'Подтверждена',
        'completed': 'Выполнена',
        'cancelled': 'Отменена',
    };
    return statuses[status] || status;
}

function getStatusBadgeClass(status) {
    const classes = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function getMessageStatusText(status) {
    const statuses = {
        'new': 'Новое',
        'read': 'Прочитано',
        'answered': 'Ответил',
    };
    return statuses[status] || status;
}

function getMessageStatusBadgeClass(status) {
    const classes = {
        'new': 'bg-red-100 text-red-800',
        'read': 'bg-blue-100 text-blue-800',
        'answered': 'bg-green-100 text-green-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}
