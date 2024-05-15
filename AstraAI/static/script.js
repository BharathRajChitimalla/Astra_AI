document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input button");

    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);

// Create logo
    const logoImg = document.createElement("img");
    if (isOutgoing) {
        logoImg.src = "{{ url_for('static', filename='person.png') }}";
        logoImg.alt = "Outgoing Logo";
        logoImg.classList.add("logo", "outgoing-logo");
        logoImg.width = 2; // Set the width to 50px
        logoImg.height = 2;
        // Set the height to 50px
    } else {
        logoImg.src = "{{ url_for('static', filename='Ailogo3.png') }}";
        logoImg.alt = "Incoming Logo";
        logoImg.classList.add("logo", "incoming-logo");
        logoImg.width = 2; // Set the width to 30px
        logoImg.height = 2;
        logoImg.style.backgroundColor = "#fff" // Set the height to 30px
    }
    chatLi.appendChild(logoImg);

        // Create message container
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        // Create message content
        const messageContent = document.createElement("p");
        messageContent.textContent = message;

            // Add "you:" text for outgoing messages
    if (isOutgoing) {
        const youText = document.createElement("span");
        youText.textContent = " "+" " + "You: ";
        youText.classList.add("you-text");
        messageContainer.appendChild(youText);
    }
    else{
        const youText = document.createElement("span");
        youText.textContent = " Aruvi: ";
        youText.classList.add("you-text");
        messageContainer.appendChild(youText);
    }

        // Create timestamp
        const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const timestampSpan = document.createElement("span");
        timestampSpan.classList.add("timestamp");
        timestampSpan.textContent = timestamp;

        // Append message content and timestamp to message container
        messageContainer.appendMessage(messageContent);
        messageContainer.appendMessage(timestampSpan);

        chatLi.appendMessage(messageContainer);

        return chatLi;
    };

    const appendMessage = (sender, message, className) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        // Get current timestamp
        const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        let imageSrc;
        let altText;
		if (sender === 'Aruvi' && message.includes('loading4.gif')) {
            messageElement.innerHTML = `<img src="https://ai-test.astralinx.com/static/astra.png"  width="25px" height="25px" style="vertical-align:middle" >&nbsp;&nbsp;<strong style="vertical-align:middle">${sender}<br></strong><div style="padding-left: 36px;padding-bottom:8px;padding-top:8px;">${message}</div>`;
		}
         else if (sender ==='Aruvi') {
            const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            messageElement.innerHTML = `<img src="https://ai-test.astralinx.com/static/astra.png"  width="25px" height="25px" style="vertical-align:middle" >&nbsp;&nbsp;<strong style="vertical-align:middle">${sender}<br></strong><div style="padding-left: 36px;padding-bottom:8px;padding-top:8px;">${message}</div><div style="padding-left: 30px; padding-bottom:8px; padding-top:8px; text-align: right; font-size: 12px; important!">${timestamp}</div><br>`;        
		}
		
          else {
            const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            messageElement.innerHTML = `<img src="https://ai-test.astralinx.com/static/person.png"  width="25px" height="25px" style="vertical-align:middle" >&nbsp;&nbsp;<strong style="vertical-align:middle">${sender}<br></strong><div style="padding-left: 36px;padding-bottom:8px;padding-top:8px;">${message}</div><div style="padding-left: 30px; padding-bottom:8px; padding-top:8px; text-align: right; font-size: 12px; important!">${timestamp}</div><br>`;    
		}
  
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    };



    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

//        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
//        chatbox.scrollTo(0, chatbox.scrollHeight);

          appendMessage('You', userMessage,"Outgoing");
        appendMessage('Aruvi', '<img src="https://ai-test.astralinx.com/static/loading8.gif" alt="Loading..."  style="padding-left:4px;width:40px" >', "Incoming");
 
        // Send POST request to Python backend
        fetch('https://ai-test.astralinx.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
            .then(response => response.json())
            .then(data => {
                const botResponse = data.response;
                // Remove the loading GIF and display the Astra AI message
                chatbox.removeChild(chatbox.lastChild); // Remove the last child (which is the loading GIF)
                appendMessage('Aruvi', botResponse, "Incoming");
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };


    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
});
