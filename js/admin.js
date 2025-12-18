class AdminSystem {
    constructor() {
        this.isAuthenticated = false;
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

    async initFirebase() {
        try {
            if (typeof firebase === 'undefined') return;
            if (!window.firebaseConfig || window.firebaseConfig.apiKey === 'SUBSTITUEIX_AMB_LA_TEVA_API_KEY') return;

            firebase.initializeApp(window.firebaseConfig);
            this.db = firebase.firestore();
            this.firebaseInitialized = true;
            await this.loadContentFromFirebase();
        } catch (error) {
            console.error('Firebase error:', error);
        }
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                if (!this.isAuthenticated) this.showLoginModal();
                else this.logout();
            }
        });
    }

    createLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-login-modal';
        modal.id = 'adminLoginModal';
        modal.innerHTML = `
            <div class="admin-login-content">
                <h2>Admin</h2>
                <form class="admin-login-form" id="adminLoginForm">
                    <input type="password" id="adminPassword" placeholder="Contrasenya" autocomplete="off" required />
                    <div class="admin-login-buttons">
                        <button type="submit" class="admin-btn-login">Entrar</button>
                        <button type="button" class="admin-btn-cancel" id="adminCancelBtn">Cancel·lar</button>
                    </div>
                </form>
                <div class="admin-error-message" id="adminErrorMsg">Contrasenya incorrecta</div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
        document.getElementById('adminCancelBtn').addEventListener('click', () => this.hideLoginModal());
        modal.addEventListener('click', (e) => { if (e.target === modal) this.hideLoginModal(); });
    }

    createEditModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-edit-modal';
        modal.id = 'adminEditModal';
        modal.innerHTML = `
            <div class="admin-edit-content">
                <h3>Editar</h3>
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

        document.getElementById('adminEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });
        modal.querySelector('.admin-btn-cancel-edit').addEventListener('click', () => this.hideEditModal());
        modal.addEventListener('click', (e) => { if (e.target === modal) this.hideEditModal(); });
    }

    createAdminIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'admin-mode-indicator';
        indicator.id = 'adminModeIndicator';
        indicator.innerHTML = `<span>Mode Admin</span><button class="admin-logout-btn" id="adminLogoutBtn">Sortir</button>`;
        document.body.appendChild(indicator);
        document.getElementById('adminLogoutBtn').addEventListener('click', () => this.logout());
    }

    createSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'admin-success-message';
        message.id = 'adminSuccessMsg';
        message.textContent = 'Guardat!';
        document.body.appendChild(message);
    }

    createErrorMessage() {
        const message = document.createElement('div');
        message.className = 'admin-error-toast';
        message.id = 'adminErrorToast';
        document.body.appendChild(message);
    }

    showLoginModal() {
        if (!this.firebaseInitialized) return;
        document.getElementById('adminLoginModal').classList.add('active');
        document.getElementById('adminPassword').focus();
    }

    hideLoginModal() {
        document.getElementById('adminLoginModal').classList.remove('active');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminErrorMsg').classList.remove('show');
    }

    showEditModal() { document.getElementById('adminEditModal').classList.add('active'); }
    hideEditModal() { document.getElementById('adminEditModal').classList.remove('active'); }

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
            setTimeout(() => document.getElementById('adminErrorMsg').classList.remove('show'), 3000);
        }
    }

    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('adminAuth');
        this.deactivateAdminMode();
    }

    checkAuthStatus() {
        if (sessionStorage.getItem('adminAuth') === 'true' && this.firebaseInitialized) {
            this.isAuthenticated = true;
            this.activateAdminMode();
        }
    }

    activateAdminMode() {
        document.body.classList.add('admin-mode');
        document.getElementById('adminModeIndicator').classList.add('active');
        this.addEditButtons();
    }

    deactivateAdminMode() {
        document.body.classList.remove('admin-mode');
        document.getElementById('adminModeIndicator').classList.remove('active');
    }

    addEditButtons() {
        document.querySelectorAll('[data-editable]').forEach(element => {
            if (element.querySelector('.admin-edit-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'admin-edit-btn';
            btn.textContent = '✏️';
            btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.openEditModal(element); };
            if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
                element.style.position = 'relative';
                btn.style.position = 'absolute';
                btn.style.top = '5px';
                btn.style.right = '5px';
                element.insertBefore(btn, element.firstChild);
            } else {
                element.parentNode.insertBefore(btn, element.nextSibling);
            }
        });
    }

    openEditModal(element) {
        const path = element.dataset.editable;
        const type = element.dataset.editableType || 'text';
        const value = this.getValueByPath(path);
        const fieldsContainer = document.getElementById('adminEditFields');
        fieldsContainer.innerHTML = '';

        if (type === 'text') {
            fieldsContainer.innerHTML = `<div class="admin-form-group"><label>Text:</label><textarea id="editValue" rows="4">${value || ''}</textarea></div>`;
        } else if (type === 'image' || type === 'link') {
            fieldsContainer.innerHTML = `<div class="admin-form-group"><label>URL:</label><input type="text" id="editValue" value="${value || ''}" placeholder="https://..."></div>`;
        } else if (type === 'menu-item') {
            const item = value || {};
            fieldsContainer.innerHTML = `
                <div class="admin-form-group"><label>Nom:</label><input type="text" id="editName" value="${item.name || ''}"></div>
                <div class="admin-form-group"><label>Ingredients:</label><textarea id="editIngredients" rows="2">${item.ingredients || ''}</textarea></div>
                <div class="admin-form-group"><label>Preu:</label><input type="text" id="editPrice" value="${item.price || ''}"></div>
                <div class="admin-form-group"><label>Imatge:</label><input type="text" id="editImage" value="${item.image || ''}"></div>
            `;
        } else if (type === 'event') {
            const item = value || {};
            fieldsContainer.innerHTML = `
                <div class="admin-form-group"><label>Dia:</label><input type="text" id="editDay" value="${item.day || ''}"></div>
                <div class="admin-form-group"><label>Mes:</label><input type="text" id="editMonth" value="${item.month || ''}"></div>
                <div class="admin-form-group"><label>Títol:</label><input type="text" id="editTitle" value="${item.title || ''}"></div>
                <div class="admin-form-group"><label>Descripció:</label><textarea id="editDescription" rows="2">${item.description || ''}</textarea></div>
                <div class="admin-form-group"><label>Hora:</label><input type="text" id="editTime" value="${item.time || ''}"></div>
                <div class="admin-form-group"><label>Tipus:</label><input type="text" id="editType" value="${item.type || ''}"></div>
            `;
        } else if (type === 'schedule') {
            const schedule = value?.schedule || {};
            fieldsContainer.innerHTML = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge']
                .map(day => `<div class="admin-form-group"><label>${day.charAt(0).toUpperCase() + day.slice(1)}:</label><input type="text" id="edit${day.charAt(0).toUpperCase() + day.slice(1)}" value="${schedule[day] || ''}"></div>`)
                .join('');
        }

        document.getElementById('adminEditForm').dataset.path = path;
        document.getElementById('adminEditForm').dataset.type = type;
        this.showEditModal();
        const firstInput = fieldsContainer.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
    }

    async saveEdit() {
        if (!this.firebaseInitialized) return;
        const form = document.getElementById('adminEditForm');
        const path = form.dataset.path;
        const type = form.dataset.type || 'text';

        if (type === 'text' || type === 'image' || type === 'link') {
            this.setValueByPath(path, document.getElementById('editValue').value);
        } else if (type === 'menu-item') {
            this.setValueByPath(path, {
                name: document.getElementById('editName').value,
                ingredients: document.getElementById('editIngredients').value,
                price: document.getElementById('editPrice').value,
                image: document.getElementById('editImage').value
            });
        } else if (type === 'event') {
            this.setValueByPath(path, {
                day: document.getElementById('editDay').value,
                month: document.getElementById('editMonth').value,
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDescription').value,
                time: document.getElementById('editTime').value,
                type: document.getElementById('editType').value
            });
        } else if (type === 'schedule') {
            this.setValueByPath(path + '.schedule', {
                dilluns: document.getElementById('editDilluns').value,
                dimarts: document.getElementById('editDimarts').value,
                dimecres: document.getElementById('editDimecres').value,
                dijous: document.getElementById('editDijous').value,
                divendres: document.getElementById('editDivendres').value,
                dissabte: document.getElementById('editDissabte').value,
                diumenge: document.getElementById('editDiumenge').value
            });
        }

        if (await this.saveContentToFirebase()) {
            this.updateDOM();
            this.hideEditModal();
            this.showSuccessMessage();
        }
    }

    showSuccessMessage() {
        const msg = document.getElementById('adminSuccessMsg');
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 2000);
    }

    async loadContentFromFirebase() {
        try {
            const doc = await this.db.collection('website').doc('content').get();
            if (doc.exists) {
                this.content = doc.data();
                this.updateDOM();
            } else {
                await this.loadContentFromJSON();
            }
        } catch (error) {
            console.error('Firebase load error:', error);
        }
    }

    async loadContentFromJSON() {
        try {
            const response = await fetch('docs/content.json');
            this.content = await response.json();
            if (this.firebaseInitialized) await this.saveContentToFirebase();
            this.updateDOM();
        } catch (error) {
            console.error('JSON load error:', error);
        }
    }

    async saveContentToFirebase() {
        if (!this.firebaseInitialized) return false;
        try {
            await this.db.collection('website').doc('content').set(this.content);
            return true;
        } catch (error) {
            console.error('Firebase save error:', error);
            return false;
        }
    }

    updateDOM() {
        if (!this.content) return;
        document.querySelectorAll('[data-editable]').forEach(element => {
            const path = element.dataset.editable;
            const value = this.getValueByPath(path);
            const type = element.dataset.editableType || 'text';
            if (value === undefined || value === null) return;

            if (type === 'text') element.textContent = value;
            else if (type === 'image') element.src = value;
            else if (type === 'link') element.href = value;
            else if (type === 'menu-item') {
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
                ['day', 'month', 'title', 'description', 'time', 'type'].forEach(field => {
                    const el = element.querySelector(`[data-field="${field}"]`);
                    if (el) el.textContent = value[field] || '';
                });
            } else if (type === 'schedule') {
                const schedule = value.schedule || {};
                ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'].forEach(day => {
                    const hoursEl = element.querySelector(`[data-field="${day}"]`);
                    const rowEl = element.querySelector(`[data-day="${day}"]`);
                    if (hoursEl && schedule[day]) hoursEl.textContent = schedule[day];
                    if (rowEl) rowEl.classList.toggle('tancat', schedule[day]?.toLowerCase() === 'tancat');
                });
            }
        });
    }

    getValueByPath(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.content);
    }

    setValueByPath(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.content);
        target[lastKey] = value;
    }
}

document.addEventListener('DOMContentLoaded', () => { window.adminSystem = new AdminSystem(); });
