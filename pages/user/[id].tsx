import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPlayerData } from '../../seeding/components/EventDisplayStep/modules/getPlayerData';

function calculateNextMondayMidnight() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek + 1;

    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(23, 59, 0, 0);

    return nextMonday;
}

const UserProfile = () => {
    const router = useRouter();
    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        const cachedUserData = localStorage.getItem(`user_${id}`);
        const expirationTime = localStorage.getItem(`user_${id}_expiration`);

        console.log("user data:")
        console.log(cachedUserData)
        if (cachedUserData !== null) {
            if (!expirationTime || new Date(expirationTime) <= new Date()) {
                if (id) {
                    // User data is not in localStorage, or it's expired, fetch it from the database
                    fetchUserData(id);
                }
            } else {
                // User data is in localStorage and is not expired, use it
                setUserData(JSON.parse(cachedUserData));
            }
        }
    }, [id]);

    const fetchUserData = async (userId: string) => {
        try {
            // Fetch user data from the database
            const tempData = await getPlayerData(userId, false, false);

            // Set the updated user data in localStorage with an expiration time of the soonest Monday
            const expirationTime = calculateNextMondayMidnight();
            localStorage.setItem(`user_${userId}`, JSON.stringify(tempData));
            localStorage.setItem(`user_${userId}_expiration`, expirationTime.toISOString());

            // Set the user data in the useState hook
            setUserData(tempData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div>
            {userData && (
                <p>{userData.user.userName}</p>
            )}
        </div>
    );
};

export default UserProfile;
