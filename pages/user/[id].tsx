import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPlayerData } from '../../seeding/components/EventDisplayStep/modules/getPlayerData';
import calculateSoonestMonday from '../../globalComponents/modules/calculateSoonestMonday';



const UserProfile = () => {
    const router = useRouter();
    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const [userData, setUserData] = useState<any>();
    const [isLoading, setIsLoading] = useState(true); // Added isLoading state

    useEffect(() => {
        const cachedUserData = localStorage.getItem(`user_${id}`);
        const expirationTime = localStorage.getItem(`user_${id}_expiration`);

        if (cachedUserData !== null) {
            console.log("cached user data")
            console.log(cachedUserData)
            if (!expirationTime || new Date(expirationTime) <= new Date()) {
                if (id) {
                    // User data is not in localStorage, or it's expired, fetch it from the database
                    fetchUserData(id);
                }
            } else {
                // User data is in localStorage and is not expired, use it
                setUserData(JSON.parse(cachedUserData));
                setIsLoading(false); // Data is available, set isLoading to false
            }
        } else {
            if (id) {
                // User data is not in localStorage, or it's expired, fetch it from the database
                fetchUserData(id);
            }
        }
    }, [id]);

    const fetchUserData = async (userId: string) => {
        try {
            // Fetch user data from the database
            const tempData = await getPlayerData(userId, false, false);

            // Set the updated user data in localStorage with an expiration time of the soonest Monday
            const expirationTime = calculateSoonestMonday();
            localStorage.setItem(`user_${userId}`, JSON.stringify(tempData));
            localStorage.setItem(`user_${userId}_expiration`, expirationTime.toISOString());

            // Set the user data and indicate that loading is complete
            setUserData(tempData);
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
                <p>
                  
                 {userData.rating}
                </p>
            )}
        </div>
    );
};

export default UserProfile;
