// Check localStorage persistence in browser
console.log("=== localStorage Data Check ===");

// Get all localStorage keys
let keys = [];
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    keys.push(key);
    console.log(`Key: ${key}, Value:`, localStorage.getItem(key));
}

console.log("Total localStorage items:", localStorage.length);
console.log("Keys:", keys);

// Check if account data is persisted
if (localStorage.getItem('account_credit')) {
    console.log("Account credit:", localStorage.getItem('account_credit'));
}

if (localStorage.getItem('user_account')) {
    console.log("User account:", localStorage.getItem('user_account'));
}

// Check sessionStorage too
console.log("\n=== sessionStorage Data Check ===");
console.log("sessionStorage items:", sessionStorage.length);
for (let i = 0; i < sessionStorage.length; i++) {
    let key = sessionStorage.key(i);
    console.log(`Key: ${key}, Value:`, sessionStorage.getItem(key));
}
