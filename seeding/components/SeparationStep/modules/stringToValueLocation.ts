export default function stringToValueLocation(str: string): number {
    switch (str) {
        case "none":
            return 0
        case "low":
            return 15;
        case "moderate":
            return 30;
        case "high":
            return 60;
        default:
            throw new Error('Bad Location Value')
    }
}