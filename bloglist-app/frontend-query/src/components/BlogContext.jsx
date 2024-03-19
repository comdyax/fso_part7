import { useContext } from "react";
import { useReducer } from "react";
import { createContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "CONFIRM":
      state = [action.payload, true];
      return state;
    case "ERROR":
      state = [action.payload, false];
      return state;
    case "REMOVE":
      if (action.payload === state[0]) state = null;
      return state;
    default:
      return state;
  }
};

const BlogContext = createContext();

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(BlogContext);
  return notificationAndDispatch[1];
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(BlogContext);
  return notificationAndDispatch[0];
};

export const BlogContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    "",
  );

  return (
    <BlogContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
