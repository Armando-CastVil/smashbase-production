import React, { useState } from "react";
import { Player } from "../../../definitions/seedingTypes";
import upArrow from "../../../../assets/seedingAppPics/upArrow.png";
import downArrow from "../../../../assets/seedingAppPics/downArrow.png";
import { StaticImageData } from "next/image";
import Image from "next/image";

interface Props {
    initialSeed: number;
    finalSeed: number;
}

export default function SeedingChangesHandler({ initialSeed, finalSeed }: Props) {
    let seedChange= (initialSeed - finalSeed)
    const zero: number = 0;
    

    let iconSrc: StaticImageData | undefined; // Set a default value

    if (seedChange > 0) {
        iconSrc = upArrow;
    } else if (seedChange < 0) {
        iconSrc = downArrow;
    }

    return (
        <div>
            {seedChange === zero ? (
                <p></p>
            ) : (
                <div>
                    {iconSrc && ( // Check if iconSrc is defined before rendering
                        <Image
                            src={iconSrc}
                            alt="low icon"
                            width={15}
                            height={15}
                        />
                    )}
                    {Math.abs(seedChange)}
                </div>
            )}
        </div>
    );
}
