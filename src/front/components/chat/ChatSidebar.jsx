import React from "react";

export const ChatSidebar = ({ chats, selectedChat, onSelectChat, role = "user" }) => {
  return (
    <div className="card eh-chat-card border-0 h-100">
      <div className="card-body">
        <div className="mb-4">
          <small className="eh-chat-label">
            {role === "promotor" ? "Promotor" : "Usuario"}
          </small>
          <h3 className="fw-bold text-white mb-0">
            {role === "promotor" ? "Chats de usuarios" : "Mis chats"}
          </h3>
        </div>

        {chats.length === 0 && (
          <div className="alert eh-chat-empty mb-0">
            No hay chats cargados.
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={`btn text-start eh-chat-user ${
                selectedChat?.id === chat.id ? "active" : ""
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="eh-chat-avatar">
                  {role === "promotor" ? "U" : "P"}
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between gap-2">
                    <h6 className="fw-bold text-white mb-1 text-truncate">
                      {role === "promotor"
                        ? chat.user_name || `Usuario #${chat.user_id}`
                        : chat.promotor_name || `Promotor #${chat.promotor_id}`}
                    </h6>

                    <small className="text-white-50">#{chat.id}</small>
                  </div>

                  <p className="mb-0 small text-white-50 text-truncate">
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
    </div>
  );
};