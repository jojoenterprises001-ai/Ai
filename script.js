// 1. Menu Logic & About Us
document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('dropdown').classList.toggle('hidden');
});

document.getElementById('aboutUs').addEventListener('click', () => {
    alert("Created by Shlok Choudhary\nThis is a free educational platform.");
});

// 2. High Security Input Sanitization (XSS Protection)
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input; // Converts dangerous HTML tags into plain text
    return div.innerHTML;
}

// 3. Handle Question and Modes
document.getElementById('sendBtn').addEventListener('click', () => {
    let rawInput = document.getElementById('userInput').value;
    
    // Validation: Empty input check
    if (rawInput.trim() === "") {
        alert("Please ask a question first!");
        return;
    }

    // Secure the input
    let safeQuestion = sanitizeInput(rawInput);
    let language = document.getElementById('language').value;
    let mode = document.querySelector('input[name="mode"]:checked').value;

    console.log("Safe Question:", safeQuestion);
    console.log("Mode:", mode);
    console.log("Language:", language);

    // AI API integration will go here (Next Step)
    document.getElementById('userInput').value = ""; 
});

