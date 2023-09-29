import InlineMessage from "@atlaskit/inline-message";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css";
import ErrorCode from "../modules/enums";

interface Props {
  errorCode: ErrorCode;
}

export default function ErrorMessage({ errorCode }: Props) {
  const getMessageForErrorCode = () => {
    switch (errorCode) {
      case ErrorCode.None:
        return <p></p>;
      case ErrorCode.EmptyAPIKey:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! API Key form is empty."
            secondaryText="API Key form is empty."
          >
            <p>Please enter your API Key</p>
          </InlineMessage>
        );
      case ErrorCode.InvalidAPIKey:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! API Key is not valid."
            secondaryText="API Key is not valid."
          >
            <p>Please enter a valid API Key</p>
          </InlineMessage>
        );
      case ErrorCode.NoTournamentsFound:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! No tournaments were found under this API Key user. Either tournament is not public or user is not an admin of any event"
            secondaryText="Error! No tournaments were found under this API Key user. Either tournament is not public or user is not an admin of any event."
          >
            <p>Please make sure you are an admin for the tournament you want to seed</p>
          </InlineMessage>
        );
      case ErrorCode.SignInRequired:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! Please sign in."
            secondaryText="Please sign in."
          >
            <p>Please sign in.</p>
          </InlineMessage>
        );
      case ErrorCode.NotWhitelisted:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! Please make sure you are whitelisted."
            secondaryText="Please make sure you are whitelisted"
          >
            <p>Please make sure you are whitelisted</p>
          </InlineMessage>
        );
    }
  };

  return <div className={globalStyles.errorMessages}>{getMessageForErrorCode()}</div>;
}
