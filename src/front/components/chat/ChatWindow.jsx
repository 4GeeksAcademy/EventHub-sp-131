import React, { useEffect, useRef, useState } from "react";

export const ChatWindow = ({ selectedChat, messages, onSendMessage, role = "user" }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const isMine = (message) => {
    if (role === "promotor") return message.sender_type === "promotor";
    return message.sender_type === "user";
  };

  const getSelectedName = () => {
    if (!selectedChat) return "";

    if (role === "promotor") {
      return selectedChat.user_name || `Usuario #${selectedChat.user_id || ""}`;
    }

    return selectedChat.promotor_name || `Promotor #${selectedChat.promotor_id || ""}`;
  };

  const handleSubmit = () => {
    if (text.trim() === "") return;

    onSendMessage(text);
    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="card eh-chat-card border-0 h-100">
        <div className="card-body d-flex align-items-center justify-content-center text-center">
          <div>
            <i className="bi bi-chat-heart eh-chat-placeholder-icon"></i>
            <h3 className="fw-bold text-white">Selecciona un chat</h3>
            <p className="text-white-50 mb-0">
              Elige una conversación para ver y enviar mensajes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card eh-chat-card border-0 h-100">
      <div className="card-header eh-chat-header border-0">
        <div className="d-flex align-items-center gap-3">
          <div className="eh-chat-avatar">
            {role === "promotor" ? "U" : "P"}
          </div>

          <div>
            <h4 className="fw-bold text-white mb-1">{getSelectedName()}</h4>
            <small className="text-white-50">Conversación activa</small>
          </div>
        </div>
      </div>

      <div className="card-body eh-chat-messages">
        {messages.length === 0 && (
          <div className="alert eh-chat-empty">
            No hay mensajes todavía.
          </div>
        )}

        {messages.map((message) => {
          const mine = isMine(message);

          return (
            <div
              key={message.id}
              className={`d-flex mb-3 ${
                mine ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div className={`eh-message-bubble ${mine ? "mine" : "theirs"}`}>
                <div className="d-flex justify-content-between gap-3 mb-2">
                  <strong>
                    {mine ? "Tú" : role === "promotor" ? "Usuario" : "Promotor"}
                  </strong>

                  <small>
                    {message.created_at
                      ? new Date(message.created_at).toLocaleTimeString()
                      : ""}
                  </small>
                </div>

                <p className="mb-0">{message.text}</p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="card-footer eh-chat-footer border-0">
        <div className="row g-2 align-items-end">
          <div className="col">
            <textarea
              className="form-control eh-chat-input"
              rows="2"
              placeholder={role === "promotor" ? "Responder mensaje..." : "Escribe tu mensaje..."}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <div className="col-auto">
            <button className="btn eh-chat-send-btn" onClick={handleSubmit}>
              <i className="bi bi-send me-2"></i>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};