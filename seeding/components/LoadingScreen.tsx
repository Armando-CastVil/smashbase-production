import styles from '/styles/LoadingScreen.module.css'
import React from 'react';
import Spinner from '@atlaskit/spinner';

interface props {
    message: string
    isVisible: boolean
}
export default function LoadingScreen({ message, isVisible }: props) {

    if (isVisible===true) 
    {
        return (
            <div className={styles.body}>
                <div className={styles.loadingContainer}>
                    <h3>{message}</h3>

                    <Spinner size={"xlarge"} appearance="invert" />

                </div>
            </div>
        )
    }
    else
    return null

}