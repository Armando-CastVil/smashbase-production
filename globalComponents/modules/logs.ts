import queryFirebase from "./queryFirebase";
import writeToFirebase from "./writeToFirebase";

const logs:[number,string][] = []

export function log(data: any) {
    let message:string = JSON.stringify(data)
    if(typeof data === 'string') message = data as string;
    logs.push([Date.now(),message])
    console.log(message)
}
const logsReported = false
export async function reportLogs() {
    if(logsReported) return;
    let index = parseInt(await queryFirebase('/errors/length'))
    writeToFirebase('/errors/'+index,logs.map(tuple => ({'time':tuple[0],'message':tuple[1]})))
    writeToFirebase('/errors/length',index+1)
    console.log('Report Sent to Firebase')
}
