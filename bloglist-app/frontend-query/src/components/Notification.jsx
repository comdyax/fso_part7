import { useNotificationValue } from "./BlogContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) {
    return <></>;
  }
  return (
    <div className={notification[1] ? "confirmation" : "error"}>
      {notification[0]}
    </div>
  );
};

/**
const Notification = ({ errorMessage, confirmationMessage }) => {
  return (
    <div>
      <ErrorMessage errorMessage={errorMessage} />
      <ConfirmationMessage confirmationMessage={confirmationMessage} />
    </div>
  );
};

const ErrorMessage = ({ errorMessage }) => {
  if (errorMessage !== null) {
    return <div className="error">{errorMessage}</div>;
  }
};

const ConfirmationMessage = ({ confirmationMessage }) => {
  if (confirmationMessage !== null) {
    return <div className="confirmation">{confirmationMessage}</div>;
  }
};
 */

export default Notification;
