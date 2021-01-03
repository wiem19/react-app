import React, { Component } from "react";
import { connect } from "react-redux";

import ChatBoxHeader from "../chat-box-header/chatBoxHeader.component";
import ChatMessagingArea from "../chat-messaging-area/chatMessagingArea.component";
import ChatTypingArea from "../chat-typing-area/chatTypingArea.component";
import ChatBoxIcon from "../chat-box-icon/chatBoxIcon.component";
import {
  userSet,
  userDisconnected,
  userConnected,
} from "../../store/current-user-slice/current-user";
import { messagesRead } from "../../store/messages-slice/messages";

import AppEntity from "../../services/web-rtc-service/appEntity.js";
import eventHub from "../../services/event-hub/eventHub";

import "./chatBox.styles.scss";

class ChatBox extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://twemoji.maxcdn.com/v/latest/twemoji.min.js";
    script.crossOrigin = "anonymous";
    script.async = true;
    document.body.appendChild(script);
 
  //problem in adding options in appEntity
    window.rtcService = new AppEntity('jitsi',{parentNode:document.querySelector(".app")});

    eventHub.on("userSet", ({ id }) => {
      this.props.connectUser();
      this.props.userSet({ id });
    });
    eventHub.on("closing", () => {
      this.props.disconnectUser();
    });
  }

  state = {
    isClosed: true,
  };

  handleToggle = () => {
    if (this.state.isClosed) this.props.messagesRead();
    this.setState({ isClosed: !this.state.isClosed });
  };

  render() {
    const { isClosed } = this.state;
    const { panelShown, gifPanelShown } = this.props;
    const chatBoxClasses = isClosed
      ? "chat-box chat-box-closing"
      : "chat-box chat-box-opening ";

    return (
      <>
        <div className={chatBoxClasses}>
          <ChatBoxHeader handleClosed={this.handleToggle} />
          <ChatMessagingArea panel={panelShown} gifPanel={gifPanelShown} />
          <ChatTypingArea panel={panelShown} />
        </div>

        <ChatBoxIcon
          isClosed={isClosed}
          picture="https://randomuser.me/api/portraits/men/99.jpg"
          handleClicked={this.handleToggle}
        />
      </>
    );
  }
}
const mapStateToProps = ({
  panel: { panelShown, gifPanelShown },
  // currentUser: { connected },
}) => ({
  panelShown,
  gifPanelShown,
});
const mapDispachToProps = (dispatch) => ({
  userSet: (user) => dispatch(userSet(user)),
  disconnectUser: (user) => dispatch(userDisconnected(user)),
  connectUser: (user) => dispatch(userConnected(user)),
  messagesRead: () => dispatch(messagesRead()),
});

export default connect(mapStateToProps, mapDispachToProps)(ChatBox);
