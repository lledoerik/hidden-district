// Admin System for Hidden District
// Author: Claude Code
// Access: Ctrl+Shift+A

class AdminSystem {
    constructor() {
        this.isAuthenticated = false;
        // IMPORTANT: Canvia aquesta contrasenya!
        // Aquesta és la contrasenya encriptada amb SHA-256
        // Contrasenya per defecte: "hiddendistrict2024"
        this.passwordHash = "b01bd5d38ff37127e4ef69842926163b4fedfc5db0dac5ab3bab10d963dc8265";
        this.content = null;
        this.db = null;
        this.firebaseInitialized = false;
        this.init();
    }

    init() {
        this.createLoginModal();
        this.createEditModal();
        this.createAdminIndicator();
        this.createSuccessMessage();
        this.createErrorMessage();
        this.setupKeyboardShortcut();
        this.initFirebase();
        this.checkAuthStatus();
    }

    // Initialize Firebase
    async initFirebase() {
        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase no està carregat. Assegura\'t que els scripts de Firebase estan a index.html');
                this.showErrorMessage('Error: Firebase no carregat');
                return;
            }

            // Check if config exists
            if (!window.firebaseConfig || window.firebaseConfig.apiKey === 'SUBSTITUEIX_AMB_LA_TEVA_API_KEY') {
                console.error('❌ Firebase no està configurat. Segueix la guia FIREBASE-SETUP.md');
                this.showErrorMessage('Error: Firebase no configurat');
                return;
            }

            // Initialize Firebase
            firebase.initializeApp(window.firebaseConfig);
            this.db = firebase.firestore();
            this.firebaseInitialized = true;

            console.log('✅ Firebase inicialitzat correctament');

            // Load content from Firebase
            await this.loadContentFromFirebase();

        } catch (error) {
            console.error('❌ Error inicialitzant Firebase:', error);
            this.showErrorMessage('Error connectant amb Firebase');
        }
    }

    // Hash password using SHA-256
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Setup keyboard shortcut (Ctrl+Shift+A)
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                if (!this.isAuthenticated) {
                    this.showLoginModal();
                } else {
                    this.logout();
                }
            }
        });
    }

    // Create login modal
    createLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-login-modal';
        modal.id = 'adminLoginModal';
        modal.innerHTML = `
            <div class="admin-login-content">
                <h2>🔐 Admin Access</h2>
                <p>Prem Ctrl+Shift+A per obrir aquest panell</p>
                <form class="admin-login-form" id="adminLoginForm">
                    <input
                        type="password"
                        id="adminPassword"
                        placeholder="Contrasenya"
                        autocomplete="off"
                        required
                    />
                    <div class="admin-login-buttons">
                        <button type="submit" class="admin-btn-login">Entrar</button>
                        <button type="button" class="admin-btn-cancel" id="adminCancelBtn">Cancel·lar</button>
                    </div>
                </form>
                <div class="admin-error-message" id="adminErrorMsg">
                    Contrasenya incorrecta
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        const loginForm = document.getElementById('adminLoginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // También manejar Enter en el campo de contraseña
        document.getElementById('adminPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.login();
            }
        });

        document.getElementById('adminCancelBtn').addEventListener('click', () => {
            this.hideLoginModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideLoginModal();
            }
        });
    }

    // Create edit modal
    createEditModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-edit-modal';
        modal.id = 'adminEditModal';
        modal.innerHTML = `
            <div class="admin-edit-content">
                <h3>Editar contingut</h3>
                <form class="admin-edit-form" id="adminEditForm">
                    <div id="adminEditFields"></div>
                    <div class="admin-edit-buttons">
                        <button type="submit" class="admin-btn-save">Guardar</button>
                        <button type="button" class="admin-btn-cancel-edit">Cancel·lar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('adminEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });

        modal.querySelector('.admin-btn-cancel-edit').addEventListener('click', () => {
            this.hideEditModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideEditModal();
            }
        });
    }

    // Create admin mode indicator
    createAdminIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'admin-mode-indicator';
        indicator.id = 'adminModeIndicator';
        indicator.innerHTML = `
            <span>✏️ Mode Admin Actiu</span>
            <button class="admin-logout-btn" id="adminLogoutBtn">Sortir</button>
        `;
        document.body.appendChild(indicator);

        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    // Create success message
    createSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'admin-success-message';
        message.id = 'adminSuccessMsg';
        message.textContent = 'Canvis guardats correctament!';
        document.body.appendChild(message);
    }

    // Create error message
    createErrorMessage() {
        const message = document.createElement('div');
        message.className = 'admin-error-toast';
        message.id = 'adminErrorToast';
        document.body.appendChild(message);
    }

    // Show/hide modals
    showLoginModal() {
        if (!this.firebaseInitialized) {
            this.showErrorMessage('Firebase no està configurat. No es pot accedir al mode admin.');
            return;
        }
        document.getElementById('adminLoginModal').classList.add('active');
        document.getElementById('adminPassword').focus();
        document.getElementById('adminErrorMsg').classList.remove('show');
    }

    hideLoginModal() {
        document.getElementById('adminLoginModal').classList.remove('active');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminErrorMsg').classList.remove('show');
    }

    showEditModal() {
        document.getElementById('adminEditModal').classList.add('active');
    }

    hideEditModal() {
        document.getElementById('adminEditModal').classList.remove('active');
    }

    // Login
    async login() {
        const password = document.getElementById('adminPassword').value;
        const hash = await this.hashPassword(password);

        if (hash === this.passwordHash) {
            this.isAuthenticated = true;
            sessionStorage.setItem('adminAuth', 'true');
            this.hideLoginModal();
            this.activateAdminMode();
        } else {
            document.getElementById('adminErrorMsg').classList.add('show');
            setTimeout(() => {
                document.getElementById('adminErrorMsg').classList.remove('show');
            }, 3000);
        }
    }

    // Logout
    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('adminAuth');
        this.deactivateAdminMode();
    }

    // Check auth status on page load
    checkAuthStatus() {
        const isAuth = sessionStorage.getItem('adminAuth');
        if (isAuth === 'true' && this.firebaseInitialized) {
            this.isAuthenticated = true;
            this.activateAdminMode();
        }
    }

    // Activate admin mode
    activateAdminMode() {
        document.body.classList.add('admin-mode');
        document.getElementById('adminModeIndicator').classList.add('active');
        this.addEditButtons();
    }

    // Deactivate admin mode
    deactivateAdminMode() {
        document.body.classList.remove('admin-mode');
        document.getElementById('adminModeIndicator').classList.remove('active');
    }

    // Add edit buttons to editable elements
    addEditButtons() {
        const editables = document.querySelectorAll('[data-editable]');
        editables.forEach(element => {
            if (!element.querySelector('.admin-edit-btn')) {
                const btn = document.createElement('button');
                btn.className = 'admin-edit-btn';
                btn.textContent = '✏️';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openEditModal(element);
                };

                // Insert button after the element or inside if it's a container
                if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
                    element.style.position = 'relative';
                    btn.style.position = 'absolute';
                    btn.style.top = '5px';
                    btn.style.right = '5px';
                    element.insertBefore(btn, element.firstChild);
                } else {
                    element.parentNode.insertBefore(btn, element.nextSibling);
                }
            }
        });
    }

    // Open edit modal for specific element
    openEditModal(element) {
        const path = element.dataset.editable;
        const type = element.dataset.editableType || 'text';
        const value = this.getValueByPath(path);

        const fieldsContainer = document.getElementById('adminEditFields');
        fieldsContainer.innerHTML = '';

        if (type === 'text') {
            fieldsContainer.innerHTML = `
                <div class="admin-form-group">
                    <label>Text:</label>
                    <textarea id="editValue" rows="4">${value || ''}</textarea>
                </div>
            `;
        } else if (type === 'image') {
            fieldsContainer.innerHTML = `
                <div class="admin-form-group">
                    <label>URL de la imatge:</label>
                    <input type="text" id="editValue" value="${value || ''}" placeholder="https://...">
                </div>
            `;
        } else if (type === 'link') {
            fieldsContainer.innerHTML = `
                <div class="admin-form-group">
                    <label>URL de l'enllaç:</label>
                    <input type="text" id="editValue" value="${value || ''}" placeholder="https://...">
                </div>
            `;
        } else if (type === 'menu-item') {
            // Còctels i Tapas
            const item = value || { name: '', ingredients: '', price: '', image: '' };
            fieldsContainer.innerHTML = `
                <div class="admin-form-group">
                    <label>Nom:</label>
                    <input type="text" id="editName" value="${item.name || ''}" placeholder="Nom del còctel/tapa">
                </div>
                <div class="admin-form-group">
                    <label>Ingredients:</label>
                    <textarea id="editIngredients" rows="2" placeholder="Descripció o ingredients">${item.ingredients || ''}</textarea>
                </div>
                <div class="admin-form-group">
                    <label>Preu:</label>
                    <input type="text" id="editPrice" value="${item.price || ''}" placeholder="12€">
                </div>
                <div class="admin-form-group">
                    <label>URL Imatge (opcional):</label>
                    <input type="text" id="editImage" value="${item.image || ''}" placeholder="https://...">
                </div>
            `;
        } else if (type === 'event') {
            // Esdeveniments
            const item = value || { day: '', month: '', title: '', description: '', time: '', type: '' };
            fieldsContainer.innerHTML = `
                <div class="admin-form-group">
                    <label>Dia (número):</label>
                    <input type="text" id="editDay" value="${item.day || ''}" placeholder="15">
                </div>
                <div class="admin-form-group">
                    <label>Mes (abreviatura):</label>
                    <input type="text" id="editMonth" value="${item.month || ''}" placeholder="FEB">
                </div>
                <div class="admin-form-group">
                    <label>Títol:</label>
                    <input type="text" id="editTitle" value="${item.title || ''}" placeholder="Nom de l'event">
                </div>
                <div class="admin-form-group">
                    <label>Descripció:</label>
                    <textarea id="editDescription" rows="2" placeholder="Descripció de l'event">${item.description || ''}</textarea>
                </div>
                <div class="admin-form-group">
                    <label>Hora:</label>
                    <input type="text" id="editTime" value="${item.time || ''}" placeholder="22:00h o 18:00-02:00h">
                </div>
                <div class="admin-form-group">
                    <label>Tipus:</label>
                    <input type="text" id="editType" value="${item.type || ''}" placeholder="DJ Session, Concert, etc.">
                </div>
            `;
        } else if (type === 'schedule') {
            // Horari
            const schedule = value?.schedule || {};
            fieldsContainer.innerHTML = `
                <div class="admin-form-group">
                    <label>Dilluns:</label>
                    <input type="text" id="editDilluns" value="${schedule.dilluns || 'Tancat'}" placeholder="Tancat o 18:00 - 02:00">
                </div>
                <div class="admin-form-group">
                    <label>Dimarts:</label>
                    <input type="text" id="editDimarts" value="${schedule.dimarts || 'Tancat'}" placeholder="Tancat o 18:00 - 02:00">
                </div>
                <div class="admin-form-group">
                    <label>Dimecres:</label>
                    <input type="text" id="editDimecres" value="${schedule.dimecres || ''}" placeholder="18:00 - 02:00">
                </div>
                <div class="admin-form-group">
                    <label>Dijous:</label>
                    <input type="text" id="editDijous" value="${schedule.dijous || ''}" placeholder="18:00 - 02:00">
                </div>
                <div class="admin-form-group">
                    <label>Divendres:</label>
                    <input type="text" id="editDivendres" value="${schedule.divendres || ''}" placeholder="18:00 - 02:00">
                </div>
                <div class="admin-form-group">
                    <label>Dissabte:</label>
                    <input type="text" id="editDissabte" value="${schedule.dissabte || ''}" placeholder="18:00 - 02:00">
                </div>
                <div class="admin-form-group">
                    <label>Diumenge:</label>
                    <input type="text" id="editDiumenge" value="${schedule.diumenge || ''}" placeholder="18:00 - 02:00">
                </div>
            `;
        }

        // Store the path and type for saving
        document.getElementById('adminEditForm').dataset.path = path;
        document.getElementById('adminEditForm').dataset.type = type;
        document.getElementById('adminEditForm').dataset.element = element.id || '';

        this.showEditModal();

        // Focus first input
        const firstInput = fieldsContainer.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
    }

    // Save edit
    async saveEdit() {
        if (!this.firebaseInitialized) {
            this.showErrorMessage('No es pot guardar: Firebase no està configurat');
            return;
        }

        const form = document.getElementById('adminEditForm');
        const path = form.dataset.path;
        const type = form.dataset.type || 'text';

        let newValue;

        if (type === 'text' || type === 'image' || type === 'link') {
            newValue = document.getElementById('editValue').value;
            this.setValueByPath(path, newValue);
        } else if (type === 'menu-item') {
            newValue = {
                name: document.getElementById('editName').value,
                ingredients: document.getElementById('editIngredients').value,
                price: document.getElementById('editPrice').value,
                image: document.getElementById('editImage').value
            };
            this.setValueByPath(path, newValue);
        } else if (type === 'event') {
            newValue = {
                day: document.getElementById('editDay').value,
                month: document.getElementById('editMonth').value,
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDescription').value,
                time: document.getElementById('editTime').value,
                type: document.getElementById('editType').value
            };
            this.setValueByPath(path, newValue);
        } else if (type === 'schedule') {
            const schedule = {
                dilluns: document.getElementById('editDilluns').value,
                dimarts: document.getElementById('editDimarts').value,
                dimecres: document.getElementById('editDimecres').value,
                dijous: document.getElementById('editDijous').value,
                divendres: document.getElementById('editDivendres').value,
                dissabte: document.getElementById('editDissabte').value,
                diumenge: document.getElementById('editDiumenge').value
            };
            this.setValueByPath(path + '.schedule', schedule);
        }

        const saved = await this.saveContentToFirebase();
        if (saved) {
            this.updateDOM();
            this.hideEditModal();
            this.showSuccessMessage();
        }
    }

    // Show success message
    showSuccessMessage() {
        const msg = document.getElementById('adminSuccessMsg');
        msg.classList.add('show');
        setTimeout(() => {
            msg.classList.remove('show');
        }, 3000);
    }

    // Show error message
    showErrorMessage(text) {
        const msg = document.getElementById('adminErrorToast');
        msg.textContent = text;
        msg.classList.add('show');
        setTimeout(() => {
            msg.classList.remove('show');
        }, 5000);
    }

    // Load content from Firebase
    async loadContentFromFirebase() {
        try {
            const doc = await this.db.collection('website').doc('content').get();

            if (doc.exists) {
                this.content = doc.data();
                console.log('✅ Contingut carregat des de Firebase');
                this.updateDOM();
            } else {
                // If no content in Firebase, load from content.json and save to Firebase
                console.log('ℹ️ No hi ha contingut a Firebase. Carregant des de content.json...');
                await this.loadContentFromJSON();
            }
        } catch (error) {
            console.error('❌ Error carregant des de Firebase:', error);
            this.showErrorMessage('Error carregant contingut de Firebase');
        }
    }

    // Load content from content.json (initial setup)
    async loadContentFromJSON() {
        try {
            const response = await fetch('docs/content.json');
            const data = await response.json();
            this.content = data;

            // Save to Firebase for future use
            if (this.firebaseInitialized) {
                await this.saveContentToFirebase();
                console.log('✅ Contingut inicial guardat a Firebase');
            }

            this.updateDOM();
        } catch (error) {
            console.error('❌ Error loading content.json:', error);
            this.showErrorMessage('Error carregant contingut inicial');
        }
    }

    // Save content to Firebase
    async saveContentToFirebase() {
        if (!this.firebaseInitialized) {
            this.showErrorMessage('Firebase no està configurat');
            return false;
        }

        try {
            await this.db.collection('website').doc('content').set(this.content);
            console.log('✅ Contingut guardat a Firebase');
            return true;
        } catch (error) {
            console.error('❌ Error guardant a Firebase:', error);
            this.showErrorMessage('Error guardant canvis a Firebase');
            return false;
        }
    }

    // Update DOM with current content
    updateDOM() {
        if (!this.content) return;

        // Update all elements with data-editable attribute
        const editables = document.querySelectorAll('[data-editable]');
        editables.forEach(element => {
            const path = element.dataset.editable;
            const value = this.getValueByPath(path);
            const type = element.dataset.editableType || 'text';

            if (value !== undefined && value !== null) {
                if (type === 'text') {
                    element.textContent = value;
                } else if (type === 'image') {
                    element.src = value;
                } else if (type === 'link') {
                    element.href = value;
                } else if (type === 'menu-item') {
                    // Update cocktail/tapa card
                    const nameEl = element.querySelector('[data-field="name"]');
                    const ingredientsEl = element.querySelector('[data-field="ingredients"]');
                    const priceEl = element.querySelector('[data-field="price"]');
                    const imageEl = element.querySelector('[data-field="image"]');

                    if (nameEl) nameEl.textContent = value.name || '';
                    if (ingredientsEl) ingredientsEl.textContent = value.ingredients || '';
                    if (priceEl) priceEl.textContent = value.price || '';
                    if (imageEl && value.image) {
                        imageEl.style.backgroundImage = `url(${value.image})`;
                        imageEl.style.backgroundSize = 'cover';
                        imageEl.style.backgroundPosition = 'center';
                    }
                } else if (type === 'event') {
                    // Update event card
                    const dayEl = element.querySelector('[data-field="day"]');
                    const monthEl = element.querySelector('[data-field="month"]');
                    const titleEl = element.querySelector('[data-field="title"]');
                    const descriptionEl = element.querySelector('[data-field="description"]');
                    const timeEl = element.querySelector('[data-field="time"]');
                    const typeEl = element.querySelector('[data-field="type"]');

                    if (dayEl) dayEl.textContent = value.day || '';
                    if (monthEl) monthEl.textContent = value.month || '';
                    if (titleEl) titleEl.textContent = value.title || '';
                    if (descriptionEl) descriptionEl.textContent = value.description || '';
                    if (timeEl) timeEl.textContent = value.time || '';
                    if (typeEl) typeEl.textContent = value.type || '';
                } else if (type === 'schedule') {
                    // Update schedule grid
                    const schedule = value.schedule || {};
                    const days = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'];

                    days.forEach(day => {
                        const hoursEl = element.querySelector(`[data-field="${day}"]`);
                        const rowEl = element.querySelector(`[data-day="${day}"]`);

                        if (hoursEl && schedule[day]) {
                            hoursEl.textContent = schedule[day];
                        }

                        // Update tancat class
                        if (rowEl) {
                            if (schedule[day] && schedule[day].toLowerCase() === 'tancat') {
                                rowEl.classList.add('tancat');
                            } else {
                                rowEl.classList.remove('tancat');
                            }
                        }
                    });
                }
            }
        });
    }

    // Get value by path (e.g., "hero.title")
    getValueByPath(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.content);
    }

    // Set value by path
    setValueByPath(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.content);
        target[lastKey] = value;
    }

    // Export content as JSON file
    exportContent() {
        const dataStr = JSON.stringify(this.content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'content-backup.json';
        link.click();
    }
}

// Initialize admin system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminSystem = new AdminSystem();
    console.log('🔐 Admin System loaded. Press Ctrl+Shift+A to access admin panel.');
});

// Helper function to change password
// Usage in console: changeAdminPassword('nouaContrasenya')
async function changeAdminPassword(newPassword) {
    const encoder = new TextEncoder();
    const data = encoder.encode(newPassword);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashString = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    console.log('Nova contrasenya hash:', hashString);
    console.log('Copia aquest hash i substitueix el valor de passwordHash a admin.js');
}
