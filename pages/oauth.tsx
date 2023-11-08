import axios from 'axios';
import React, { useEffect, useState } from 'react';
import getUserData from '../globalComponents/modules/getUserData';
import { User } from '../globalComponents/modules/globalTypes';
import { getDefaultRating, getPlayerData } from '../seeding/components/EventDisplayStep/modules/getPlayerData';
import { useRouter } from 'next/router'
import LoadingScreen from '../seeding/components/LoadingScreen';

function Oauth() {

    const router = useRouter();
    useEffect(() => {
        let code: string | null = ""

        //extracts code from url
        const extractCodeFromURL = async () => {

            const urlParams = new URLSearchParams(window.location.search);
            code = urlParams.get('code');

        };

        //exchange code for access_token aka api key
        const sendCodeToServer = async (code: string) => {

            if (code) {
                try {
                    

                    //exchange takes place here
                    const response = await axios.post('/api/token-exchange', { code });

                    console.log("response:")
                    console.log(response)
                    //exchange access_token for user info like id and gamertag
                    var userdata = await getUserData(response.data.access_token)
                    console.log("userdata:")
                    console.log(userdata)



                    //create the user profile
                    let startGGID = userdata.currentUser.player.id
                    let userName = userdata.currentUser.player.gamerTag
                    let rating = getDefaultRating(false)
                    let apiKey = response.data.access_token
                    let profilePicture=userdata.currentUser.images[0].url
                    let userData: User =
                    {
                        startGGID: startGGID,
                        userName: userName,
                        rating: rating,
                        apiKey: apiKey,
                        profilePicture:profilePicture
                    }

                    //get current user, delete it from local storage if it's expired
                    const currentUser = getCurrentUserFromLocalStorage();
                    //if there is already a currentUser in local storage, check if it's the same 
                    //as the one that's currently logging in
                    if (currentUser) {
                        if (currentUser.startGGID == userData.startGGID) {
                            console.log("it's the same user, redirect to homepage here")
                            // Redirect to homepage
                            router.push('/');
                        }
                        //only query for rating if the user is different from the one already in local storage
                        else {
                            let playerData = await getPlayerData(startGGID, false, false)
                            userData.rating = playerData.rating
                            saveCurrentUserToLocalStorage(userData)
                            // Redirect to homepage
                            router.push('/');
                        }
                    }
                    else
                    {
                        let playerData = await getPlayerData(startGGID, false, false)
                        userData.rating = playerData.rating
                        saveCurrentUserToLocalStorage(userData)
                        // Redirect to homepage
                        router.push('/');
                    }






                } catch (error) {
                    console.error('Error sending code to server:', error);
                }
            }
        };

        extractCodeFromURL();

        if (code) {
            sendCodeToServer(code);
        }
    }, []);

    return (
        <LoadingScreen message='logging in' isVisible={true} />
    );
}

export default Oauth;

// Function to save the User object to local storage with the key "currentUser"
export const saveCurrentUserToLocalStorage = (user: User) => {
    try {
        // Calculate the timestamp for the next Monday at 11:59 PM
        const now = new Date();
        const today = now.getDay(); // 0 for Sunday, 1 for Monday, and so on
        const daysUntilMonday = 1 + ((7 - today) % 7); // Calculate days until the next Monday
        const expirationDate = new Date(now);
        expirationDate.setDate(now.getDate() + daysUntilMonday);
        expirationDate.setHours(23, 59, 0, 0);

        const userWithExpiration = {
            user,
            expirationTimestamp: expirationDate.getTime(),
        };

        const userString = JSON.stringify(userWithExpiration);
        localStorage.setItem(`currentUser`, userString);
    } catch (error) {
        console.error('Error saving user to local storage:', error);
    }
};

// Function to retrieve the User object from local storage and check if it has expired
export const getCurrentUserFromLocalStorage = (): User | null => {
    try {
        const userString = localStorage.getItem(`currentUser`);
        if (userString) {
            const userWithExpiration = JSON.parse(userString);
            const now = new Date().getTime();
            if (userWithExpiration.expirationTimestamp >= now) {
                return userWithExpiration.user;
            } else {
                // Data has expired, remove it from local storage
                localStorage.removeItem(`currentUser`);
            }
        }
    } catch (error) {
        console.error('Error retrieving user from local storage:', error);
    }
    return null;
};



