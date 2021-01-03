import React from "react";
import Icon from "../icon/icon.component";
import { connect } from "react-redux";
import "./chatBoxIcon.styles.scss";
const ChatBoxIcon = ({ isClosed, picture, handleClicked, unreadMessages }) => {
  return (
    <>
      <div className="icon-wrapper icon-animation" onClick={handleClicked}>
        {isClosed && (
          <>
            {unreadMessages ? (
              <div className="icon-unread-message">{unreadMessages}</div>
            ) : null}
            <Icon className="" picture={picture} />
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ messages: { unreadMessages } }) => ({
  unreadMessages,
});

export default connect(mapStateToProps, null)(ChatBoxIcon);
