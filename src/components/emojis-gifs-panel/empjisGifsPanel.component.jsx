import React, { Component } from "react";
import { connect } from "react-redux";
import "./empjisGifsPanel.styles.scss";
import GifsPanel from "../gifs-panel/gifsPanel.component";
import EmojisPanel from "../emojis-panel/emojisPanel.component";
import { smileysPanelShow, gifsPanelShow } from "../../store/panel-slice/panel";
class EmojiesGifsPanel extends Component {
  mapClassToElement = (selected) =>
    selected ? "emojis-gifs-panel-btn" : "emojis-gifs-panel-btn-active";

  render() {
    const {
      smileysPanelShow,
      gifsPanelShow,
      gifPanelShown,
      handleEmojiAdded,
    } = this.props;
    return (
      <div className="emojis-gifs-panel">
        <div className="emojis-gifs-panel-btn-group">
          <input
            type="button"
            value="smileys"
            onClick={smileysPanelShow}
            className={this.mapClassToElement(!gifPanelShown)}
          />
          <input
            type="button"
            className={this.mapClassToElement(gifPanelShown)}
            onClick={gifsPanelShow}
            value="gifs"
          />
        </div>
        {gifPanelShown && <GifsPanel />}
        {!gifPanelShown && <EmojisPanel handleEmojiAdded={handleEmojiAdded} />}
      </div>
    );
  }
}

const mapDispachToProps = (dispatch) => ({
  gifsPanelShow: () => dispatch(gifsPanelShow()),
  smileysPanelShow: () => dispatch(smileysPanelShow()),
});
const mapStateToProps = ({ panel: { panelShown, gifPanelShown } }) => ({
  panelShown,
  gifPanelShown,
});

export default connect(mapStateToProps, mapDispachToProps)(EmojiesGifsPanel);
