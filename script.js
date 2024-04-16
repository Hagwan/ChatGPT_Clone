import { GoogleGenerativeAI } from "@google/generative-ai";
const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector('.chat-container');
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "xx";
const genAI = new GoogleGenerativeAI(API_KEY);

let userText = null;


const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}







async function run(incomingChatDiv) {

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const pElement = document.createElement("p");
    const prompt = userText;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    pElement.textContent = response.text();
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
}


const copyResponse = (copyBtn) => {
    // Assuming the response text is in an element with the class "response-text"
    const responseTextElement = copyBtn.closest(".chat-details").querySelector(".response-text");

    navigator.clipboard.writeText(responseTextElement.textContent)
        .then(() => {
            copyBtn.textContent = "done";
            setTimeout(() => copyBtn.textContent = "content_copy", 2000);
        })
        .catch(err => {
            console.error("Failed to copy text: ", err);
            // Potentially display an error message to the user
        });
}

const showTypinAnimation = () => {
    const html = `<div class="chat-content ">
            <div class="chat-details">
                <img src="images/chatbot.jpg" alt="Bot-image" />
                <div class="typing-animation">
                  <div class="typing-dot" style="--delay: 0.2s"></div>
                  <div class="typing-dot" style="--delay: 0.3s"></div>
                  <div class="typing-dot" style="--delay: 0.4s"></div>
                </div>
                </div>
            <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span> 
              </div>`
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    run(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;
    const html = `<div class="chat-content">
           <div class="chat-details">
            <img src="images/user.jpg" alt="User-image" />
               <p></p>
            </div>
        </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypinAnimation, 600);

}
sendButton.addEventListener("click", handleOutgoingChat);

