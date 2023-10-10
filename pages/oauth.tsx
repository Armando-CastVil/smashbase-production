export {}
import type { NextPage } from 'next'
import globalStyles from '../styles/GlobalSeedingStyles.module.css'

const Oauth: NextPage = () => {
    return (
        <div className={globalStyles.body}>
            <h1>OAUTH PAGE</h1>
        </div>
    )
}
export default Oauth