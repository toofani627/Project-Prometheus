const SESSION_KEY = 'agri_session';
const USERS_KEY = 'agri_users';

// Initialize hardcoded user "vaibhav" with password "qwerty"
function initUsers() {
  let users = {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) users = JSON.parse(raw);
  } catch {}
  
  if (!users['vaibhav']) {
    users['vaibhav'] = 'qwerty';
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
initUsers();

/**
 * Attempt login. 
 * - If username doesn't exist, create it with the provided password.
 * - If username exists, verify password.
 * Returns { success, error }
 */
export function login(username, password) {
  if (!username.trim()) {
    return { success: false, error: 'Please enter a username.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter a password.' };
  }

  const u = username.trim().toLowerCase();
  
  let users = {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) users = JSON.parse(raw);
  } catch {}

  if (!users[u]) {
    // New user -> register
    users[u] = password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } else {
    // Existing user -> check password
    if (users[u] !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
  }

  const session = {
    username: username.trim(), // Keep original casing for display
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true };
}

/**
 * Returns the session object or null if not logged in.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clears the session (logout).
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Helper to get the current user's profile key
 */
export function getProfileKey() {
  const session = getSession();
  if (!session) return 'farmerProfile';
  return `farmerProfile_${session.username.toLowerCase()}`;
}

