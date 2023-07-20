import type { NextPage } from 'next'
import { useState } from "react";
import globalStyles from '../styles/GlobalSeedingStyles.module.css'
import Sidebar from '../globalComponents/Sidebar'
import SeedingSteps from '../seeding/components/SeedingSteps/SeedingSteps';

const Seeding: NextPage = () => {
    //save data as states
    const [page, setPage] = useState<number>(0);
    return (
        <div className={globalStyles.body}>
            <div className={globalStyles.container}>
                <Sidebar />
                <div className={globalStyles.content}>
                    <title>SmashBase Seeding Tool</title>
                    <meta name="description" content=""></meta>
                    <meta name="generator" content="Hugo 0.104.2"></meta>
                    <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1" />
                    <div><SeedingSteps page={page} setPage={setPage}/></div>
                </div>
            </div>
        </div>
    )
}
export default Seeding