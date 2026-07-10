import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import devLog from "../utils/devLogger";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatWindow } from "../components/chat/ChatWindow";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(API_URL, {
  transports: ["polling", "websocket"]
});

export const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const checkToken = () => {
    const tokenUser = localStorage.getItem("tokenUser");

    if (!tokenUser) {
      navigate("/user/login");
      return false;
    }

    return true;
  };

  const getChats = () => {
    if (!checkToken()) return;

    fetch(API_URL + "/api/chats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenUser")
      }
    })
      .then((res) => res.json())
      .then((data) => setChats(Array.isArray(data) ? data : []))
      .catch((error) => {
        devLog.error("Error cargando chats:", error);
        setChats([]);
      });
  };

  const getMessages = (chatId) => {
    if (!checkToken()) return;

    fetch(API_URL + `/api/chats/${chatId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenUser")
      }
    })
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((error) => {
        devLog.error("Error cargando mensajes:", error);
        setMessages([]);
      });
  };

  const handleSelectChat = (chat) => {
    if (selectedChatRef.current) {
      socket.emit("leave_chat", {
        chat_id: selectedChatRef.current.id
      });
    }

    setSelectedChat(chat);

    socket.emit("join_chat", {
      chat_id: chat.id
    });

    getMessages(chat.id);
  };

  const sendMessage = (messageText) => {
    if (!checkToken()) return;

    if (!selectedChat) {
      alert("Selecciona un chat primero");
      return;
    }

    fetch(API_URL + `/api/chats/${selectedChat.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenUser")
      },
      body: JSON.stringify({
        text: messageText
      })
    })
     .then((res) => {
        if (!res.ok) throw new Error("No se pudo enviar el mensaje");
        return res.json();
      })
      .then((data) => {
         const messageWithChatId = {
         ...data,
         chat_id: selectedChat.id
      };

      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg.id === messageWithChatId.id);
        if (exists) return prevMessages;
        return [...prevMessages, messageWithChatId];
      });

      socket.emit("send_message", {
        chat_id: selectedChat.id,
        message: messageWithChatId
      });

      getChats();
     })
      .catch((error) => {
        devLog.error("Error enviando mensaje:", error);
        alert("No se pudo enviar el mensaje");
      });
  };

  useEffect(() => {
    socket.on("new_message", (newMessage) => {
      const activeChat = selectedChatRef.current;

      if (!activeChat) {
        getChats();
        return;
      }

      if (newMessage.chat_id && String(newMessage.chat_id) !== String(activeChat.id)) {
        getChats();
        return;
      }

      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg.id === newMessage.id);
        if (exists) return prevMessages;
        return [...prevMessages, newMessage];
      });

      getChats();
    });

    return () => socket.off("new_message");
  }, []);

  useEffect(() => {
    if (!checkToken()) return;

    getChats();

    if (location.state?.chatId) {
      const chat = {
        id: location.state.chatId,
        promotor_id: location.state?.promotorId || null,
        promotor_name: location.state?.promotorName || null
      };

      setSelectedChat(chat);

      socket.emit("join_chat", {
        chat_id: chat.id
      });

      getMessages(chat.id);
    }
  }, []);

  return (
      <>
       <div className="container-fluid px-4 pt-4">
         <div className="d-flex justify-content-end">
           <Link
            to="/user/private"
            className="btn eh-back-profile-btn" >
            <i className="bi bi-arrow-left me-2"></i>
                 Volver al perfil
          </Link>
         </div>
       </div>
    
       <div className="container-fluid eh-chat-page py-4">
        <div className="row g-4 eh-chat-row">
          <div className="col-12 col-lg-4">
           <ChatSidebar
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            role="user"
           />
         </div>

         <div className="col-12 col-lg-8">
          <ChatWindow
            selectedChat={selectedChat}
            messages={messages}
            onSendMessage={sendMessage}
            role="user"
           />
         </div>
       </div>
     </div>
   </>
  );
};