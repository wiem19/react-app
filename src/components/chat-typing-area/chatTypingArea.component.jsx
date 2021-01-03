import React, { Component } from "react";
import { connect } from "react-redux";

import EmojiesGifsPanel from "../emojis-gifs-panel/empjisGifsPanel.component";

import { meessageAdded } from "../../store/messages-slice/messages";
import { panelToggled } from "../../store/panel-slice/panel";

import "./chatTypingArea.styles.scss";

class ChatTypingArea extends Component {
  state = {
    chatInput: "",
    message: "",
  };

  handleChange = (event) => {
    const { value } = event.target;
    this.setState({ chatInput: value });
  };

  handleSubmit = (event) => {
    const { chatInput } = this.state;
    const { id } = this.props;
    if (chatInput.trim() !== "") {
      if (event.key === "Enter") {
        window.rtcService.sendMessage(chatInput);
        this.props.sendMessage({
          id,
          message: chatInput,
          date: Date.now(),
          isCurrentUser: true,
        });

        this.setState({ chatInput: "" });
      }
    }
  };
  handleEmojiAdded = (symbol) => {
    this.setState({ chatInput: this.state.chatInput + " " + symbol });
  };

  handleUpload = ({ target }) => {
    const url = URL.createObjectURL(target.files[0]);
    const { id } = this.props;
    window.rtcService.sendMessage(url);
    this.props.sendMessage({
      docName: target.files[0].name,
      id,
      message: url,
      date: Date.now(),
    });
    target.value = "";
  };

  render() {
    const { chatInput } = this.state;
    const { panel, panelToggled } = this.props;

    return (
      <div className="chat-typing-area">
        {panel && <EmojiesGifsPanel handleEmojiAdded={this.handleEmojiAdded} />}
        <div className="chat-typing-area-footer">
          <textarea
            className="chat-typing-area-input"
            placeholder="Entrez votre message..."
            type="text"
            value={chatInput}
            onChange={this.handleChange}
            onKeyPress={this.handleSubmit}
          />

          <div className="chat-typing-area-buttons">
            <div onClick={panelToggled}>
              <i className="icon-smile"></i>
            </div>

            <input
              type="file"
              id="file-uploader"
              onChange={this.handleUpload}
              className="chat-typing-area-files"
            />
            {chatInput.trim().length ? (
              <div className="icon-send-background">
                <i
                  onClick={(event) =>
                    this.handleSubmit({ key: "Enter", ...event })
                  }
                  className="icon-send"
                ></i>
              </div>
            ) : (
              <label htmlFor="file-uploader">
                <i className="icon-attached"></i>
              </label>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ currentUser: { id, connected } }) => ({
  id,
  connected,
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (message) => dispatch(meessageAdded(message)),
  panelToggled: () => dispatch(panelToggled()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatTypingArea);
