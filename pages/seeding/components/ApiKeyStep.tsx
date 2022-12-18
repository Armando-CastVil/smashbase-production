
import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import axios from 'axios';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    setApiKey: (apiKey: string) => void;
    setTournaments:(tournaments:Tournament[])=>void;
    
}
export default function ApiKeyStep({page,setPage,apiKey,setApiKey,setTournaments}:props)
{
   
    let hardCodedApiKey:string="0dd3566453415bf0cd2a97490bf86e6c"
    
    const  handleSubmit = async () => {
        
        await APICall(hardCodedApiKey).then(async (value)=>
        {
            
            console.log(value)
            await setTournaments(apiDataToTournaments(value))
            
        })
     }
    
    
    return(
        <div>
            
        
            <title>SmashBase Seeding Tool</title>
            <meta name="description" content=""></meta>
            <meta name="generator" content="Hugo 0.104.2"></meta>
            <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
            <link rel="canonical" href="https://getbootstrap.com/docs/5.2/examples/sign-in/"></link>
            
            
            
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossOrigin="anonymous"></script>
                <p className={styles.headingtext}> Paste your API key from ‎  <a href="www.start.gg">     Start.gg</a></p>
                <div className={styles.vimembed}>
                    <iframe src="https://player.vimeo.com/video/766883703" width="640" height="360"  allow="autoplay; fullscreen" allowFullScreen></iframe>
                </div>
                <div className={styles.formsignin}>
                    <form>
                        <div className="form-floating textfieldtext">
                            <input type="password" className="form-control" id="floatingInput" placeholder="Enter your API key here" onChange={e => setApiKey(e.target.value)}></input>
                            <label> API Key </label>
                        </div>
                    </form>
                </div>
                <button
                    onClick={() => {

                        setPage(page + 1);
                        handleSubmit();
                    }}>
                Next
                </button>
                <footer >absolutely pushing pee</footer>
                
                
             
        
        </div>
    )
}
function apiDataToTournaments(apiData:any)
{
    let tournamentArray:Tournament[]=[]
    for(let i=0;i<apiData.data.currentUser.tournaments.nodes.length;i++)
    {
    
        let name:string=apiData.data.currentUser.tournaments.nodes[i].name
        let city:string=apiData.data.currentUser.tournaments.nodes[i].city
        let url:string=apiData.data.currentUser.tournaments.nodes[i].url
        let slug:string=apiData.data.currentUser.tournaments.nodes[i].slug
        let startAt:number=apiData.data.currentUser.tournaments.nodes[i].startAt
        let imageURL=undefined
        if(apiData.data.currentUser.tournaments.nodes[i].images.length!=0)
        {
            imageURL=apiData.data.currentUser.tournaments.nodes[i].images[0].url
        }
        
        
        let tempTournament=new Tournament(name,city,url,slug,startAt,imageURL)
        tournamentArray.push(tempTournament)
    }
    return tournamentArray;
}
function APICall(apiKey:string)
{
    
    //API call
    return axios.get('api/getAdminTournaments',{params:{apiKey:apiKey}}).then(({data})=>
        {
           
            return data
        }
    )
}

