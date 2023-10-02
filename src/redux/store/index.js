import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import logger from 'redux-logger';
import taskSlice from "../reducerSlices/taskSlice";

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage,
}

const reducer = combineReducers({
    login: taskSlice
});

const persistedReducer = persistReducer(persistConfig, reducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: [logger]
});

export const persistor = persistStore(store)