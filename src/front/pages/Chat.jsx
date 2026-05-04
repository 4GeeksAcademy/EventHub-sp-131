import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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
    const [text, setText] = useState("");

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        fetch(API_URL + `/api/chats/${chatId}/messages`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("tokenUser")
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.log("Error cargando mensajes:", error);
                setMessages([]);
            });
    };

    const handleSelectChat = (chat) => {
        if (selectedChat) {
            socket.emit("leave_chat", {
                chat_id: selectedChat.id
            });
        }
    

        setSelectedChat(chat);

        socket.emit("join_chat", {
            chat_id: chat.id
        });

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

        fetch(API_URL + `/api/chats/${selectedChat.id}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("tokenUser")
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
        socket.on("new_message", (newMessage) => {
            setMessages((prevMessages) => {
                const exists = prevMessages.some((msg) => msg.id === newMessage.id);

                if (exists) return prevMessages;

                return [...prevMessages, newMessage];
            });
        });

        return () => {
            socket.off("new_message");
        };
    }, []);

    useEffect(() => {
        if (!checkToken()) return;

        getChats();

        if (location.state?.chatId) {
            const chatId = location.state.chatId;

            socket.emit("join_chat", {
                chat_id: chatId
            });

            setSelectedChat({
             id: chatId,
             promotor_id: location.state?.promotorId || null,
             promotor_name: location.state?.promotorName || null
            });

            getMessages(chatId);
        }
    }, []);

    return (
        <div className="container-fluid bg-dark text-white min-vh-100 py-4">
            <div className="row g-4">

                <div className="col-12 col-md-4">
                    <h4 className="mb-3">Member</h4>

                    <div className="card bg-secondary border-0 p-3">
                        {chats.length === 0 && (
                            <div className="alert alert-light mb-0">
                                No hay chats todavía.
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
                                        className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold text-white"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            minWidth: "70px"
                                        }}
                                    >
                                        P
                                    </div>

                                    <div className="text-start flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="mb-1 text-primary fw-bold">
                                                {chat.promotor_name || `Promotor #${chat.promotor_id}`}
                                            </h6>

                                            <small className="text-light">
                                                Just now
                                            </small>
                                        </div>

                                        <p className="mb-0 small text-truncate">
                                              {chat.last_message ? chat.last_message.text : `Chat #${chat.id}`}
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
                                            msg.sender_type === "user"
                                                ? "justify-content-end"
                                                : "justify-content-start"
                                        }`}
                                    >
                                        {msg.sender_type !== "user" && (
                                            <div
                                                className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold text-white me-3"
                                                style={{
                                                    width: "65px",
                                                    height: "65px",
                                                    minWidth: "65px"
                                                }}
                                            >
                                                P
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
                                                    {msg.sender_type === "user"
                                                        ? "Usuario"
                                                        : "Promotor"}
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

                                        {msg.sender_type === "user" && (
                                            <div
                                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold text-white ms-3"
                                                style={{
                                                    width: "65px",
                                                    height: "65px",
                                                    minWidth: "65px"
                                                }}
                                            >
                                                U
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div ref={messagesEndRef} />
                            </div>

                            <textarea
                                className="form-control bg-dark text-white border-light"
                                rows="4"
                                placeholder="Message"
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