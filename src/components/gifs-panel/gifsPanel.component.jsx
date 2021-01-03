import React, { Component } from "react";
import { connect } from "react-redux";
import "./gifsPanel.styles.scss";
import { loadGifs } from "../../store/gifs-slice/gifs";
import { meessageAdded } from "../../store/messages-slice/messages";
import SearchInput from "../search-input/searchInput.component";
import Gif from "../gif/gif.component";
class GifsPanel extends Component {
  componentDidMount() {
    this.props.loadGifs();
  }

  state = {
    searchInput: "",
  };
  handleChange = ({ target: { value } }) => {
    this.setState({ searchInput: value });
    this.props.loadGifs(value);
  };
  handleClick = this.props.connected
    ? (gifUrl) => {
        window.rtcService.sendMessage(gifUrl);
        this.props.sendMessage({
          id: this.props.id,
          message: gifUrl,
          date: Date.now(),
        });
      }
    : () => {
        alert("you have to join the room first");
      };
  render() {
    const { gifsList } = this.props;
    const { searchInput } = this.state;
    return (
      <div className="gifs-panel">
        <div className="gifs-panel-search">
          <i className="icon-search1"></i>
          <SearchInput
            value={searchInput}
            handleChange={this.handleChange}
            placeholder="Trouver des GIFs..."
          />
        </div>
        <div className="gifs-panel-gifs">
          {gifsList.map((gif) => (
            <Gif
              width="68px"
              height="58px"
              key={gif.images.downsized.url}
              gifUrl={gif.images.downsized.url}
              handleClick={this.handleClick}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  gifs: { gifsList },
  currentUser: { id, connected },
}) => ({
  connected,
  gifsList,
  id,
});

const mapDispatchToProps = (dispatch) => ({
  loadGifs: (search) => dispatch(loadGifs(search)),
  sendMessage: (message) => dispatch(meessageAdded(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GifsPanel);
