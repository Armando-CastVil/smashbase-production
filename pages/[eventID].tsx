import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Player } from '../seeding/definitions/seedingTypes';
import { QueueMatch, Station } from '../organizing/definitions/organizingTypes';
import { startTournament } from '../organizing/modules/startTournament';
import styles from "../styles/RunningStep.module.css"

// Pass playerList as a prop to the RunningStep component
export default function RunningStep() {
  const [queuedMatches, setQueuedMatches] = useState<QueueMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [unCheckedInPlayers, setUncheckedInPlayers] = useState<Player[]>([]);
  const [checkedInPlayers, setCheckedInPlayers] = useState<Player[]>([]);
  const [stations, setStations] = useState<Station[]>();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [availableStations, setAvailableStations] = useState<Station[]>();
  const [eventID, setEventID] = useState<string | string[]>("");
  const [tournamentStarted, setTournamentStarted] = useState(false); // To track if the tournament has started
  const router = useRouter();

   // Call autoAssignPlayersToStations whenever stations or queuedMatches change
   useEffect(() => {
    autoAssignPlayersToStations();
  }, [stations, queuedMatches]);

   

  // Function to automatically assign players to available stations
  const autoAssignPlayersToStations = () => {
    if (stations && queuedMatches.length > 0) {
      const updatedAvailableStations = stations.filter((station) => station.isAvailable);

      if (updatedAvailableStations.length > 0) {
        const updatedQueuedMatches = [...queuedMatches];
        const assignedStations: Station[] = [];

        for (const station of updatedAvailableStations) {
          if (updatedQueuedMatches.length === 0) {
            break; // No more queued matches to assign
          }

          const matchToAssign = updatedQueuedMatches.shift();
          station.players = [matchToAssign!.player1, matchToAssign!.player2];
          station.isAvailable = false;
          assignedStations.push(station);
        }

        // Update the state with the updated queued matches and stations
        setQueuedMatches(updatedQueuedMatches);
        setAvailableStations(assignedStations);
      }
    }
  };

 
  // Define a custom queue data structure for managing queued matches
  const Queue = {
    enqueue: (queue: QueueMatch[], item: QueueMatch) => [...queue, item],
    dequeue: (queue: QueueMatch[]) => queue.slice(1),
    peek: (queue: QueueMatch[]) => queue[0],
  };

  const createQueueMatch = (player: Player) => {
    
    setSelectedPlayers((prevSelectedPlayers) => {
      if (prevSelectedPlayers.length === 2) {
        // Clear the selected players
        return [];
      }
      if (prevSelectedPlayers.length === 0) {
        return [player];
      }
      if (prevSelectedPlayers.length === 1) {
        // Create a new queue match with the selected players
        const newQueueMatch: QueueMatch = {
          player1: prevSelectedPlayers[0],
          player2: player,
        };

        // Enqueue the new queue match
        setQueuedMatches((prevQueuedMatches) => Queue.enqueue(prevQueuedMatches, newQueueMatch));
        
        return [];
      }
      return prevSelectedPlayers; // Fallback, should not happen
    });
  };

  // Function to display the next match in the queue
  const getNextMatch = () => {
    const nextMatch = Queue.peek(queuedMatches);
    if (nextMatch) {
      return `${nextMatch.player1.tag} vs. ${nextMatch.player2.tag}`;
    }
    return "No matches queued.";
  };

  // Function to assign players to available stations
  const assignPlayersToStations = () => {
    const availableStations = stations!.filter((station) => station.isAvailable);
    if (availableStations.length === 0) {
      // No available stations
      return;
    }

    const updatedQueuedMatches = [...queuedMatches];
    const assignedStations: Station[] = [];

    for (const station of availableStations) {
      if (updatedQueuedMatches.length === 0) {
        // No more queued matches
        break;
      }

      const matchToAssign = updatedQueuedMatches.shift();
      station.players = [matchToAssign!.player1, matchToAssign!.player2];
      station.isAvailable = false;
      assignedStations.push(station);
    }

    // Update the state with the updated queued matches and stations
    setQueuedMatches(updatedQueuedMatches);
    setAvailableStations(assignedStations);
  };

  // Function to start the tournament
  // Define a callback function for the button click
  const handleStartTournament = () => {
    startTournament(router, setUncheckedInPlayers, setStations, setEventID);
    setTournamentStarted(true); // Hide the button when the tournament starts
  };

  // Function to handle player check-in
  const handlePlayerCheckIn = (playerToCheckIn: Player) => {
    // Find the index of the player to check-in in the unCheckedInPlayers array
    const playerIndex = unCheckedInPlayers.findIndex(
      (player) => player.playerID === playerToCheckIn.playerID
    );

    if (playerIndex !== -1) {
      // Remove the player from unCheckedInPlayers
      const updatedUncheckedInPlayers = [
        ...unCheckedInPlayers.slice(0, playerIndex),
        ...unCheckedInPlayers.slice(playerIndex + 1),
      ];

      // Add the player to checkedInPlayers
      const updatedCheckedInPlayers = [...checkedInPlayers, playerToCheckIn];

      // Update the state with the new player lists
      setUncheckedInPlayers(updatedUncheckedInPlayers);
      setCheckedInPlayers(updatedCheckedInPlayers);
    }
  };




  return (
    <div className={styles.columnContainer}>
      {tournamentStarted ? (
        // Display everything when the tournament has started
        <>
          {/* Left Column */}
          <div className={styles.column}>
            {/* Checked-In Players */}
            <div>
              <h2>Checked-In Players</h2>
              {checkedInPlayers.map((player) => (
                <div key={player.playerID} className={styles.playerBox}>
                  <div>{player.tag}</div>
                  <button className={styles.button} onClick={() => createQueueMatch(player)}>Queue Selected Players</button>
                </div>
              ))}
            </div>

            {/* Unchecked-In Players */}
            <div>
              <h2>Unchecked-In Players</h2>
              {unCheckedInPlayers.map((player) => (
                <div key={player.playerID} className={styles.playerBox}>
                  <div>{player.tag}</div>
                  {/* Add a button to manually check players in */}
                  <button onClick={() => handlePlayerCheckIn(player)}>Check In</button>

                </div>
              ))}
            </div>
          </div>

          {/* Middle Column */}
          <div className={styles.column}>

            <h2>Queued Matches</h2>
            {/* Display the queued matches here */}
            <ul>
              {queuedMatches.map((queuedMatch, index) => (
                <li key={index}>
                  {queuedMatch.player1.tag} vs. {queuedMatch.player2.tag}
                </li>
              ))}
            </ul>
          </div>


          {/* Right Column */}
          <div className={styles.column}>
            {/* Place your right column content here */}
            {/* You can add additional information or widgets */}
            <h2>Stations</h2>
            <ul>
              {stations!.map((station) => (
                <li key={station.id}>
                  <strong>Station {station.id}</strong>
                  <p>Start Time: {station.startAt ?? "Not started"}</p>
                  <p>Is Completed: {station.isCompleted ? "Yes" : "No"}</p>
                  <p>Is Available: {station.isAvailable ? "Yes" : "No"}</p>
                  <div className={styles.playersContainer}>
                    <p>Players:</p>
                    <div className={styles.playersListContainer}>
                      {station.players.map((player: Player) => (
                        <div key={player.playerID} className={styles.playerBox}>
                          {player.tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        // Display the "Start Tournament" button if the tournament has not started
        <div className={styles.column}>
          <button onClick={handleStartTournament}>Start Tournament</button>
        </div>
      )}
    </div>
  );
}
