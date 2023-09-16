import { FC } from "react";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import { RowType } from "@atlaskit/dynamic-table/dist/types/types";
import defaultPicture from "../../../../assets/seedingAppPics/logo.jpg"
import DynamicTable from "@atlaskit/dynamic-table";
import { selectedBoxIndex } from "../modules/selectedBoxIndex";
import CreateCheckboxes from "./CreateCheckboxes";
import unixTimestampToDate from "../modules/unixTimestampToDate";
import { Tournament } from "../../../definitions/seedingTypes";
import Image from "next/image";
interface props {
    tournaments: Tournament[];
    checkBoxes: any[];
    setCheckBoxes: (checkBoxes: any[]) => void;

}
export default function CreateTournamentTable({ tournaments, checkBoxes, setCheckBoxes }: props) {

    
    //Don't know what this does but things break if we delete them
    interface NameWrapperProps {
        children: React.ReactNode;
    }

    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span>{children}</span>
    );

    //this function flips the checked box from checked to unchecked and vice versa
    //and sets all other boxes to unchecked
    function updateCheckedBox(index: number) {
        if (selectedBoxIndex(checkBoxes) != index) {
            setCheckBoxes(CreateCheckboxes(tournaments, index));
        }
        else {
            setCheckBoxes(CreateCheckboxes(tournaments, -1));
        }

    }

    //creates the heading for the dynamic table
    const createHead = (withWidth: boolean) => {
        return {
            cells: [
                {
                    key: "Tournament Name",
                    content: <p className={globalStyles.seedHead}>Tournament Name</p>,
                    isSortable: true,
                    width: withWidth ? 30 : undefined,
                },
                {
                    key: "Date",
                    content: <a className={globalStyles.tableHead}>Date </a>,
                    shouldTruncate: true,
                    isSortable: true,
                    width: withWidth ? 30 : undefined,
                },
                {
                    key: "Status",
                    content: <a className={globalStyles.tableHead}>Selected Status </a>,
                    shouldTruncate: true,
                    isSortable: true,
                    width: withWidth ? 20 : undefined,
                },
            ],
        };
    };

    //sets the createHead function to true
    const head = createHead(true);

    const rows = tournaments.map((tournament: any, index: number) => ({
        key: `row-${index}-${tournament.name}`,
        isHighlighted: false,
        cells: [
            {
                key: createKey(tournament.name) + index,
                content: (
                    <NameWrapper>
                        <Image
                            className={globalStyles.seedRow}
                            alt="tournament thumbnail"
                            src={
                                tournament.imageURL == undefined ?
                                defaultPicture :
                                tournament.imageURL
                            }
                            width={24}
                            height={24}
                        ></Image>
                        <p className={globalStyles.seedRow}>{tournament.name}</p>
                    </NameWrapper>
                ),
            },
            {
                key: tournament.startAt,
                content: (
                    <NameWrapper>
                        <a className={globalStyles.tableRow}>
                            {unixTimestampToDate(parseInt(tournament.startAt))}
                        </a>
                    </NameWrapper>
                ),
            },
            {
                key: index,
                content: <NameWrapper>{checkBoxes[index]}</NameWrapper>,
            },
        ],
    }));

    //object that includes rows and its functions
    const extendRows = (
        rows: Array<RowType>,
        onRowClick: (e: React.MouseEvent, rowIndex: number) => void
    ) => {
        return rows.map((row, index) => ({
            ...row,
            onClick: (e: React.MouseEvent) => onRowClick(e, index),
        }));
    };

    async function onRowClick(e: React.MouseEvent, rowIndex: number) {
        updateCheckedBox(rowIndex);
    }

    return (
        <DynamicTable
            head={head}
            rows={extendRows(rows, onRowClick)}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isRankable={false}
        />

    )
}

//creates a key for the table heads
function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}