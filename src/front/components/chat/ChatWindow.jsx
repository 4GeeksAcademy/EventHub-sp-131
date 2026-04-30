import React, { useState } from "react";

export const ChatWindow = ({ selectedChat, messages, onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim() === "") return;

    onSendMessage(text);
    setText("");
  };

  if (!selectedChat) {
    return (
      <div className="chat-content empty-chat d-flex justify-content-center align-items-center">
        <h5 className="text-white">Selecciona un chat</h5>
      </div>
    );
  }

  return (
    <div className="chat-content">
      <div className="chat-header mb-4">
        <h5 className="text-white mb-0">
          Chat #{selectedChat.id}
        </h5>
        <small className="text-light">
          User {selectedChat.user_id} hablando con Promotor {selectedChat.promotor_id}
        </small>
      </div>

      <div className="messages-box">
        {messages.length === 0 && (
          <p className="text-white">No hay mensajes todavía.</p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row d-flex mb-3 ${
              message.sender_type === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div className="message-card">
              <div className="message-header d-flex justify-content-between">
                <strong>
                  {message.sender_type === "user" ? "Usuario" : "Promotor"}
                </strong>
                <small>{message.created_at}</small>
              </div>

              <div className="message-body">
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="message-input mt-4">
        <textarea
          className="form-control"
          rows="4"
          placeholder="Escribe un mensaje"
          value={text}
          onChange={(event) => setText(event.target.value)}
        ></textarea>

        <button className="btn send-btn mt-3" onClick={handleSubmit}>
          SEND
        </button>
      </div>
    </div>
  );
};