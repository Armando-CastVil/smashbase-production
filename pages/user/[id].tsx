import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPlayerData } from '../../seeding/components/EventDisplayStep/modules/getPlayerData';
import calculateSoonestMonday from '../../globalComponents/modules/calculateSoonestMonday';
import profileStyles from "../../styles/Profile.module.css"
import Sidebar from '../../globalComponents/Sidebar';
import { Profile } from '../../globalComponents/modules/globalTypes';
import getProfileData from '../../globalComponents/modules/getProfile';
import defaultPicture from "../../assets/seedingAppPics/logo.jpg"
import Image from 'next/image';


//start of file
const UserProfile = () => {
    const router = useRouter();
    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [apiKey, setApiKey] = useState<string | undefined>("");
    const [profile, setProfile] = useState<Profile>();
    const [isLoading, setIsLoading] = useState(true); // Added isLoading state


    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        console.log(currentUser)

        if (currentUser) {
            const userObject = JSON.parse(currentUser);
            setApiKey(userObject.user.apiKey);
            setIsLoggedIn(true);
        }
    }, []);


    useEffect(() => {

        const cachedProfileData = localStorage.getItem(`profile_${id}`);
        const expirationTime = localStorage.getItem(`profile_${id}_expiration`);
        console.log("chached profile data:")
        console.log(cachedProfileData)

        if (cachedProfileData !== null) {

            // User data is not in localStorage, or it's expired, fetch it from the database
            if (!expirationTime || new Date(expirationTime) <= new Date()) {
                if (id) {
                    // User data is not in localStorage, or it's expired, fetch it from the database
                    fetchProfileData(id);
                }
            } else {
                // User data is in localStorage and is not expired, use it
                console.log(JSON.parse(cachedProfileData))
                setProfile(JSON.parse(cachedProfileData));
                setIsLoading(false); // Data is available, set isLoading to false
            }
        } else {
            if (id) {
                // User data is not in localStorage, or it's expired, fetch it from the database
                fetchProfileData(id);
            }
        }
    }, [id]);

    const fetchProfileData = async (profileId: string) => {
        try {
            // Fetch user data from the database
            const tempDatabaseData = await getPlayerData(profileId, false, false);
            //exchange access_token for user info like id and gamertag
            const startGGData = await getProfileData(apiKey!, id!)
            console.log("startggdata")
            console.log(startGGData)
            //create profile
            const tempProfile: Profile =
            {
                startGGID: parseInt(id!),
                profilePicture: startGGData.player.user.images[0].url,
                profileName: startGGData.player.gamerTag,
                rating: tempDatabaseData.rating,
                country: tempDatabaseData.country,
                main: tempDatabaseData.main,
                worldRank: tempDatabaseData.rank,
                regionRank: 1,
                characterRank: 1

            }

            // Set the updated user data in localStorage with an expiration time of the soonest Monday
            const expirationTime = calculateSoonestMonday();
            localStorage.setItem(`profile_${profileId}`, JSON.stringify(tempProfile));
            localStorage.setItem(`profile_${profileId}_expiration`, expirationTime.toISOString());



            console.log("profile")
            console.log(tempProfile)
            // Set the user data and indicate that loading is complete
            setProfile(tempProfile);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className={profileStyles.body}>
                    <Sidebar />
                    <div className={profileStyles.container}>


                        <div className={profileStyles.topContainer}>
                            <div className={profileStyles.profilePictureContainer}>
                                <Image
                                    alt="profile picture"
                                    src={
                                        profile?.profilePicture == undefined
                                            ? defaultPicture
                                            : profile.profilePicture
                                    }
                                    width={256}
                                    height={256}
                                    style={{
                                        width: '128px',
                                        height: '128px',
                                        borderRadius: '20px',
                                    }}
                                ></Image>


                            </div>
                            <div className={profileStyles.gamerTagContainer}>
                                {profile!.profileName}
                            </div>
                            <div className={profileStyles.ratingContainer}>
                                <div className={profileStyles.ratingContent}>
                                    {profile!.rating?.toFixed(2) + "Pts"}
                                </div>
                            </div>
                            <div className={profileStyles.country}>
                                {profile!.country?.toUpperCase()}
                            </div>
                            <div className={profileStyles.mainCharacterContainer}>
                                {profile!.main}
                            </div>

                        </div>
                        <div className={profileStyles.bottomContainer}>
                            <div className={profileStyles.worldRank}>
                                <div className={profileStyles.worldRankText}>Worldwide Rank</div>
                                <div className={profileStyles.numberText}>{"#"+profile!.worldRank}</div>
                                <p className={profileStyles.percentileText}> Top &nbsp; <span className={profileStyles.percentileNumber}> .1% </span> &nbsp; percentile </p>
                            </div>
                           
                            <div className={profileStyles.regionRank}>
                                <div className={profileStyles.regionRankText}>Regional Rank</div>
                                <div className={profileStyles.numberText}>{"#"+profile!.regionRank}</div>
                                <p className={profileStyles.percentileText}> Top &nbsp; <span className={profileStyles.percentileNumber}> .1% </span> &nbsp; percentile </p>
                            </div>
                            <div className={profileStyles.characterRank}>
                                <div className={profileStyles.characterRankText}>Character Rank</div>
                                <div className={profileStyles.numberText}>{"#"+profile!.characterRank}</div>
                                <p className={profileStyles.percentileText}> Top &nbsp; <span className={profileStyles.percentileNumber}> .1% </span> &nbsp; percentile </p>
                            </div>
                            
                            
                        </div>

                    </div>


                </div>

            )}
        </div>
    );
};

export default UserProfile;
