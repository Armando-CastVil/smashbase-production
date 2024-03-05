import startGGQueryer from "../../../../pages/api/queryStartGG";
import { Player, playerData } from "../../../definitions/seedingTypes";

export default async function getEntrantsFromSlug(slug: string, apiKey: string, melee: boolean, online: boolean, setProgress: (value: number) => void) {
  var playerList: Player[] = [];
  var rawData: any[] = [];

  //create preprocessed data from api call to start.gg
  rawData = await createRawData(rawData, slug, apiKey)

  //create an array of just the IDs so we can use it with web workers
  let idArray = flatten(rawData)

  //building a set which holds unique values so we can check if a value is there
  let idSet: Set<string> = new Set()
  for (let i = 0; i < rawData.length; i++) {
    for (let j = 0; j < rawData[i].event.entrants.nodes.length; j++) {
      let playerID = rawData[i].event.entrants.nodes[j].participants[0].player.id
      idSet.add(playerID.toString())
    }
  }

  //for every page get the entrant info and store it in an array, return once all entries have been processed
  //put them in to a hashmap for easier access
  const playerMap = new Map<string, Player>();
  for (let i = 0; i < rawData.length; i++) {
    for (let j = 0; j < rawData[i].event.entrants.nodes.length; j++) {

      let playerID = rawData[i].event.entrants.nodes[j].participants[0].player.id

      let player: Player =
      {
        playerID: playerID,
        tag: rawData[i].event.entrants.nodes[j].participants[0].gamerTag,
        rating: 0,
        carpool: undefined,
        seedID: undefined,
        locations: [],
        setHistories: undefined
      }
      playerMap.set(playerID, player)
    }

  }

  //create 4 web workers
  const numWorkers = 4;


  // Split player IDs into chunks for each worker
  const chunkSize = Math.ceil(idArray.length / numWorkers);
  const chunks: any = [];
  for (let i = 0; i < idArray.length; i += chunkSize) {
    chunks.push(idArray.slice(i, i + chunkSize));
  }

  // Create and initialize web workers
  const workers: Worker[] = [];
  // Array to hold promises returned by workers
  const workerPromises: Promise<void>[] = [];

  // Counter to keep track of the number of workers that have completed their tasks


  // Counter to keep track of the number of completed workers
  let completedWorkers = 0;

  // Create and initialize web workers

for (let i = 0; i < numWorkers; i++) {
  const worker = new Worker(new URL('getPlayerDataWorker.ts', import.meta.url));
  workers.push(worker);
  const workerPromise = new Promise<void>((resolve) => {
    worker.addEventListener('message', () => {
      completedWorkers++;
      console.log("completed workers", completedWorkers);
      if (completedWorkers === idArray.length) {
        console.log("All workers completed. Resolving all promises.");
        resolve();
      }
    });
  });
  workerPromises.push(workerPromise);
}


  // Create a single promise to track the completion of all workers
  const allWorkersPromise = new Promise<void>((resolve) => {
    let completedWorkers = 0;

    // Function to check if all workers have completed their tasks
    const checkCompletion = () => {
      completedWorkers++;
      console.log("completed workers", completedWorkers);
      if (completedWorkers === idArray.length) {
        console.log("All workers completed. Resolving all promises.");
        resolve();
      }
    };

    // Attach event listeners to each worker
    workers.forEach(worker => {
      worker.addEventListener('message', checkCompletion);
    });
  });


  // Receive messages from workers
  workers.forEach(worker => {
    worker.addEventListener('message', (event) => {
      const { playerID, data } = event.data;
      // Process the received data
      // only add set histories with other players at the tournament
      let filteredSetHistories: { [key: string]: number } = {};
      for (const oppID in data.sets) {
        if (data.sets.hasOwnProperty(oppID) && idSet.has(oppID)) {
          filteredSetHistories[oppID] = data.sets[oppID]
        }
      }
      var player = playerMap.get(playerID)
      if (player) {
        player.rating = data.rating;
        player.setHistories = filteredSetHistories;
        player.locations = data.locations
        playerList.push(player);
      }
    });
  });

  //put the workers to work
  for (let i = 0; i < workers.length; i++) {
    workers[i].postMessage({
      playerIDs: chunks[i],
      melee: melee,
      online: online
    });
  }

  // Wait for all worker promises to resolve
  await allWorkersPromise;

  return playerList;
}

//this function puts all the IDs in an array to avoid dealing with nested objects later on
function flatten(rawData: any) {
  var idArray: string[] = []
  for (let i = 0; i < rawData.length; i++) {
    for (let j = 0; j < rawData[i].event.entrants.nodes.length; j++) {
      idArray.push(rawData[i].event.entrants.nodes[j].participants[0].player.id)
    }
  }

  return idArray
}

async function createRawData(rawData: any[], slug: string, apiKey: string) {
  var pages = 1;
  for (let i = 1; i <= pages; i++) {
    let newData = await getCompetitorsByPage(slug, apiKey, i)
    pages = newData.event.entrants.pageInfo.totalPages
    rawData.push(newData)
  }

  return rawData
}

//some events have too many competitors, so you can't get them all from a single call
//the excess players get put on another page, which gets passed as a variable
export async function getCompetitorsByPage(slug: string, apiKey: string, page: number) {
  const query = `query EventEntrants($eventSlug: String,$page:Int!) 
    {
      event(slug:$eventSlug) 
      {
        entrants(query: 
          {
            page:$page
            perPage: 499
          }) 
          {
            pageInfo 
            {
              total
              totalPages
            }
            nodes 
            {
              participants 
              {
                gamerTag
                player
                {
                  id
                }
              }
            }
          }
      }
    }`
  const variables = {
    "eventSlug": slug,
    "page": page
  }
  const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
  return data
}
