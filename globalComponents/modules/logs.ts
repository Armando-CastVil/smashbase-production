export const logs:[number,string][] = []

export function log(data: any) {
    let message:string = JSON.stringify(data)
    logs.push([Date.now(),message])
    console.log(message)
}
