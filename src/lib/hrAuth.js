// HR Partner System — Auth Utility
// All localStorage access is guarded for SSR safety.

// ─── Storage key constants ────────────────────────────────────────────────────
export const STORAGE_KEYS = Object.freeze({
  USERS:         'hr_users',
  SESSION:       'hr_session',
  CANDIDATES:    'hr_candidates',
  INTERVIEWS:    'hr_interviews',
  OFFER_LETTERS: 'hr_offer_letters',
});

// ─── Role → secret key mapping ───────────────────────────────────────────────
export const HR_ROLE_SECRET_KEYS = Object.freeze({
  Admin:          'ADMIN_SECRET_2024',
  HR:             'HR_SECRET_2024',
  'Team Leader':  'TL_SECRET_2024',
  Employee:       'EMP_SECRET_2024',
});

// ─── Dashboard URL per role ───────────────────────────────────────────────────
export const DASHBOARD_URLS = Object.freeze({
  HR:             '/partner/hr/dashboard',
  Admin:          '/partner/admin/dashboard',
  'Team Leader':  '/partner/tl/dashboard',
  Employee:       '/partner/employee/dashboard',
});

// ─── Default seeded HR user ───────────────────────────────────────────────────
export const DEFAULT_HR_USER = Object.freeze({
  email:    'hr@gmail.com',
  password: '123456',
  role:     'HR',
  fullName: 'HR Admin',
});

// ─── Password encoding ────────────────────────────────────────────────────────
/**
 * Encodes a plaintext password using btoa (base-64).
 * NOTE: This is NOT a cryptographic hash — it is used here per the spec requirement.
 */
export function hashPassword(plaintext) {
  return btoa(plaintext);
}

// ─── Safe localStorage helpers ───────────────────────────────────────────────
/**
 * Reads and parses a JSON array from localStorage.
 * Returns [] on any failure (unavailable, corrupt JSON, non-array value).
 */
export function readStore(key) {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(key);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes an array to localStorage as JSON.
 * Returns { ok: true } on success, { ok: false, error } on failure.
 */
export function writeStore(key, array) {
  try {
    if (typeof window === 'undefined') return { ok: false, error: 'SSR environment' };
    window.localStorage.setItem(key, JSON.stringify(array));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message ?? 'Storage unavailable' };
  }
}

// ─── Session helpers ─────────────────────────────────────────────────────────
export function getSession() {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.role) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setSession(userWithoutHash) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(userWithoutHash));
  } catch {
    // silently fail
  }
}

export function clearSession() {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch {
    // silently fail
  }
}

// ─── Default user seeding ────────────────────────────────────────────────────
/**
 * Ensures the Default_HR_User exists in hr_users.
 * Idempotent — safe to call multiple times.
 */
export function seedDefaultUser() {
  const users = readStore(STORAGE_KEYS.USERS);
  const exists = users.some(
    (u) => typeof u.email === 'string' && u.email.toLowerCase() === DEFAULT_HR_USER.email
  );
  if (!exists) {
    const newUser = {
      id: generateId(),
      fullName: DEFAULT_HR_USER.fullName,
      email: DEFAULT_HR_USER.email,
      passwordHash: hashPassword(DEFAULT_HR_USER.password),
      role: DEFAULT_HR_USER.role,
      createdAt: new Date().toISOString(),
    };
    writeStore(STORAGE_KEYS.USERS, [...users, newUser]);
  }
}

// ─── Signup ───────────────────────────────────────────────────────────────────
/**
 * Validates and creates a new HR user account.
 * Returns { ok: true } or { ok: false, errors: { field: message } }
 */
