// src/components/Chatbot.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip, Button, Box, useTheme } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const Chatbot = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, isUser: true }];
      setMessages(newMessages);
      handleResponse(input.trim().toLowerCase());
      setInput("");
    }
  };

  const handleResponse = (message) => {
    let response = "";
    switch (message) {
      case "go to dashboard":
        response = "Navigating to the Dashboard...";
        navigate("/");
        break;
      case "go to expenses":
        response = "Navigating to the Expenses...";
        navigate("/expenses");
        break;
      case "go to goals":
        response = "Navigating to the Goals...";
        navigate("/goals");
        break;
      case "go to budgets":
        response = "Navigating to the Budgets...";
        navigate("/budgets");
        break;
      case "go to profile":
        response = "Navigating to the Profile...";
        navigate("/profile");
        break;
      case "go to resources":
        response = "Navigating to the Resources...";
        navigate("/resources");
        break;
      default:
        response = "I'm here to help! Try selecting a command button below.";
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, isUser: false },
    ]);
  };

  const handleCommandClick = (command) => {
    const newMessages = [...messages, { text: command, isUser: true }];
    setMessages(newMessages);
    handleResponse(command.toLowerCase());
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      {!isOpen ? (
        <Tooltip title="Chat with us" arrow>
          <IconButton
            onClick={toggleChatbot}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: isLightMode
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
              color: "white",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              transition: "transform 0.3s",
            }}
          >
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "320px",
            backgroundColor: isLightMode ? "white" : "#333",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s",
          }}
        >
          <div
            style={{
              backgroundColor: isLightMode
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
              color: "white",
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
              position: "relative",
            }}
          >
            Chatbot Assistant
            <IconButton
              onClick={toggleChatbot}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                color: "white",
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div
            style={{
              padding: "10px",
              maxHeight: "250px",
              overflowY: "auto",
              flex: "1",
              backgroundColor: isLightMode ? "#f9f9f9" : "#2e2e2e",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{ textAlign: msg.isUser ? "right" : "left" }}
              >
                <p
                  style={{
                    padding: "8px",
                    margin: "5px 0",
                    backgroundColor: msg.isUser
                      ? isLightMode
                        ? theme.palette.primary.main
                        : theme.palette.primary.dark
                      : isLightMode
                      ? "#f1f0f0"
                      : "#444",
                    borderRadius: "15px",
                    display: "inline-block",
                    color: msg.isUser ? "white" : isLightMode ? "#333" : "#eee",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            {[
              "Dashboard",
              "Expenses",
              "Goals",
              "Budgets",
              "Profile",
              "Resources",
            ].map((label) => (
              <Button
                key={label}
                variant="contained"
                onClick={() => handleCommandClick(`Go to ${label}`)}
                sx={{
                  backgroundColor: isLightMode
                    ? theme.palette.primary.main
                    : theme.palette.primary.dark,
                  color: "white",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderTop: isLightMode ? "1px solid #ddd" : "1px solid #444",
              backgroundColor: isLightMode ? "#fff" : "#333",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a command..."
              style={{
                flex: "1",
                padding: "10px",
                borderRadius: "20px",
                border: isLightMode ? "1px solid #ddd" : "1px solid #444",
                outline: "none",
                backgroundColor: isLightMode ? "#fff" : "#444",
                color: isLightMode ? "#000" : "#ddd",
                marginRight: "10px",
              }}
            />
            <IconButton
              onClick={handleSend}
              style={{
                color: isLightMode
                  ? theme.palette.primary.main
                  : theme.palette.primary.dark,
              }}
            >
              <SendIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
