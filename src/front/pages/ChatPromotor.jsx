import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const ChatPromotor = () => {
    const navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("No se pudieron cargar los chats");
                }
                return res.json();
            })
            .then((data) => {
                setChats(Array.isArray(data) ? data : []);
            })
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
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("No se pudieron cargar los mensajes");
                }
                return res.json();
            })
            .then((data) => {
                setMessages(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.log("Error cargando mensajes:", error);
                setMessages([]);
            });
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        getMessages(chat.id);
    };

    const sendMessage = () => {
        if (!checkToken()) return;

        if (!selectedChat) {
            alert("Selecciona un chat primero");
            return;
        }

        if (text.trim() === "") {
            alert("Escribe un mensaje");
            return;
        }

        fetch(`${API_URL}/api/promotor/chats/${selectedChat.id}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                text: text
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("No se pudo enviar el mensaje");
                }
                return res.json();
            })
            .then((data) => {
                setText("");

                setMessages((prevMessages) => {
                    const exists = prevMessages.some((msg) => msg.id === data.id);
                    if (exists) return prevMessages;
                    return [...prevMessages, data];
                });

                getMessages(selectedChat.id);
            })
            .catch((error) => {
                console.log("Error enviando mensaje:", error);
                alert("No se pudo enviar el mensaje");
            });
    };

    useEffect(() => {
        getChats();
    }, []);

    useEffect(() => {
        if (!selectedChat) return;

        const interval = setInterval(() => {
            getMessages(selectedChat.id);
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedChat]);

    return (
        <div className="container-fluid bg-dark text-white min-vh-100 py-4">
            <div className="row g-4">

                <div className="col-12 col-md-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">Chats de usuarios</h4>

                        <button
                            className="btn btn-info text-white btn-sm"
                            onClick={getChats}
                        >
                            Cargar
                        </button>
                    </div>

                    <div className="card bg-secondary border-0 p-3">
                        {chats.length === 0 && (
                            <div className="alert alert-light mb-0">
                                No tienes chats todavía.
                            </div>
                        )}

                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                className={`list-group-item list-group-item-action bg-secondary text-white border-0 border-bottom py-3 ${
                                    selectedChat?.id === chat.id ? "bg-dark" : ""
                                }`}
                                onClick={() => handleSelectChat(chat)}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold text-white"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            minWidth: "70px"
                                        }}
                                    >
                                        U
                                    </div>

                                    <div className="text-start flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="mb-1 text-info fw-bold">
                                                {chat.user_name || `Usuario #${chat.user_id}`}
                                            </h6>

                                            <small className="text-light">
                                                Chat #{chat.id}
                                            </small>
                                        </div>

                                        <p className="mb-0 small text-truncate">
                                            {chat.last_message
                                                ? chat.last_message.text
                                                : "Sin mensajes todavía"}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-12 col-md-8">
                    {!selectedChat ? (
                        <div className="card bg-secondary border-0 text-white h-100">
                            <div className="card-body d-flex align-items-center justify-content-center">
                                <h5>Selecciona un chat</h5>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div
                                className="mb-3"
                                style={{
                                    height: "500px",
                                    overflowY: "auto"
                                }}
                            >
                                {messages.length === 0 && (
                                    <div className="alert alert-secondary">
                                        No hay mensajes todavía.
                                    </div>
                                )}

                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`d-flex mb-4 ${
                                            msg.sender_type === "promotor"
                                                ? "justify-content-end"
                                                : "justify-content-start"
                                        }`}
                                    >
                                        {msg.sender_type !== "promotor" && (
                                            <div
                                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold text-white me-3"
                                                style={{
                                                    width: "65px",
                                                    height: "65px",
                                                    minWidth: "65px"
                                                }}
                                            >
                                                U
                                            </div>
                                        )}

                                        <div
                                            className="card bg-secondary text-white border-0"
                                            style={{
                                                width: "75%",
                                                maxWidth: "650px"
                                            }}
                                        >
                                            <div className="card-header bg-secondary text-white border-bottom d-flex justify-content-between">
                                                <strong>
                                                    {msg.sender_type === "promotor"
                                                        ? "Promotor"
                                                        : "Usuario"}
                                                </strong>

                                                <small>
                                                    {new Date(msg.created_at).toLocaleTimeString()}
                                                </small>
                                            </div>

                                            <div className="card-body">
                                                <p className="mb-0">
                                                    {msg.text}
                                                </p>
                                            </div>
                                        </div>

                                        {msg.sender_type === "promotor" && (
                                            <div
                                                className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold text-white ms-3"
                                                style={{
                                                    width: "65px",
                                                    height: "65px",
                                                    minWidth: "65px"
                                                }}
                                            >
                                                P
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div ref={messagesEndRef} />
                            </div>

                            <textarea
                                className="form-control bg-dark text-white border-light"
                                rows="4"
                                placeholder="Responder mensaje..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-info text-white rounded-pill px-5 mt-3 fw-bold"
                                    onClick={sendMessage}
                                >
                                    SEND
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};