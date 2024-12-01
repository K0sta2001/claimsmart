import React, { useEffect, useState, useRef } from "react";
import "../../../assets/styles/components/chat.css";
import Message from "./message";
import FileUpload from "../../../components/reusable/fileupload";

export default function Chat({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [file, setFile] = useState(null);
  const chatContentRef = useRef(null);

  const greetingMessage = `Hello, I'm your personal AI assistant to help you validate your loss. You can send me a message and upload a file which will prove your loss and I will analyze the following. What can I help you with today, ${user?.fullName}?`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleFileUpload = (selectedFile) => {
    setFile(selectedFile);
    console.log("File selected:", selectedFile);
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() || file) {
      const newMessage = (
        <Message key={Date.now()} prompt={messageInput} isFromClient={true} />
      );
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
      setIsLoading(true);

      const backendUri = import.meta.env.VITE_BACKEND_URI;
      const apiKey = import.meta.env.VITE_API_KEY;
      const token = user.token;

      const formData = new FormData();
      formData.append("message", messageInput);
      formData.append("userId", user?.userId);

      if (file) {
        formData.append("file", file);
      }

      try {
        const response = await fetch(`${backendUri}api/chat`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to send message to backend.");
        }

        const data = await response.json();

        const assistantMessage = (
          <Message
            key={Date.now() + 1}
            prompt={data?.assistantMessage || "No response from assistant"}
            isFromClient={false}
          />
        );

        setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);

        if (data?.assistantMessage?.includes("will be compensated")) {
          const storedUser = JSON.parse(localStorage.getItem("user"));

          if (storedUser) {
            storedUser.credits += 50; 
            localStorage.setItem("user", JSON.stringify(storedUser)); 
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      id="chat"
      className="column items-center relative z-high"
      style={{ boxSizing: "border-box" }}
    >
      <img
        style={{ width: "100px" }}
        src="assets/images/claimsmartai.png"
        alt="CLAIMSMART AI"
      />
      <div id="chat-box" className="column relative">
        <div id="chat-content" ref={chatContentRef}>
          {isLoading ? (
            <img
              src="/assets/images/spinner.png"
              alt="Loading..."
              className="spinner"
            />
          ) : (
            <>
              <div id="message">{greetingMessage}</div>
              {chatMessages.map((chatMessage) => chatMessage)}
            </>
          )}
        </div>

        <textarea
          type="text"
          className="absolute"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        ></textarea>
      </div>
      <div className="row space-between gap-small" id="send-btn-container">
        <FileUpload
          topMargin="0"
          buttonText="File"
          divWidth="100px"
          key="fileUpload"
          name="profilePhoto"
          onFileChange={handleFileUpload}
        />
        <button className="medium boldlvl4 pointer" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
