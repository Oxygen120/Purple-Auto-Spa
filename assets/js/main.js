/* =========================================
   PURPLE AUTO SPA - UI & UTILITIES
   Handles: Popups, Network Status, PWA, Ripples
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initNetworkChecker();
    initRippleEffect();
    initPWA();
});

/* ---------------------------------------------------------
   1. CUSTOM TOAST NOTIFICATION (Replaces Alert)
   Usage: showToast('Saved Successfully', 'success')
   Types: 'success', 'error', 'info'
   --------------------------------------------------------- */
window.showToast = function(message, type = 'info') {
    // Remove existing toast if any
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    // Icon Selection
    let icon = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);

    // Animation In
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto Dismiss (3 Seconds)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

/* ---------------------------------------------------------
   2. CUSTOM CONFIRM MODAL (Replaces window.confirm)
   Usage: await showConfirm("Delete Job?", "This action cannot be undone.")
   Returns: true (Yes) or false (Cancel)
   --------------------------------------------------------- */
window.showConfirm = function(title, message, type = 'warn') {
    return new Promise((resolve) => {
        // Create Overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Icon Logic
        let iconClass = 'fa-exclamation-triangle icon-warn';
        let btnClass = 'btn-confirm';
        
        if (type === 'danger') {
            iconClass = 'fa-trash-alt icon-danger';
            btnClass = 'btn-confirm style="background:var(--danger)"'; 
        }
        if (type === 'success') {
            iconClass = 'fa-check-circle icon-success';
        }

        overlay.innerHTML = `
            <div class="custom-box">
                <i class="fas ${iconClass} box-icon"></i>
                <div class="box-title">${title}</div>
                <div class="box-desc">${message}</div>
                <div class="box-actions">
                    <button class="box-btn btn-cancel" id="modalCancel">Cancel</button>
                    <button class="box-btn ${btnClass}" id="modalConfirm">Yes, Proceed</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Animation
        requestAnimationFrame(() => {
            overlay.style.display = 'flex';
            requestAnimationFrame(() => overlay.classList.add('show'));
        });

        // Handlers
        const close = (result) => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                resolve(result);
            }, 300);
        };

        document.getElementById('modalCancel').onclick = () => close(false);
        document.getElementById('modalConfirm').onclick = () => close(true);
    });
};

/* ---------------------------------------------------------
   3. NETWORK STATUS CHECKER
   --------------------------------------------------------- */
function initNetworkChecker() {
    window.addEventListener('online', () => showToast("Back Online", "success"));
    window.addEventListener('offline', () => showToast("Internet Connection Lost", "error"));
}

/* ---------------------------------------------------------
   4. RIPPLE EFFECT (Material Click Animation)
   --------------------------------------------------------- */
function initRippleEffect() {
    document.addEventListener('click', function (e) {
        // Apply to specific classes
        const target = e.target.closest('.btn-main, .tile, .menu-item, .box-btn, .page-btn, .action-btn');
        
        if (target) {
            const circle = document.createElement('span');
            const diameter = Math.max(target.clientWidth, target.clientHeight);
            const radius = diameter / 2;
            const rect = target.getBoundingClientRect();
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            // Remove old ripple
            const oldRipple = target.querySelector('.ripple');
            if (oldRipple) oldRipple.remove();

            target.appendChild(circle);
        }
    });
}

/* ---------------------------------------------------------
   5. PWA INSTALLER (Service Worker)
   --------------------------------------------------------- */
function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW Registered'))
                .catch(err => console.log('SW Fail', err));
        });
    }
}

/* ---------------------------------------------------------
   6. UTILITY: FORMATTERS
   --------------------------------------------------------- */
// Format Date (e.g., 06 Jan 2026)
function formatDate(dateString) {
    if(!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Format Currency (e.g., ₹1,200)
function formatMoney(amount) {
    return "₹" + parseFloat(amount || 0).toLocaleString('en-IN');
}

// Format Time (e.g., 10:30 AM)
// --- FIXED TIME FORMATTER (String to AM/PM) ---
function formatTime12(timeStr) {
    if (!timeStr) return '';

    // Step 1: Agar time Date object banke aa gaya (Galti se), to string bana lo
    let cleanStr = String(timeStr);

    // Step 2: Check karo agar ye "HH:mm" format hai (e.g. "14:30")
    if (cleanStr.includes(':')) {
        let parts = cleanStr.split(':');
        let hours = parseInt(parts[0]);
        let minutes = parts[1].substring(0, 2); // Seconds hatao

        // AM/PM Logic
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 ko 12 banao
        
        return `${hours}:${minutes} ${ampm}`;
    }

    // Fallback: Agar format samajh nahi aaya to waisa hi dikha do
    return cleanStr;
}
