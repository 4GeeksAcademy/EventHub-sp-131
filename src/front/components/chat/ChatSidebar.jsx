import React from "react";

export const ChatSidebar = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <div className="chat-sidebar p-3">
      {chats.length === 0 && (
        <p className="text-white mb-0">No hay chats cargados.</p>
      )}

      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-user d-flex align-items-center gap-3 p-3 ${
            selectedChat?.id === chat.id ? "active" : ""
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-avatar">
            {chat.promotor_id}
          </div>

          <div className="flex-grow-1">
            <h6 className="mb-1 chat-name">
              Chat #{chat.id}
            </h6>

            <p className="mb-0 chat-preview">
              User ID: {chat.user_id} | Promotor ID: {chat.promotor_id}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};