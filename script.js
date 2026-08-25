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

    const chatBox = document.getElementById('chatBox');
    
    // Ek unique ID banate hain loading message ke liye
    const loadId = 'load-' + Date.now();
    chatBox.innerHTML += `<p><b>You:</b> ${safeQuestion}</p><p id="${loadId}"><i>Gyan Buddy soch raha hai...</i></p><hr>`;
    document.getElementById('userInput').value = "";

    try {
        let response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: safeQuestion, mode: mode, language: language })
        });
        let data = await response.json();
        
        // Loading message ko hata dein
        document.getElementById(loadId).style.display = 'none';
        
        // Jawab dikhayen ya API error batayen
        if (data.answer) {
            chatBox.innerHTML += `<p><b>Gyan Buddy:</b> ${data.answer}</p><hr>`;
        } else {
            chatBox.innerHTML += `<p style="color:red;"><b>Error:</b> AI ko API key nahi mili. Please check Vercel settings.</p><hr>`;
        }
    } catch (error) {
        document.getElementById(loadId).style.display = 'none';
        alert("Network error! AI se connect nahi ho paya.");
    }
});
