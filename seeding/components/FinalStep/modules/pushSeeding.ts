import { mutateSeeding, UpdatePhaseSeedInfo } from '../../../../pages/api/mutateSeeding';
import { Player } from '../../../definitions/seedingTypes';

export default async function pushSeeding(competitorSeeding:Player[], phaseId: number, apiKey: string)
{
    
    let seedMapping:UpdatePhaseSeedInfo[] = [];
    for(let i = 0; i<competitorSeeding.length; i++) {
        seedMapping.push({
            seedNum:i+1,
            seedId: competitorSeeding[i].seedID!
        })
    }
    
    let errors = await APICall(phaseId, seedMapping, apiKey);
    console.log(errors);
    return errors;
 }
    

async function APICall(phaseId: number, seedMapping: UpdatePhaseSeedInfo[], apiKey: string)
{
    //API call
    // return axios.get('api/mutateSeeding',{params:{phaseId: phaseId, seedMapping: seedMapping, apiKey: apiKey}}).then(({data})=>
    //     {
    //         console.log("mutating seeding")
    //         console.log(data.data)
    //     }
    // )
    let answer:any=await mutateSeeding({phaseId:phaseId, seedMapping: seedMapping, apiKey: apiKey})
    console.log(answer)
    return answer
    //return (await mutateSeeding({phaseId:phaseId, seedMapping: seedMapping, apiKey: apiKey})).errors;
}
