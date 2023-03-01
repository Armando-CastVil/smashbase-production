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
                    <h1 className={styles.seedingIntroTitle}>SmashBase Autoseeder</h1>
                    <p className={styles.caption}>The most accurate seeding on the planet.</p>
                    <div className={styles.smallCaption}>
                        <p >
                        This tool automatically seeds your tournament while taking: 
                        skill, location, play history, and other variables into account.
                        <br></br>
                        Questions? Visit our FAQ or join the SmashBase Discord!
                        </p>
                    </div>
                <p className={styles.bottomCaption}>This process should take about 5 minutes.</p> 
        
                <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit}  ></SeedingFooter>
                </div>
            
          </div>
        </div>
 
    )
}