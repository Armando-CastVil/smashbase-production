import React, { useEffect, useState } from "react";
import { Player } from "../../../seeding/definitions/seedingTypes";
import { QueueMatch, Station } from "../../definitions/organizingTypes";
import styles from "../../../styles/RunningStep.module.css";

interface Props {
    playerList: Player[];
    stations: Station[];
}

export default function RunningStep({ playerList, stations }: Props) {
    const [queuedMatches, setQueuedMatches] = useState<QueueMatch[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
    const [availableStations, setAvailableStations] = useState<Station[]>(stations);


     // Call the function to assign players to available stations
     useEffect(() => {
        assignPlayersToStations();
    }, [stations, queuedMatches]);

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
        const availableStations = stations.filter((station) => station.isAvailable);
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

    return (
        <div className={styles.container}>
            {/* First Column for Player List */}
            <div className={styles.column}>
                <h2>Player List</h2>
                <div className={styles.playerListContainer}>
                    {playerList.map((player) => (
                        <div
                            key={player.playerID}
                            className={`${styles.playerBox} ${selectedPlayers.includes(player) ? styles.selected : ""
                                }`}

                        >
                            {player.tag}
                            <button className={styles.button} onClick={() => createQueueMatch(player)}>Queue Selected Players</button>
                        </div>
                    ))}
                </div>

            </div>

            {/* Second Column for Queued Matches */}
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

            {/* Third Column for Stations */}
            <div className={styles.column}>
                <h2>Stations</h2>
                <ul>
                    {stations.map((station) => (
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
        </div>
    );
}
