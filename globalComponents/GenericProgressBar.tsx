import styles from "../styles/ProgressBar.module.css";
import ProgressBar from '@atlaskit/progress-bar';

interface props {
  completed: number,
  total: number,
  connectingMessage: string,
  message: string
}

export default function GenericProgressBar({ completed, total, message, connectingMessage }: props) {
  console.log("generic progress bar values:" + completed+"///"+total);

  const value = total === 0 ? 0 : completed / total;

  return (
    <div className={styles.body}>
      <div className={styles.loadingContainer}>
        <ProgressBar
          appearance="inverse"
          ariaLabel={`${completed} players out of ${total} Have Been Fetched`}
          value={value}
        />
        {completed === 0 ? (
          <h3>{connectingMessage}</h3>
        ) : (
          <h3>{message}</h3>
        )}
      </div>
    </div>
  );
}