import React, { Component } from "react";
import { connect } from "react-redux";

import "./emojiPanel.styles.scss";
class EmojisPanel extends Component {
  render() {
    const { handleEmojiAdded, supportedEmojis } = this.props;
    return (
      <div className="emojis-panel">
        {supportedEmojis.map((icon) => (
          <span
            className={icon.class + " emojis-panel-emoji"}
            onClick={() => handleEmojiAdded(icon.symbole)}
            key={icon.class}
          >
            {icon.path.map((path) => (
              <span key={path} className={"path" + path}></span>
            ))}
          </span>
        ))}
      </div>
    );
  }
}

const mapStateToProps = ({ panel: { supportedEmojis } }) => ({
  supportedEmojis,
});

export default connect(mapStateToProps, null)(EmojisPanel);
