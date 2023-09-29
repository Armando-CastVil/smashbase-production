//all the steps are imported from index.ts at once to avoid multiple import statements
import * as seedingStepImports from "./index"
// Extract the components from the seedingComponents object using their names
const { SeedingIntro, ApiKeyStep, TournamentDisplayStep, EventDisplayStep, PlayerListDisplayStep, SeparationStep,
    FinalStep, SeedingOutro } = seedingStepImports;
const seedingStepsObject = {
    SeedingIntro,
    ApiKeyStep,
    TournamentDisplayStep,
    EventDisplayStep,
    PlayerListDisplayStep,
    SeparationStep,
    FinalStep,
    SeedingOutro
};
export default {seedingStepsObject}