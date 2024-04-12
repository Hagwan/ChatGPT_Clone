const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector('.chat-container');

let userText = null;
const OPENAI_API_KEY = "No longer available. Get your own API key from OpenAI.HEHE";
const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}



const getChatResponse = async () => {
    const url = "https://api.openai.com/v1/chat/completions";

    const requestoptions = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: userText,
                }
            ],
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    };



    try {
        const response = await (await fetch(url, requestoptions)).json();
        console.log(response);
    } catch (error) {
        console.log(error);

    }

};


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
                <span class="material-symbols-rounded">content_copy</span>
              </div>`
    const outgoingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(outgoingChatDiv);
    getChatResponse();
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    const html = `<div class="chat-content">
           <div class="chat-details">
            <img src="images/user.jpg" alt="User-image" />
               <p>${userText}</p>
            </div>
        </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);

    setTimeout(showTypinAnimation, 600);

}
sendButton.addEventListener("click", handleOutgoingChat);