export function signupUser({ fullName, email, password, role, secretKey }) {
  const errors = {};

  // Field-level validation
  const trimmedName = (fullName || '').trim();
  if (!trimmedName) errors.fullName = 'Full name is required.';
  else if (trimmedName.length > 100) errors.fullName = 'Full name must be 100 characters or fewer.';

  const trimmedEmail = (email || '').trim();
  if (!trimmedEmail) errors.email = 'Email is required.';
  else if (!isValidEmail(trimmedEmail)) errors.email = 'Enter a valid email address.';

  const trimmedPassword = password || '';
  if (!trimmedPassword) errors.password = 'Password is required.';
  else if (trimmedPassword.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (trimmedPassword.length > 128) errors.password = 'Password must be 128 characters or fewer.';

  const validRoles = Object.keys(HR_ROLE_SECRET_KEYS);
  if (!role || !validRoles.includes(role)) errors.role = 'Select a valid role.';

  const trimmedKey = (secretKey || '').trim();
  if (!trimmedKey) errors.secretKey = 'Secret key is required.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // Secret key verification (case-sensitive exact match)
  if (trimmedKey !== HR_ROLE_SECRET_KEYS[role]) {
    return { ok: false, errors: { secretKey: 'Invalid secret key for the selected role.' } };
  }

  // Duplicate email check (case-insensitive)
  const users = readStore(STORAGE_KEYS.USERS);
  const emailLower = trimmedEmail.toLowerCase();
  if (users.some((u) => typeof u.email === 'string' && u.email.toLowerCase() === emailLower)) {
    return { ok: false, errors: { email: 'This email is already registered.' } };
  }

  // Persist new user
  const newUser = {
    id: generateId(),
    fullName: trimmedName,
    email: emailLower,
    passwordHash: hashPassword(trimmedPassword),
    role,
    createdAt: new Date().toISOString(),
  };
  const result = writeStore(STORAGE_KEYS.USERS, [...users, newUser]);
  if (!result.ok) {
    return { ok: false, errors: { _form: 'Unable to save account. Please try again.' } };
  }

  return { ok: true };
}

// ─── Login ────────────────────────────────────────────────────────────────────
/**
 * Validates credentials and creates a session.
 * Returns { ok: true, user } or { ok: false, error: string }
 */
export function loginUser({ email, password }) {
  const trimmedEmail = (email || '').trim();
  const trimmedPassword = password || '';

  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false, error: 'Invalid email or password' };
  }

  const users = readStore(STORAGE_KEYS.USERS);
  const emailLower = trimmedEmail.toLowerCase();
  const found = users.find(
    (u) => typeof u.email === 'string' && u.email.toLowerCase() === emailLower
  );

  if (!found || found.passwordHash !== hashPassword(trimmedPassword)) {
    return { ok: false, error: 'Invalid email or password' };
  }

  // Return user object WITHOUT passwordHash
  const { passwordHash: _omit, ...userWithoutHash } = found;
  return { ok: true, user: userWithoutHash };
}

// ─── Name update ──────────────────────────────────────────────────────────────
/**
 * Updates fullName in both hr_users and hr_session atomically.
 * Returns { ok: true, user } or { ok: false, error }
 */
export function updateUserName(userId, newName) {
  const trimmedName = (newName || '').trim();
  if (!trimmedName) return { ok: false, error: 'Name cannot be empty.' };
  if (trimmedName.length > 100) return { ok: false, error: 'Name must be 100 characters or fewer.' };

  const users = readStore(STORAGE_KEYS.USERS);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: 'User not found.' };

  const updatedUsers = users.map((u) =>
    u.id === userId ? { ...u, fullName: trimmedName } : u
  );

  // Write Auth_Store first
  const usersResult = writeStore(STORAGE_KEYS.USERS, updatedUsers);
  if (!usersResult.ok) return { ok: false, error: 'Failed to update profile. Please try again.' };

  // Write Session_Store second
  const session = getSession();
  if (session) {
    const updatedSession = { ...session, fullName: trimmedName };
    const sessionResult = writeStore(STORAGE_KEYS.SESSION, updatedSession);
    if (!sessionResult.ok) {
      // Rollback Auth_Store to maintain atomicity
      writeStore(STORAGE_KEYS.USERS, users);
      return { ok: false, error: 'Failed to update session. Please try again.' };
    }
    return { ok: true, user: updatedSession };
  }

  return { ok: true, user: updatedUsers[idx] };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function isValidEmail(email) {
  // RFC-5322 simplified regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
