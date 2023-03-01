import styles from '/styles/Seeding.module.css'
import SeedingFooter from './SeedingFooter'
import InlineMessage from '@atlaskit/inline-message';
import Button from '@atlaskit/button/standard-button';
export default function SeedingOutro()
{
    
    return(

        <div>
            <div className={styles.upperBody}>
                <div className={styles.bodied}>
                    <h1 className={styles.outroHeading}>Seeding Complete!</h1>
                    <p className={styles.outroCaption}>If there are any issues with the seeding, please leave us feedback in our Discord</p>
                    <InlineMessage
                    appearance="confirmation"
                    iconLabel="SUCCESS!"
                    secondaryText="Seeding has been pushed successfully!"
                    >
                    <p>Seeding has been pushed successfully!</p>
                    </InlineMessage>
                    <div className={styles.seedAppFooter}>
                        <button>Return to Home</button>
                        <button>Go to Start.GG page</button>
                    </div>
                </div>
            
          </div>
          
        </div>
 
    )
}