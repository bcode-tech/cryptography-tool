import { applyMiddleware, createStore, compose } from "redux";

import { createTransform, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import * as config from "../../imports/config";
// import { rootEpic } from "../epics/index";
import { rootReducer } from "../reducers/index";
// import { createIpfsEnhancer } from "../../enhancers/createIpfsEnhancer";

// Utils for redux-persist dates
const replacer = (key, value) =>
    value instanceof Date ? value.toISOString() : value;

const reviver = (key, value) =>
    typeof value === "string" &&
    value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ? new Date(value)
        : value;

export const encode = toDeshydrate => JSON.stringify(toDeshydrate, replacer);
export const decode = toRehydrate => JSON.parse(toRehydrate, reviver);

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
    transforms: [createTransform(encode, decode)],
};

// const epicMiddleware = createEpicMiddleware({
//     dependencies: {
//         config,
//     },
// });

const middlewares = [];

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
);

export let persistor = persistStore(store);

// epicMiddleware.run(rootEpic);
