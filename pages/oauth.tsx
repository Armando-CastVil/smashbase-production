export {}
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import globalStyles from '../styles/GlobalSeedingStyles.module.css'
import { useEffect, useState } from 'react';
import handleCode from './api/handleCode';

const Oauth: NextPage = () => {
    const router = useRouter()
    const { code } = router.query
    const [codeValue, setCodeValue] = useState<string | null>(null);

    useEffect(() => {
        // Check if 'code' is available in the query parameter
        if (code) {
            // Set the 'codeValue' state to the value of 'code'
            setCodeValue(code as string);
            handleCode(code)
        }
    }, [code]);

    return (
        <div className={globalStyles.body}>
            <h1>OAUTH PAGE</h1>
            {codeValue ? (
                <p>Code: {codeValue}</p>
            ) : (
                <p>No code available.</p>
            )}
        </div>
    )
}
export default Oauth
