import { combineReducers } from "redux-immer";
import { produce } from "immer";

import user from "./user.reducer";

export const rootReducer = combineReducers(produce, {
    user,
});
