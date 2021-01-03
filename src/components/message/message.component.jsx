import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import "./message.styles.scss";
import Icon from "../icon/icon.component";
import Gif from "../gif/gif.component";
import CustomButton from "../custom-button/customButton.component";
import twemoji from "twemoji";
import parse from "html-react-parser";
import "moment/locale/fr";
moment.locale("fr");
const diffCalculator = (date) => {
  return moment(date).from(moment(Date.now()));
};

class Message extends Component {
  render() {
    const { message, id, date, docName } = this.props.messageData;
    const { currentUserId, confirenceUsers, showIcon } = this.props;
    const isCurrentUser = id === currentUserId;
    const user = confirenceUsers.find((user) => user.id === id);
    console.log(user, "messageid");
    const messageStyles = isCurrentUser ? { flexDirection: "row-reverse" } : {};

    const gifURLPattern = new RegExp("^https://.*.gif$", "g");
    const docURLPattern = new RegExp("^blob:https://51.15.21.42:8199.*", "g");
    return (
      <>
        {moment(date).diff(this.props.previousMessageDate, "hours") >= 2 ||
        this.props.previousMessageDate === date ? (
          <div className="message-messages-date">
            {moment(date).format("MMMM Do HH:mm")}
          </div>
        ) : null}

        <div className="message" style={messageStyles}>
          <div className="message-content">
            <div className="message-time-tag">{diffCalculator(date)}</div>
            <div className="message-wrapper">
              {!isCurrentUser && showIcon && (
                <div className="message-user-icon">
                  <Icon
                    picture={user.avatarURL || ""}
                    width={32}
                    height={32}
                    title={user.displayName}
                  />
                </div>
              )}
              <div style={!showIcon ? { marginLeft: "42px" } : {}}>
                {message.search(docURLPattern) !== 0 &&
                message.search(gifURLPattern) !== 0 ? (
                  <>
                    <div className="message-limits" style={messageStyles}>
                      <div className="message-content-text">
                        {" "}
                        {parse(twemoji.parse(message))}
                      </div>
                    </div>
                  </>
                ) : message.search(gifURLPattern) === 0 ? (
                  <Gif
                    gifUrl={message}
                    key={date}
                    width="120px"
                    height="100px"
                  />
                ) : (
                  <div className="message-content-document">
                    <div className="message-content-document-name">
                      {docName ? docName : "docName"}
                    </div>
                    <a
                      href={message}
                      class="message-content-document-download"
                      download
                    >
                      <CustomButton
                        content={"Download file "}
                        bgColor="#7d7d7d"
                        color="white"
                        width="120px"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({
  panel: { supportedEmojis },
  currentUser: { id },
  connectedUsers: { confirenceUsers },
}) => ({
  supportedEmojis,
  currentUserId: id,
  confirenceUsers,
});

export default connect(mapStateToProps, null)(Message);
