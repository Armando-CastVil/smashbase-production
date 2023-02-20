import { ProgressIndicator } from '@atlaskit/progress-indicator';
import Button from '@atlaskit/button/standard-button';
import styles from '/styles/Seeding.module.css'
import { useState } from 'react';

interface props {
    page:number;
    setPage:(page:number) => void;
    handleSubmit?:()=>void;
}
export default function SeedingFooter({page,setPage,handleSubmit}:props)
{
    const [values] = useState(['first', 'second', 'third','fourth','fifth',"sixth"]);

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
                    >
                    {next}
                    </Button>
                    </div>
                
    </div>
)
}