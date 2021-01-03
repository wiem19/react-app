import React, { Component } from "react";
import Icon from "../icon/icon.component";
import { connect } from "react-redux";

import CustomButton from "../custom-button/customButton.component";
import ScrollableDiv from "../scrollable-area/scrollableArea.component";
import Disconnected from "../disconnected/disconnected.component";
import Message from "../message/message.component";
import eventHub from "../../services/event-hub/eventHub";
import { meessageAdded } from "../../store/messages-slice/messages";

import "./chatMessagingArea.styles.scss";

const mapHeightToElement = (panel, gifPanelShown) => {
  return panel ? (gifPanelShown ? "290px" : "350px") : "523px";
};
class ChatMessagingArea extends Component {
  state = {};

  componentDidMount() {
    eventHub.on("messageReceived", ({ id, message }) => {
      console.log(id, message);
      this.props.addMessage({
        id,
        message,
        date: Date.now(),
      });
    });
  }
  render() {
    const {
      messagesList,
      panel,
      gifPanelShown,
      networkConnection,
      connected,
    } = this.props;
    return (
      <div
        className="messages-area"
        style={{ height: mapHeightToElement(panel, gifPanelShown) }}
      >
        <div className="disconnected-alert">
          {!networkConnection ? (
            <Disconnected title={""} subtitle={""} />
          ) : !connected ? (
            <Disconnected title={""} subtitle={""} />
          ) : null}
        </div>
        <ScrollableDiv height={mapHeightToElement(panel, gifPanelShown)}>
          <div className="messages-area-default">
            <Icon backgroundColor="#75b435" width={32} height={32} />
            <div className="messages-search-healper-area">
              <div className="messages-search-healper-area-indicator">
                Bonjour ! Comment puis-je vous aider ?
              </div>
              <CustomButton
                content={"Recherchez sure notre aide"}
                iconName="icon-search"
              />
            </div>
          </div>

          {messagesList.map((message, index) => {
            const showIcon =
              index + 1 === messagesList.length ||
              messagesList[index + 1].id !== message.id;

            return (
              <Message
                key={message.date}
                messageData={message}
                showIcon={showIcon}
                previousMessageDate={
                  messagesList[index !== 0 ? index - 1 : 0].date
                }
              />
            );
          })}
        </ScrollableDiv>
      </div>
    );
  }
}

const mapStateToProps = ({
  messages: { messagesList },
  panel: { gifPanelShown },
  currentUser: { networkConnection, connected, id },
}) => ({
  messagesList,
  gifPanelShown,
  networkConnection,
  connected,
});
const mapDispatchToProps = (dispatch) => ({
  addMessage: (message) => dispatch(meessageAdded(message)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatMessagingArea);
