import { userConstants } from "../constants/user.constants";

export function changeTheme(payload) {
    return { type: userConstants.CHANGE_THEME, payload };
}
