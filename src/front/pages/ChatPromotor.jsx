import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatWindow } from "../components/chat/ChatWindow";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(API_URL, {
  transports: ["websocket", "polling"],
});

export const ChatPromotor = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const checkToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/promotor/login");
      return false;
    }

    return true;
  };

  const getChats = () => {
    if (!checkToken()) return;

    fetch(`${API_URL}/api/promotor/chats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los chats");
        return res.json();
      })
      .then((data) => setChats(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.log("Error cargando chats:", error);
        setChats([]);
      });
  };

  const getMessages = (chatId) => {
    if (!checkToken()) return;

    fetch(`${API_URL}/api/promotor/chats/${chatId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los mensajes");
        return res.json();
      })
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.log("Error cargando mensajes:", error);
        setMessages([]);
      });
  };

  const handleSelectChat = (chat) => {
    if (selectedChatRef.current) {
      socket.emit("leave_chat", {
        chat_id: selectedChatRef.current.id,
      });
    }

    setSelectedChat(chat);

    socket.emit("join_chat", {
      chat_id: chat.id,
    });

    getMessages(chat.id);
  };

  const sendMessage = (messageText) => {
    if (!checkToken()) return;

    if (!selectedChat) {
      alert("Selecciona un chat primero");
      return;
    }

    fetch(`${API_URL}/api/promotor/chats/${selectedChat.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        text: messageText,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo enviar el mensaje");
        return res.json();
      })
      .then((data) => {
         const messageWithChatId = {
          ...data,
      chat_id: selectedChat.id,
      };

      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg.id === messageWithChatId.id);
        if (exists) return prevMessages;
        return [...prevMessages, messageWithChatId];
      });

      socket.emit("send_message", {
        chat_id: selectedChat.id,
        message: messageWithChatId,
      });

      getChats();
    })
      .catch((error) => {
        console.log("Error enviando mensaje:", error);
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
    getChats();
  }, []);

  return (
    <>
     <div className="container-fluid px-4 pt-4">
        <div className="d-flex justify-content-end">
           <Link
             to="/promotor/private"
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
            role="promotor"
          />
        </div>

        <div className="col-12 col-lg-8">
          <ChatWindow
            selectedChat={selectedChat}
            messages={messages}
            onSendMessage={sendMessage}
            role="promotor"
          />
        </div>
       </div>
     </div>
   </>
  );
};