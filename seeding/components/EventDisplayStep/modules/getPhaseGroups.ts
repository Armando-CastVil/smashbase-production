
import startGGQueryer from "../../../../pages/api/queryStartGG";

async function getPhaseGroups(slug: string, apiKey: string) {
    const query= `query EventEntrants($eventSlug: String) 
    {
      event(slug:$eventSlug) 
      {
        id
        name
        phaseGroups 
        {
          id
        }
      }
    }`
    const variables= { 
        "eventSlug":slug,
      }
      const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
      return phaseGroupDataToPhaseGroups(data)
    
  }
  function phaseGroupDataToPhaseGroups(apiData: any) {
    let tempPhaseGroupArray: number[] = [];
    console.log("apidata")
    console.log(apiData)
    if (apiData) {
      for (let i = 0; i < apiData.event.phaseGroups.length; i++) {
        tempPhaseGroupArray.push(apiData.event.phaseGroups[i].id);
      }
    } else {
      alert("no api data yet");
    }
    return tempPhaseGroupArray;
  }
  export default getPhaseGroups