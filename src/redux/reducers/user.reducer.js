import { userConstants } from "../constants/user.constants";

const initialState = { theme: "light" };

export default function user(state = initialState, action) {
    switch (action.type) {
        case userConstants.CHANGE_THEME:
            state.theme = action.payload;
            return state;

        default:
            return state;
    }
};
