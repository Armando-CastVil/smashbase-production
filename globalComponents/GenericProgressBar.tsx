
import styles from "../styles/ProgressBar.module.css"

import ProgressBar from '@atlaskit/progress-bar';
interface props {
    completed: number,
    total: number
}

export default function GenericProgressBar({ completed, total }: props) {






    return (

        <div className={styles.body}>
            <div className={styles.loadingContainer}>
                <ProgressBar
                    appearance="inverse"
                    ariaLabel={`${completed} players out of ${total} Have Been Fetched`}
                    value={completed / total}
                />
                {total===0 ? (
                    <h3>Connecting to the Database...</h3>
                ) : <h3>{`${completed} players out of ${total} Have Been Fetched`}</h3>}
                

            </div>
        </div>

    );
}
