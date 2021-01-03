
import http from "../../services/httpService";
import * as actions from "./apiActions";
import config from "../../services/config.apis.json";
import { isLocalhost } from '../../serviceWorker';
import { networkDisconnected, networkConnected } from "../current-user-slice/current-user"



const api = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const {
    url,
    method,
    data,
    onStart,
    onSuccess,
    onError,

  } = action.payload;

  if (onStart)
    dispatch({
      type: onStart,
      payload: {

      },
    });

  next(action);

  try {
    const response = await http.request({
      baseURL: isLocalhost ? config.apiUrl : config.apiUrlFromSource,
      url,
      method,
      data,
    });


    dispatch(networkConnected());
    dispatch(actions.apiCallSuccess(response.data));

    if (onSuccess)
      dispatch({
        type: onSuccess,
        payload: {
          data: response.data,

        },
      });
  } catch (error) {

    const exprecteddError = error.response && error.response.status >= 400 && error.response.status < 500;
    if (!exprecteddError) {
      dispatch(networkDisconnected());

      if (onError)
        dispatch({
          type: onError,
          payload: {
            error: error.message,

          },
        });
    }

  }
};

export default api;
