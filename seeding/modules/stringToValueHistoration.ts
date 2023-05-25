export default function stringToValueHistoration(str: string): number {
    switch (str) {
        case "none":
            return 0
        case "low":
            return 0.5;
        case "moderate":
            return 1;
        case "high":
            return 2;
        default:
            return 1;
    }
}