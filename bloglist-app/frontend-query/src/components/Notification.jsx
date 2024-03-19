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

export default Notification;
