import { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { Player } from '../../seeding/definitions/seedingTypes';
import { Station } from '../definitions/organizingTypes';

export function startTournament(
  router: NextRouter,
  setUncheckedInPlayers: Dispatch<SetStateAction<Player[]>>,
  setStations: Dispatch<SetStateAction<Station[] | undefined>>,
  setEventID: Dispatch<SetStateAction<string | string[]>>
) {
  // Parse the JSON-encoded query parameters
  const queryPlayers: string | string[] | undefined = router.query.players;
  const queryStations: string | string[] | undefined = router.query.stations;
  const queryEventID: string | string[] | undefined = router.query.eventID;

  console.log("query players")
  console.log(queryPlayers)

  // Check if queryPlayers is a string and parse it
  if (typeof queryPlayers === 'string') {
    try {
      const parsedPlayers = JSON.parse(queryPlayers);

      if (Array.isArray(parsedPlayers.players)) {
        // Convert each player object to the Player type and initialize them as not checked in
        const playerArray: Player[] = parsedPlayers.players.map((player: any, index: number) => ({
          playerID: player.playerID || index + 1,
          tag: player.tag || '',
          rating: player.rating || 0,
          carpool: player.carpool || undefined,
          seedID: player.seedID || undefined,
          locations: player.locations || [],
          setHistories: player.setHistories || {},
          isCheckedIn: false, // Initialize as not checked in
        }));

        // Set the players state with the converted array
        setUncheckedInPlayers(playerArray);
      } else {
        console.log("Query parameter 'players' does not contain an array.");
        // Handle the case where 'players' in the parsed object is not an array
        setUncheckedInPlayers([]); // You can set an appropriate default value or handle the error as needed
      }
    } catch (error) {
      console.error("Error parsing 'players' query parameter:", error);
    }
  } else {
    console.log("Query parameter 'players' is not a string.");
    // Handle the case where queryPlayers is not a string
    setUncheckedInPlayers([]); // You can set an appropriate default value or handle the error as needed
  }

  // Check if queryStations is a string and parse it
  if (typeof queryStations === 'string') {
    try {
      const parsedStations = JSON.parse(queryStations);

      if (Array.isArray(parsedStations.stations)) {
        // Convert each station object to the Station type
        const stationArray: Station[] = parsedStations.stations.map((station: any, index: number) => ({
          id: station.id || index + 1, // You can use a default value for 'id' if needed
          startAt: station.startAt || undefined,
          players: station.players || [],
          isCompleted: station.isCompleted || false,
          isAvailable: station.isAvailable || false,
        }));

        // Set the stations state with the converted array
        setStations(stationArray);
      } else {
        console.log("Query parameter 'stations' does not contain an array.");
        // Handle the case where 'stations' in the parsed object is not an array
        setStations([]); // You can set an appropriate default value or handle the error as needed
      }
    } catch (error) {
      console.error("Error parsing 'stations' query parameter:", error);
    }
  } else {
    console.log("Query parameter 'stations' is not a string.");
    // Handle the case where queryStations is not a string
    setStations([]); // You can set an appropriate default value or handle the error as needed
  }

  // Set the eventID state
  setEventID(queryEventID!);
}
