import React, { Component } from "react";
import { connect } from "react-redux";

import Icon from "../icon/icon.component";
import {
  userAdded,
  userAvatarAdded,
  userDisconnected,
} from "../../store/connceted-users-slice/connected-users";
import eventHub from "../../services/event-hub/eventHub";
import "./userList.styles.scss";

class UserList extends Component {
  state = {};
  componentDidMount() {
    eventHub.on("participantJoined", (joinedUser) => {
      this.props.addUser(joinedUser);
    });
    eventHub.on("avatarChanged", (joinedUser) => {
      this.props.addAvatarToUser(joinedUser);
    });
    eventHub.on("participantLeft", (id) => {
      this.props.disconnectedUser(id);
    });
  }
  render() {
    const { confirenceUsers } = this.props;
    const connectedUsers = confirenceUsers.filter((user) => !user.disconnected);
    const usersNumber = connectedUsers.length;

    return (
      <div className="users-list">
        {connectedUsers.slice(0, 3).map(({ avatarURL, id, displayName }) => (
          <Icon
            key={id}
            picture={avatarURL}
            width={32}
            height={32}
            title={displayName}
          />
        ))}
        {usersNumber > 3 && (
          <Icon
            content={`+${usersNumber % 3}`}
            backgroundColor="#518b16"
            width={32}
            height={32}
          />
        )}
        {!usersNumber && <div className="users-list-info">en attend...</div>}
      </div>
    );
  }
}

const mapStateToProps = ({
  connectedUsers: { confirenceUsers },
  currentUser: { id: currentUserId },
}) => ({
  confirenceUsers,
  currentUserId,
});
const mapDispachToProps = (dispatch) => ({
  addUser: (user) => dispatch(userAdded(user)),
  addAvatarToUser: (avatar) => dispatch(userAvatarAdded(avatar)),
  disconnectedUser: (id) => dispatch(userDisconnected(id)),
});

export default connect(mapStateToProps, mapDispachToProps)(UserList);
