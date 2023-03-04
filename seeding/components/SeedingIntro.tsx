import styles from '/styles/Seeding.module.css'
import SeedingFooter from './SeedingFooter'
//props passed from previous step
interface props {
    page:number;
    setPage:(page:number) => void;
      
}
export default function SeedingIntro({page,setPage}:props)
{
    function handleSubmit()
    {
        setPage(page+1)
    }
    return(

        <div>
            <div className={styles.upperBody}>
                <div className={styles.bodied}>
                    <div className={styles.bigDiv}>
                        <div className={styles.leftDiv}>
                            <h1 className={styles.seedHeading}>SmashBase Autoseeder</h1>
                            <p className={styles.seedSubheading}>Smash seeding done&nbsp;<i> excellent. </i></p>
                        </div>
                        <div className={styles.rightDiv}>
                            <p className={styles.seedPara}>
                                This tool automatically seeds your tournament while taking: 
                                skill, location, play history, and other variables into account.
                                <br></br>
                                Questions? Visit our FAQ or join the <a href='discord.gg/yyjMEHmBtg'>SmashBase Discord!</a>  
                            </p>
                        </div>
                       
                    </div> 
                    <div className={styles.lowerDiv}>
                            <p>This process should take about 5 minutes.</p> 
                    </div>
                  
                
        
                <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit}  ></SeedingFooter>
                </div>
            
          </div>
        </div>
 
    )
}