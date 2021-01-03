import { combineReducers } from "redux";
import connectedUsersReducer from "./connceted-users-slice/connected-users";
import messagesReducer from "./messages-slice/messages";

import gifsReducer from "./gifs-slice/gifs";
import panelReducer from "./panel-slice/panel";
import currentUserReduceer from "./current-user-slice/current-user";
export default combineReducers({
   currentUser: currentUserReduceer,
   connectedUsers: connectedUsersReducer,
   messages: messagesReducer,

   gifs: gifsReducer,
   panel: panelReducer
});
