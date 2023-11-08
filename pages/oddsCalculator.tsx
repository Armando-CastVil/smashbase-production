import React, { useState } from 'react';
import { getPlayerData } from '../seeding/components/EventDisplayStep/modules/getPlayerData';
import calculateSoonestMonday from '../globalComponents/modules/calculateSoonestMonday';

const OddsCalculator: React.FC = () => {
  const [id1, setId1] = useState<string>('');
  const [id2, setId2] = useState<string>('');
  const [odds1, setOdds1] = useState<number>(0);
  const [odds2, setOdds2] = useState<number>(0);

  const handleId1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId1(e.target.value);
    
  };

  const handleId2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId2(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    let rating1= await fetchRating(id1)
    let rating2=await fetchRating(id2)

    console.log("rating 1:"+ rating1)
    console.log("rating 2:"+ rating2)


    // Handle the submission of the form, e.g., perform odds calculation
    // You can add your logic here.
    let player1odds=(rating1)/(rating1+rating2)
    let player2odds=1-player1odds
    setOdds1(player1odds)
    setOdds2(player2odds)
    console.log("player 1 odds: "+ player1odds*100+"%")
    console.log("player 2 odds: "+ player2odds*100+"%")

  };

 

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter ID 1:
          <input type="text" value={id1} onChange={handleId1Change} />
        </label>
        <br />
        <label>
          Enter ID 2:
          <input type="text" value={id2} onChange={handleId2Change} />
        </label>
        <br />
        <button type="submit">Calculate Odds</button>
      </form>
    </div>
  );
};
async function fetchRating(id:string)
{
    const cachedUserData = localStorage.getItem(`user_${id}`);
    const expirationTime = localStorage.getItem(`user_${id}_expiration`);
    let rating=0;

    if (cachedUserData !== null) 
    {
        
        if (!expirationTime || new Date(expirationTime) <= new Date()) {
            if (id) {
                // User data is not in localStorage, or it's expired, fetch it from the database
                await fetchUserData(id).then((data)=>
                {
                    rating=data!
                    return rating
                });
                
            }
        } else {
            // rating is in localStorage and is not expired, use it
            return JSON.parse(cachedUserData).rating;
            
        }
    } else {
        if (id) {
            // User data is not in localStorage, or it's expired, fetch it from the database
            await fetchUserData(id).then((data)=>
            {
                rating=data!
                return rating
            });
        }
    }
}
const fetchUserData = async (userId: string) => {
    try {
        // Fetch user data from the database
        const tempData = await getPlayerData(userId, false, false);

        // Set the updated user data in localStorage with an expiration time of the soonest Monday
        const expirationTime = calculateSoonestMonday();
        localStorage.setItem(`user_${userId}`, JSON.stringify(tempData));
        localStorage.setItem(`user_${userId}_expiration`, expirationTime.toISOString());

        // Set the user data and indicate that loading is complete
        return tempData.rating;
        
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

export default OddsCalculator;
