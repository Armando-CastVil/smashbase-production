import { useRouter } from 'next/router';
import { User } from '../../globalComponents/modules/globalTypes';
import { useEffect, useState } from 'react';
import { getPlayerData } from '../../seeding/components/EventDisplayStep/modules/getPlayerData';

const UserProfile = () => {
    const router = useRouter();
    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        // Function to fetch user data from the database
        const fetchUserData = async (userId: string) => {
            try {
                // Make a fetch request to get user data based on the ID
                const tempData = await getPlayerData(userId, false, false);
                setUserData(tempData);

                console.log(tempData)
                // Calculate the expiration time for the soonest Monday at 11:59 PM
                const now = new Date();
                const dayOfWeek = now.getDay();
                const daysUntilMonday = dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek + 1;
                const expirationTime = new Date(now);
                expirationTime.setDate(now.getDate() + daysUntilMonday);
                expirationTime.setHours(23, 59, 0, 0);

                // Store user data and expiration time in localStorage
                localStorage.setItem(`user_${userId}`, JSON.stringify(tempData));
                localStorage.setItem(`user_${userId}_expiration`, expirationTime.toISOString());

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (id) {
            // Check if user data is in localStorage
            const cachedUserData = localStorage.getItem(`user_${id}`);
            const expirationTime = localStorage.getItem(`user_${id}_expiration`);

            if (!cachedUserData || !expirationTime || new Date(expirationTime) <= new Date()) {
                // Data is not in localStorage or has expired, fetch it
                if (cachedUserData) {
                    // If cached data is expired, remove it from localStorage
                    localStorage.removeItem(`user_${id}`);
                    localStorage.removeItem(`user_${id}_expiration`);
                }
                fetchUserData(id);
            }
        }
    }, [id]);

    return (
        <div>
            <p>{userData}</p>
        </div>
    );
};

export default UserProfile;
