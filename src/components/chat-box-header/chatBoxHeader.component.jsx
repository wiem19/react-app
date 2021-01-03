import React from "react";
import UserList from "../users-list/userList.component";

import "./chatBoxHeader.styles.scss";
const ChatBoxHeader = ({ handleClosed }) => {
  return (
    <div className="header">
      <div className="wrapper">
        <div className="header-title">Des question? Discutions !</div>
        <div className="header-subtitle">Réponse sous 59 minutes</div>
        <div className="header-user-list">
          <UserList />
        </div>
      </div>
      <div muta onClick={handleClosed} className="header-close-icon">
        <i className="icon-close header-icon-close "></i>
      </div>
    </div>
  );
};

export default ChatBoxHeader;
