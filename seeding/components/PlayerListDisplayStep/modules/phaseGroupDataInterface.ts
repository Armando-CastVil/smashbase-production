export interface phaseGroupDataInterface {
    phaseIDs: number[];
    phaseIDMap: Map<number, number[]>;
    seedIDMap: Map<number | string, number>;
    sets: any[];
}