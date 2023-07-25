import InlineMessage from "@atlaskit/inline-message";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css";

interface props 
{
errorCode:number
}

export default function ErrorMessage({ errorCode }:props) {
  const getMessageForErrorCode = () => {
    switch (errorCode) {
      case 0:
        return <p></p>;
      case 1:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! API Key form is empty."
            secondaryText="API Key form is empty."
          >
            <p>Please enter your API Key</p>
          </InlineMessage>
        );
      case 2:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! API Key form is not valid."
            secondaryText="API Key form is not valid."
          >
            <p>Please enter a valid API Key</p>
          </InlineMessage>
        );
      case 3:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! No tournaments were found under this API Key user. Either tournament is not public or user is not an admin of any event"
            secondaryText="Error! No tournaments were found under this API Key user. Either tournament is not public or user is not an admin of any event."
          >
            <p>Please make sure you are an admin for the tournament you want to seed</p>
          </InlineMessage>
        );
      case 4:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! Please sign in. Make sure you're not using incognito mode and cookies are enabled."
            secondaryText="Please sign in."
          >
            <p>Please sign in.</p>
          </InlineMessage>
        );
      case 6:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! Please make sure you are whitelisted."
            secondaryText="Please make sure you are whitelisted"
          >
            <p>Please make sure you are whitelisted</p>
          </InlineMessage>
        );
      case 10:
        return (
          <InlineMessage
            appearance="error"
            iconLabel="Error! Please make sure you have cookies enabled"
            secondaryText="Please make sure you have cookies enabled"
          >
            <p>Please make sure you are whitelisted</p>
          </InlineMessage>
        );
      default:
        return (
          <InlineMessage appearance="confirmation" secondaryText="Valid API Key!">
            <p>Valid API Key!</p>
          </InlineMessage>
        );
    }
  };

  return <div className={globalStyles.errorMessages}>{getMessageForErrorCode()}</div>;
}
