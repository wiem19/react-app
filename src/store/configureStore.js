import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";



import rootReducer from './rootReducer'
import api from "./middleware/api";


const store = configureStore({
    reducer: rootReducer,
    middleware: [
        ...getDefaultMiddleware(),
        api
    ]
});


// for hot relaoding the reducer when making changers
if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}



export default store