export default function calculateSoonestMonday() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek + 1;

    // Create a new Date object for the next Monday
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);

    // Set the time to 11:59 PM
    nextMonday.setHours(23, 59, 0, 0);

    return nextMonday;
}
