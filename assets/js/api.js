/* =========================================
   PURPLE AUTO SPA - API CONNECTOR
   Premium Data Bridge (Frontend <-> Google Sheets)
   ========================================= */

/**
 * Universal API Request Handler
 * Connects Frontend to Google Apps Script Backend securely.
 * * @param {string} action - The backend function name (e.g., 'login', 'createJob')
 * @param {object} payload - The data object to send (e.g., { mobile: '...', password: '...' })
 * @returns {Promise<object>} - The JSON response from server
 */
async function apiRequest(action, payload = {}) {
    
    // 1. Connectivity Check (Premium Experience)
    // User ko wait karwane se behtar hai pehle hi bata do agar net nahi hai
    if (!navigator.onLine) {
        if (typeof showToast === "function") {
            showToast("No Internet Connection. Please check network.", "error");
        } else {
            console.error("Offline");
        }
        return { status: "error", message: "Offline" };
    }

    // 2. Prepare Data Packet
    // Backend expects 'action' inside the JSON object to route the request
    const bodyData = {
        action: action,
        ...payload
    };

    try {
        // 3. Send Request to Google Apps Script
        // NOTE: We use 'Content-Type': 'text/plain' intentionally.
        // This trick bypasses Google's CORS Preflight (OPTIONS) check, making the app faster.
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8", 
            },
            body: JSON.stringify(bodyData)
        });

        // 4. Validate Network Response
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        // 5. Parse JSON
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("API Critical Error:", error);
        
        // Premium Error Feedback via Toast (No Alerts)
        if (typeof showToast === "function") {
            // Agar TypeError hai, usually connection issue ya URL galat hai
            if (error.name === 'TypeError') {
                showToast("Connection Failed. Check URL or Internet.", "error");
            } else {
                showToast("Server not responding. Try again.", "error");
            }
        }

        return { status: "error", message: error.toString() };
    }
}

