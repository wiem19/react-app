import React, { Component } from "react";
import "./scrollableArea.styles.scss";

class ScrollableDiv extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    this.scrollRef.current.scrollTop = this.scrollRef.current.scrollHeight;
  }
  componentDidUpdate() {
    this.scrollRef.current.scrollTop = this.scrollRef.current.scrollHeight;
  }
  render() {
    const { children, height } = this.props;

    return (
      <div className="scrollable-area">
        <div
          className=" items-display scrollbar bordered-scrollbar thin"
          ref={this.scrollRef}
          style={{ height: height + "px" }}
        >
          <div className="d" style={{ height: parseInt(height) }}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default ScrollableDiv;
