// Admin System for Hidden District
// Author: Claude Code
// Access: Ctrl+Shift+A

class AdminSystem {
    constructor() {
        this.isAuthenticated = false;
        // IMPORTANT: Canvia aquesta contrasenya!
        // Aquesta és la contrasenya encriptada amb SHA-256
        // Contrasenya per defecte: "hiddendistrict2024"
        this.passwordHash = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
        this.content = null;
        this.init();
    }

    init() {
        this.createLoginModal();
        this.createEditModal();
        this.createAdminIndicator();
        this.createSuccessMessage();
        this.setupKeyboardShortcut();
        this.loadContent();
        this.checkAuthStatus();
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

    // Show/hide modals
    showLoginModal() {
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
            localStorage.setItem('adminAuth', 'true');
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
        localStorage.removeItem('adminAuth');
        this.deactivateAdminMode();
    }

    // Check auth status on page load
    checkAuthStatus() {
        const isAuth = localStorage.getItem('adminAuth');
        if (isAuth === 'true') {
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
        }

        // Store the path for saving
        document.getElementById('adminEditForm').dataset.path = path;
        document.getElementById('adminEditForm').dataset.element = element.id || '';

        this.showEditModal();
        document.getElementById('editValue').focus();
    }

    // Save edit
    saveEdit() {
        const form = document.getElementById('adminEditForm');
        const path = form.dataset.path;
        const newValue = document.getElementById('editValue').value;

        this.setValueByPath(path, newValue);
        this.saveContent();
        this.updateDOM();
        this.hideEditModal();
        this.showSuccessMessage();
    }

    // Show success message
    showSuccessMessage() {
        const msg = document.getElementById('adminSuccessMsg');
        msg.classList.add('show');
        setTimeout(() => {
            msg.classList.remove('show');
        }, 3000);
    }

    // Load content from JSON or localStorage
    loadContent() {
        const savedContent = localStorage.getItem('hiddenDistrictContent');
        if (savedContent) {
            this.content = JSON.parse(savedContent);
        } else {
            // Load from content.json
            fetch('content.json')
                .then(response => response.json())
                .then(data => {
                    this.content = data;
                    this.updateDOM();
                })
                .catch(error => {
                    console.error('Error loading content:', error);
                });
        }
    }

    // Save content to localStorage
    saveContent() {
        localStorage.setItem('hiddenDistrictContent', JSON.stringify(this.content));
    }

    // Update DOM with current content
    updateDOM() {
        if (!this.content) return;

        // Update all elements with data-editable attribute
        const editables = document.querySelectorAll('[data-editable]');
        editables.forEach(element => {
            const path = element.dataset.editable;
            const value = this.getValueByPath(path);

            if (value !== undefined && value !== null) {
                const type = element.dataset.editableType || 'text';

                if (type === 'text') {
                    element.textContent = value;
                } else if (type === 'image') {
                    element.src = value;
                } else if (type === 'link') {
                    element.href = value;
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

    // Add export button to admin mode (optional)
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
