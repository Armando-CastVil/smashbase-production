const whitelistedHashes = [
    "4fe851e918b4cd863608ac70d2a6529483f43e104392a2635afbb08b216bc214", //DN
    "dd7889a4e65f552c3110477d4b0715f36f4690a8d518f470944e4b7a66141c87", //AC
    "20191550f82e3e899519113982a940040dd33c700388230eaaf3219e3d0ebd38", //tomrod
    "27b42e55232a1293555d5a6e037c357e62164506b6ad6a0f18278aad8ac5b47c", //tomrod 2
    "72db1ac49bb9b545cd194d750b7f14c7420e9e1e8b9daa54ec0447e84d7e9993", //psiguy
    "ca2cd869c71a55f854c46bbcc1f5081f57c9fb32ac21e6dc4bcd896977eba00f", //cpu
    "4213c15433aebea59f43538cf31e5b99dc1f4c6f850fbd3cb3ef1a94bb91e728", //the pit
    "25dae97d1eca0033a9143a8ff1ea766192108730a2e192d0987750dcd3af04ab", //gls
    "5a1887cddd9ccbdbb2e232664b984313e650fa56f746e65f3bb24c9bcfe45cbd", //ceej
    "d7fe566a73825995f643df5d6eebf32d2ebfbbca4bf26c74349e73ff00269b2b", //casey
    "c4a1e989f406e702539ad6172e5b9ccb88960eafc78fbacf6e159a3c5f9a2a7f", //gamenight
    "d22f16c662d540a59389b3b8833934418e7f73e8178f396d70e6044a4707d5cc", //qwil
    "f47b049766c2241dd231e1f82d918da7b39a9e7ae58bad7e1d510e44b04693ae", //symbiote
    "f861ad21ceb236eb16398f482fd0689f6c7ae1d64c037b367579a51e0ecf137c", //Nito
    "2ad6daec3b6db734368e03357e20d295888e474ea8057013f3129484258f3f0c", //Nito 2
    "39737f102e9c249c2d776eebad1b5937ac745c52ec80c79100ecdc7c2aa1aea1", //cpu 2
    "55209229ad292e840d63cba8117f33df3ddca4deef08fbbd9e2a0df3d52760ed", //nito 2
    "b9e4c9dc9cbfccddc8893a9a7f238e48ff28190c98e55373c0534957ea19a1fd", //echo Pow
    "ab7cf73130836441e1809ce3074f7cd64e127dbc5380e2e9108850cb9368f2ef", // echo 2
    "89e742f350797713e4023c88eb08d4c2d60f9d08f68c147b03fa8e59c8848b26", //geo 2
    "654cd6efd73d83b8e0550d4a17816b8a637da7a011ada2fc2dcdf23615a6ca85", //norcal play
    "636ffb9145c414eedeb3c31a485b586f63e1796dde5c0559da493f0c40a73df7", // JL
    "23b1928bba5116ae96722359e3b20076e59505f3fd025af2d317b4cbb08efe6d", // Slicer
    "dd9bbbf09ed1dff075c160681d07c113b14a178677eab5165b7a561408a82868", // Casey phone
    "6bfd5d4e99d817e0d03378735ac73ec81738d2196b1fa46fb83afbc7cd4131d8", // JL 2
    "816846c712b32abe56d4904c90c7aca238b1730cc9ef7070fbcbe7d32a9f81eb", // JL 3
    "0dd7c85b0acf2c8b88814a2e7276c51301b4a2632175543f279d5c24c600ae0a", // DN 2
    "67f5d3d5799f478c7039c6e3eae1edd0f0c1568e2a9d5b0076a76f1ff87b44e2", // empty
]

export async function isWhitelisted(key: string):Promise<boolean> {
    let hashedKey = await sha256(key)
    let toReturn = whitelistedHashes.includes(hashedKey);
    if(!toReturn) console.log("hashed key: "+hashedKey)
    return toReturn;
}

export async function sha256(message:string):Promise<string> {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}