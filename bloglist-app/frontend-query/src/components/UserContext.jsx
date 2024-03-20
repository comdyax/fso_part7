import { useContext } from "react";
import { useReducer } from "react";
import { createContext } from "react";
import blogService from "../services/blogs";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      state = action.payload;
      blogService.setToken(action.payload.token);
      window.localStorage.setItem(
        "loggedBlogAppUser",
        JSON.stringify(action.payload),
      );
      return state;
    case "LOGOUT":
      state = action.payload;
      blogService.setToken(null);
      window.localStorage.removeItem("loggedBlogAppUser");
      return state;
    default:
      return state;
  }
};

const UserContext = createContext();

export const useUserDispatch = () => {
  const notificationAndDispatch = useContext(UserContext);
  return notificationAndDispatch[1];
};

export const useUserValue = () => {
  const notificationAndDispatch = useContext(UserContext);
  return notificationAndDispatch[0];
};

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
