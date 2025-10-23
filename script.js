const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  addMessage("Thinking...", "bot");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }]
        })
      }
    );

    const data = await response.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    updateLastBotMessage(output);
  } catch (err) {
    updateLastBotMessage("⚠️ Error: Could not reach Gemini API.");
  }
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(newText) {
  const botMessages = [...chatBox.getElementsByClassName("bot")];
  if (botMessages.length > 0) {
    botMessages[botMessages.length - 1].innerText = newText;
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
