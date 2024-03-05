import { getPlayerData } from "./getPlayerData";

self.addEventListener('message', async (event) => {
    const { playerIDs, melee, online } = event.data;

    for(let i = 0; i < playerIDs.length; i++) {
        console.log("api check");
        const data = await getPlayerData(playerIDs[i], melee, online);
        if (data) {
            self.postMessage({
                playerID: playerIDs[i],
                data,
            });
        } else {
            console.log("data check fail");
            self.postMessage({ playerID: playerIDs[i], data: {} });
        }
    }
});

