// Define addMessage first (or make sure it's loaded before sendMessage)
function addMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}


async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages'); // Moved to higher scope
   
    const message = userInput.value.trim();
    if (!message) return;

    // Visual feedback
    userInput.disabled = true;
    sendButton.disabled = true;
    addMessage('user', message);
    userInput.value = '';

    if (chatMessages) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message assistant typing';
        typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
    }

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    try {
        console.log("Sending message to API...");
        const response = await fetch('/api/assist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ message: message })
        });

        console.log("Received response:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data.error) throw new Error(data.error);
        if (!data.response) throw new Error('Empty response from server');

        addMessage('assistant', data.response);
    } catch (error) {
        console.error("Full error details:", error);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again later.');
    } finally {
        const indicator = document.querySelector('.typing');
        if (indicator) indicator.remove();
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}