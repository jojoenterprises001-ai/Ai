const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

let isLoading = false;


/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

  if (isLoading) return;

  const question = userInput.value.trim();

  if (!question) return;

  isLoading = true;
  sendBtn.disabled = true;

  // Remove welcome screen
  const welcome = document.getElementById("welcome");

  if (welcome) {
    welcome.remove();
  }

  // Show student's question
  addMessage(question, "user");

  // Clear input
  userInput.value = "";
  userInput.style.height = "auto";

  // Show typing animation
  const typingMessage = addTyping();

  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: question
      })

    });


    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid server response.");
    }


    // Remove typing animation
    typingMessage.remove();


    if (!response.ok) {

      throw new Error(
        data.error || "Something went wrong."
      );

    }


    const answer = data.answer;


    if (!answer) {

      throw new Error(
        "Study.ai did not return an answer."
      );

    }


    // Show AI teacher answer
    addMessage(
      formatAIResponse(answer),
      "ai",
      true
    );


  } catch (error) {

    console.error(error);

    typingMessage.remove();

    addMessage(
      "Sorry, I couldn't answer your question right now. Please try again.",
      "ai"
    );

  }


  isLoading = false;
  sendBtn.disabled = false;

  userInput.focus();

}


/* =========================
   ADD MESSAGE
========================= */

function addMessage(
  content,
  type,
  isHTML = false
) {

  const row = document.createElement("div");

  row.className =
    "message-row " + type;


  const bubble =
    document.createElement("div");

  bubble.className = "message";


  if (isHTML) {

    bubble.innerHTML = content;

  } else {

    bubble.textContent = content;

  }


  row.appendChild(bubble);

  messages.appendChild(row);


  scrollToBottom();


  return row;

}


/* =========================
   TYPING ANIMATION
========================= */

function addTyping() {

  const row =
    document.createElement("div");

  row.className =
    "message-row ai";


  const bubble =
    document.createElement("div");

  bubble.className =
    "message";


  bubble.innerHTML = `
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;


  row.appendChild(bubble);

  messages.appendChild(row);


  scrollToBottom();


  return row;

}


/* =========================
   AUTO SCROLL
========================= */

function scrollToBottom() {

  requestAnimationFrame(() => {

    messages.scrollTo({

      top: messages.scrollHeight,

      behavior: "smooth"

    });

  });

}


/* =========================
   FORMAT AI RESPONSE
========================= */

function formatAIResponse(text) {

  let safeText =
    escapeHTML(text);


  /*
    Convert **text**
    into bold text
  */

  safeText =
    safeText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );


  /*
    Convert `code`
    into code style
  */

  safeText =
    safeText.replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    );


  /*
    Convert headings
  */

  safeText =
    safeText.replace(
      /^### (.*)$/gm,
      "<strong>$1</strong>"
    );


  /*
    Keep line breaks
  */

  safeText =
    safeText.replace(
      /\n/g,
      "<br>"
    );


  return safeText;

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================
   TEXTAREA AUTO RESIZE
========================= */

userInput.addEventListener(
  "input",
  () => {

    userInput.style.height =
      "auto";


    userInput.style.height =
      Math.min(
        userInput.scrollHeight,
        120
      ) + "px";

  }
);


/* =========================
   ENTER TO SEND
========================= */

userInput.addEventListener(
  "keydown",
  (event) => {

    /*
      Enter = Send
      Shift + Enter = New line
    */

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  }
);


/* =========================
   SEND BUTTON
========================= */

sendBtn.addEventListener(
  "click",
  sendMessage
);


/* =========================
   ABOUT BUTTON
========================= */

aboutBtn.addEventListener(
  "click",
  () => {

    aboutModal.classList.add("show");

  }
);


/* =========================
   CLOSE ABOUT
========================= */

closeModal.addEventListener(
  "click",
  () => {

    aboutModal.classList.remove("show");

  }
);


/* =========================
   CLOSE MODAL
   OUTSIDE CLICK
========================= */

aboutModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === aboutModal
    ) {

      aboutModal.classList.remove(
        "show"
      );

    }

  }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      aboutModal.classList.remove(
        "show"
      );

    }

  }
);
