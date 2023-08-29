import { FC } from "react";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import { RowType } from "@atlaskit/dynamic-table/dist/types/types";
import DynamicTable from "@atlaskit/dynamic-table";
import { selectedBoxIndex } from "../modules/EventDisplayStepIndex";
import {CreateCheckboxes} from "../modules/EventDisplayStepIndex";
import { TourneyEvent } from "../../../definitions/seedingTypes";



interface props {
    events: TourneyEvent[];
    checkBoxes:any[];
    setCheckBoxes:(checkBoxes:any[])=>void;

  }
export default function CreateEventTable({events,checkBoxes,setCheckBoxes}:props) {

    
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
    if (selectedBoxIndex(checkBoxes)!=index)
    {
      setCheckBoxes(CreateCheckboxes(events,index));
    }
    else
    {
      setCheckBoxes(CreateCheckboxes(events,-1));
    }
    
  }

    //creates the heading for the dynamic table
    const createHead = (withWidth: boolean) => {
        return {
          cells: [
            {
              key: "Event Name",
              content: <a className={globalStyles.seedHead}>Tournament Name</a>,
              isSortable: true,
              width: withWidth ? 30 : undefined,
            },
            {
              key: "Event Entrant Count",
              content: <a className={globalStyles.tableHead}>Number of Entrants</a>,
              isSortable: true,
              width: withWidth ? 50 : undefined,
            },
            {
              key: "Status",
              content: <a className={globalStyles.tableHead}>Selected Status </a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 50 : undefined,
            },
          ],
        };
      };

    //sets the createHead function to true
    const head = createHead(true);
    
    const rows = events.map((event: any, index: number) => ({
    key: `row-${index}-${event.name}`,
    isHighlighted: false,
    cells: [
      {
        key: createKey(event.name),
        content: (
          <NameWrapper>
            <a className={globalStyles.seedRow}>{event.name}</a>
          </NameWrapper>
        ),
      },
      {
        key: createKey(event.name) + index,
        content: (
          <NameWrapper>
            <a className={globalStyles.tableRow}>{event.numEntrants}</a>
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