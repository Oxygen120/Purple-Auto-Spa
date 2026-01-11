// --- 1. CONFIGURATION ---
const ADMIN_DASH = 'admin_dashboard.html';
const STAFF_DASH = 'staff_dashboard.html';
const LOGIN_PAGE = 'index.html';

// --- 2. GET SESSION (Ye Missing tha - Isliye Error aa raha tha) ---
// Ye function check karta hai ki user kaun hai aur uska naam kya hai
function getSession() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    // Fallback agar purana login system use ho raha ho
    const role = localStorage.getItem('userRole');
    if (role) {
        return { name: 'User', role: role };
    }
    return null;
}

// --- 3. CHECK AUTH (Security Check) ---
function checkAuth(requiredRole = null) {
    const user = getSession();
    const role = user ? user.role : null;
    
    // A. Agar banda Login hi nahi hai
    if (!role) {
        window.location.replace(LOGIN_PAGE);
        return;
    }

    // B. Agar Specific Role chahiye (Security Check)
    if (requiredRole && role !== requiredRole) {
        // Galat dashboard par aa gaya to sahi jagah bhejo
        if(role === 'Staff') {
            window.location.replace(STAFF_DASH);
        } else if(role === 'Admin') {
            window.location.replace(ADMIN_DASH);
        } else {
            logout();
        }
    }
}

// --- 4. LOGIN SUCCESS (Updated to save Name & ID) ---
// Ise ab aise call karna: handleLoginSuccess(response.user)
function handleLoginSuccess(userObj) {
    // Agar purane tareeke se sirf role string aayi hai to handle karo
    if (typeof userObj === 'string') {
        userObj = { role: userObj, name: 'User', id: '0' };
    }

    // 1. Pura data save karo (Name, ID, Role, Mobile)
    localStorage.setItem('user', JSON.stringify(userObj));
    
    // 2. Role alag se bhi save karo (Aapke existing logic ke liye)
    localStorage.setItem('userRole', userObj.role);
    localStorage.setItem('loginTime', new Date().getTime());

    // 3. Redirect
    if (userObj.role === 'Admin') {
        window.location.replace(ADMIN_DASH);
    } else if (userObj.role === 'Staff') {
        window.location.replace(STAFF_DASH);
    } else {
        alert("Invalid Role");
    }
}

// --- 5. CHECK ALREADY LOGGED IN ---
function checkAlreadyLogin() {
    const user = getSession();
    if (user && user.role) {
        if (user.role === 'Admin') {
            window.location.replace(ADMIN_DASH);
        } else if (user.role === 'Staff') {
            window.location.replace(STAFF_DASH);
        }
    }
}

// --- 6. LOGOUT FUNCTION ---
function logout() {
    // Sab saaf karo
    localStorage.removeItem('user');     // Naya data clear
    localStorage.removeItem('userRole'); // Purana data clear
    localStorage.removeItem('loginTime');
    sessionStorage.clear();

    // Wapas Login page par bhejo
    window.location.replace(LOGIN_PAGE);
}