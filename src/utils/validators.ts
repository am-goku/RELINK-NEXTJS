// --- Validators ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]|\\:;"'<>.,?/~`]{8,}$/; // ≥8 chars, letters + numbers
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // 3-20, letters/numbers/_ only

export { emailRegex, passwordRegex, usernameRegex };