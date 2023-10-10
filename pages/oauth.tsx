export {}
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import globalStyles from '../styles/GlobalSeedingStyles.module.css'

const Oauth: NextPage = () => {
    const router = useRouter()
    const { code } = router.query

    // Now, 'code' contains the value of the 'code' query parameter

    return (
        <div className={globalStyles.body}>
            <h1>OAUTH PAGE</h1>
            <p>Code: {code}</p>
        </div>
    )
}
export default Oauth
