import Tournament from "../../../classes/Tournament";
export default interface ApiKeyStepProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    setApiKey: (apiKey: string|undefined) => void;
    setTournaments: (tournaments: Tournament[]) => void;
}