import React from 'react';

const ErrorPage = () => {
  const discordChannelLink = 'https://discord.com/channels/1001574731046203433/1080685090180448266'; // Replace with the appropriate Discord channel link

  return (
    <div>
      <h1>Unexpected Error</h1>
      <p>Sorry, an unexpected error occurred. Please try again.</p>
      <p>
        If the issue persists, please submit the error in the{' '}
        <a href={discordChannelLink} target="_blank" rel="noopener noreferrer">
          appropriate Discord channel
        </a>
        .
      </p>
    </div>
  );
};

export default ErrorPage;