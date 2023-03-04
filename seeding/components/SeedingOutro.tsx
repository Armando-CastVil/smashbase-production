import styles from '/styles/Seeding.module.css'
import Button from '@atlaskit/button/standard-button';

//props passed from top level component(seeding.tsx)
interface props {
eventSlug:string    
}

export default function SeedingOutro({eventSlug}:props)
{
    
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
                            <Button appearance="primary"> <a href="beta.smashbase.gg"> Return to Home </a> </Button>
                            <Button appearance="primary"> <a href="start.gg">Go to Start.GG</a></Button>
                        </div>
                    </div>
                </div>
            
          </div>
          
        </div>
 
    )
}