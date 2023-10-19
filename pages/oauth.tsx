import React, { useEffect, useState } from 'react';

function Oauth() 
{
    const [code, setCode] = useState<any>();
  useEffect(() => {
    // Function to extract code from the URL
    const extractCodeFromURL = () => 
    {
      const urlParams = new URLSearchParams(window.location.search);
      setCode(urlParams.get('code'));
      /*if (code) 
      {
        // Send the code to your server for token exchange
        // Replace 'YOUR_SERVER_ENDPOINT' with your actual server endpoint
        fetch('YOUR_SERVER_ENDPOINT', 
        {
          method: 'POST',
          headers: 
          {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })
          .then((response) => response.json())
          .then((data) => 
          {
            const { access_token } = data;

            // Store the access token in local storage
            localStorage.setItem('access_token', access_token);

            // Redirect to the desired page after token exchange
            window.location.href = '/profile'; // Change '/profile' to your desired URL
          })
          .catch((error) => 
          {
            console.error('Error exchanging code for access token:', error);
          });
      }*/
    };

    extractCodeFromURL();
  }, []);

  return (
    <div>
      <h1>Code:{code}</h1>
     
    </div>
  );
}

export default Oauth;
