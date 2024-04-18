import { GoogleGenerativeAI } from "@google/generative-ai";
const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector('.chat-container');
const themeButton = document.querySelector('#theme-btn');
const deleteButton = document.querySelector('#delete-btn');
const intialHeight = chatInput.scrollHeight;

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "add-your-api-key-here";
const genAI = new GoogleGenerativeAI(API_KEY);
const loadDataFromLocalStorage = () => {

    const theme = localStorage.getItem("theme");

    const defaultText = `<div class="default-text">
                            <h1> <span class="title" >Gemini</span> Meets <span class="title-gpt">ChatGPT</span></h1>
                            <p>Start a conversation with the Gemini AI model by typing in the chat box below.</p>
                         </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;



}
loadDataFromLocalStorage();

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

    localStorage.setItem("all-chats", chatContainer.innerHTML);

    const copyBtn = incomingChatDiv.querySelector(".material-symbols-rounded");
    copyBtn.addEventListener("click", () => copyResponse(copyBtn));
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatInput.value = "";
    chatInput.focus();
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
    chatInput.style.height = `${intialHeight}px`;
    chatInput.value

    const html = `<div class="chat-content">
           <div class="chat-details">
            <img src="images/user.jpg" alt="User-image" />
               <p></p>
            </div>
        </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypinAnimation, 600);

}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", themeButton.textContent);
    if (document.body.classList.contains("dark-theme")) {
        themeButton.textContent = "dark_mode";

    }
    else {
        themeButton.textContent = "light_mode";
    }
}
);

deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all chats?")) {
        localStorage.clear();
        chatContainer.innerHTML = "";
    }

});


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${intialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});
sendButton.addEventListener("click", handleOutgoingChat);

