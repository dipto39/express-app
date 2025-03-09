document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const chatBox = document.getElementById("chat-box");
    const copyBtn = document.getElementById("copy-btn");
    const shareBtn = document.getElementById("share-btn");
    const clearBtn = document.getElementById("clear-btn");
  
     
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  
    copyBtn.addEventListener("click", () => {
      const text = chatBox.innerText;
      if (text.trim() !== "") {
        navigator.clipboard.writeText(text).then(() => {
          alert("Chat copied to clipboard!");
        });
      }
    });
  
    shareBtn.addEventListener("click", () => {
      const text = chatBox.innerText;
      if (text.trim() !== "") {
        if (navigator.share) {
          navigator.share({ title: "Chat Conversation", text: text });
        } else {
          alert("Sharing not supported on this browser.");
        }
      }
    });
  
   
    clearBtn.addEventListener("click", () => {
      alert("Clearing the chats will remove all messages. Are you sure?");
      chatBox.innerHTML = "";
    });
  
    
    const sendMessage = async (message) => {
      try {
        const response = await fetch(`/chat?message=${encodeURIComponent(message)}`);
        const data = await response.json();
  
        if (data.reply) {
          const messageHtml = `
            <p><strong>You:</strong> ${message}</p>
            <p><strong>Chatbot:</strong> ${data.reply}</p>
            <div class="rating-container">
              <span class="rate-text">Rate this response:</span>
              <span class="star" data-value="1">1</span>
              <span class="star" data-value="2">2</span>
              <span class="star" data-value="3">3</span>
              <span class="star" data-value="4">4</span>
              <span class="star" data-value="5">5</span>
            </div>
          `;
  
          const messageElement = document.createElement("div");
          messageElement.innerHTML = messageHtml;
          chatBox.appendChild(messageElement);
  
          addRatingListeners(messageElement);
        } else {
          console.error("No reply from server.");
        }
      } catch (error) {
        console.error("Error communicating with the server:", error);
      }
    };
  
   
    document.getElementById("send-btn").addEventListener("click", () => {
      const userMessage = document.getElementById("user-input").value;
      if (userMessage) {
        sendMessage(userMessage);
        document.getElementById("user-input").value = ""; 
      }
    });
  
    function addRatingListeners(container) {
      const stars = container.querySelectorAll(".star");
      stars.forEach((star) => {
        star.addEventListener("click", function () {
          const rating = this.getAttribute("data-value");
          alert(`You rated this response ${rating} stars!`);
          console.log(`User rating: ${rating}`);
        });
      });
    }
  });
  
  
   