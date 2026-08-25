document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('dropdown').classList.toggle('hidden');
});

document.getElementById('aboutUs').addEventListener('click', () => {
    alert("Created by Shlok Choudhary\nThis is a free educational platform.");
});

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

document.getElementById('sendBtn').addEventListener('click', async () => {
    let rawInput = document.getElementById('userInput').value;
    if (rawInput.trim() === "") { alert("Please ask a question first!"); return; }

    let safeQuestion = sanitizeInput(rawInput);
    let language = document.getElementById('language').value;
    let mode = document.querySelector('input[name="mode"]:checked').value;

    // Loading dikhane ke liye
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<p><b>You:</b> ${safeQuestion}</p><p><i>Gyan Buddy soch raha hai...</i></p><hr>`;
    document.getElementById('userInput').value = "";

    // AI se connect karna
    try {
        let response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: safeQuestion, mode: mode, language: language })
        });
        let data = await response.json();
        
        // Jawab dikhana
        chatBox.innerHTML += `<p><b>Gyan Buddy:</b> ${data.answer}</p><hr>`;
    } catch (error) {
        alert("Network error! AI se connect nahi ho paya.");
    }
});
