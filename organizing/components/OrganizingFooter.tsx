import { ProgressIndicator } from '@atlaskit/progress-indicator';
import Button from '@atlaskit/button/standard-button';
import styles from '/styles/Seeding.module.css'
import { useState } from 'react';

interface props {
    page:number;
    setPage:(page:number) => void;
    handleSubmit?:()=>void;
    isDisabled?:boolean;
}
export default function OrganizingFooter({page,setPage,handleSubmit,isDisabled}:props)
{
    const [values] = useState(['zeroth','first', 'second', 'third']);
    const handlePrev = () => {
        setPage(page - 1);
    };
    const handleNext = () => {
        if(handleSubmit!=undefined)
        {
            handleSubmit()
        }
        
            
    };
    let next:string="Next"


    
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