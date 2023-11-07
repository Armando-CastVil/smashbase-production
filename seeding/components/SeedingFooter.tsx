import { ProgressIndicator } from '@atlaskit/progress-indicator';
import Button from '@atlaskit/button/standard-button';
import styles from '/styles/Seeding.module.css'
import { useState } from 'react';
import { log } from '../../globalComponents/modules/logs';

interface props {
    page:number;
    setPage:(page:number) => void;
    handleSubmit?:()=>void;
    skipToLast?:()=>void;
    isDisabled?:boolean;
}
export default function SeedingFooter({page,setPage,handleSubmit,skipToLast,isDisabled}:props)
{
    const [values] = useState(['zeroth','first', 'second', 'third','fourth','fifth',"sixth"]);
    const handlePrev = () => {
        log('Hit Previous on page '+page)
        setPage(page - 1);
    };
    const handleNext = () => {
        log('Hit Next on page '+page)
        if(handleSubmit!=undefined)
        {
            handleSubmit()
        }
        
            
    };
    let next:string="Next"

    if(page==5)
    {
        next="Submit"
    }
    
return(
    <div style={{alignItems:"center"}} className={styles.seedAppFooter}>
        <div style={{display:"flex",  flexDirection:"row", alignItems:"center",marginRight:"auto",marginLeft:"auto"}}>
            <Button
                isDisabled={page === 0}
                onClick={handlePrev}
                appearance="primary"
            >
                Previous
            </Button>
            <div style={{padding:"0px 30px 0px"}}>
                <ProgressIndicator
                appearance="inverted"
                selectedIndex={page}
                values={values}
                />
            </div>
            <Button 
            onClick={handleNext}
            appearance="primary"
            isDisabled={isDisabled}
            >
            {next}
            </Button>
        </div> 
              
    </div>
)
}