import styles from '/styles/Seeding.module.css'
import Button from '@atlaskit/button/standard-button';
interface props {
    slug:string|undefined;
}
export default function SeedingOutro({slug}:props)
{
    let tourneyPage:string="https://start.gg/"+slug
    
    return(

        <div>
            <div className={styles.upperBody}>
                <div className={styles.bodied}>
                    <div className={styles.headingDiv}>
                    <h1 className={styles.seedHeading}>Seeding Complete!</h1>
                    <br></br>
                    <p className={styles.seedSubheading}>If there are any issues with the seeding, please leave us feedback in our&nbsp;<a href="discord.gg/yyjMEHmBtg"> Discord </a></p>
                    </div>
                    <div className={styles.seedAppFooter}>
                        <div style={{display:"flex",  flexDirection:"row", alignItems:"center",marginRight:"auto",marginLeft:"auto",gap:"5%"}}>
                        <a href="https://beta.smashbase.gg" target="_blank"><Button appearance="primary"> Return to Home </Button></a> 
                        <a href={tourneyPage} target="_blank"><Button appearance="primary"> Go to Start.GG page </Button></a>
                        </div>
                    </div>
                </div>
            
          </div>
          
        </div>
 
    )
}