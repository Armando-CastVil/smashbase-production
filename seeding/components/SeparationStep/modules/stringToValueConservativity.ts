export default function stringToValueConservativity(str: string): number {
    switch (str) {
        case "low":
            return 15;
        case "moderate":
            return 30;
        case "high":
            return 60;
        default:
            throw new Error('Bad Conservativity Value')
    }
}