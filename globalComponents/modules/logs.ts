export const logs:string[] = []

export function log(data: any) {
    let message:string = JSON.stringify(data)
    logs.push(message)
    console.log(message)
}
