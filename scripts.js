const localVideoEl = document.querySelector('#local-video');
const remoteVideoEl = document.querySelector('#remote-video');


let localstream ; //a var to hold the local video stream
let remotestream; //a var to hold the remote video stream

let peerConnection; // the peer connection that the two clients use to talk

//STUN SERVERS
let peerConfiguration = {
    iceServers:[
        {
            urls:[
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

//When a client initates the call
const call = async e =>{

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        // audio:true
    });

    localVideoEl.srcObject = stream;

    localstream =stream; //overrides
    //peer connection is all set with our STUN servers sent over
    await createPeerConnection();

    //create offer time! {SDP=>Exchange info}
    try{
        console.log("Creating offer ....")
        const offer = await peerConnection.createOffer();

        console.log(offer)

    }catch(err){
        console.log(err)
    }

}

const createPeerConnection =  ()=>{
    return new Promise (async(resolve,reject)=>{
    //RTCPeerConnection is the thing that creates the connection
    //we can pass a config object and that config object can contain stun servers
    //which will fetch us the ICE Candidates 


    peerConnection = await new RTCPeerConnection(peerConfiguration)

        localstream.getTracks().forEach(track=>{
            peerConnection.addTrack(track,localstream)
        })


    peerConnection.addEventListener('icecandidate',e=>{
        console.log('.....ice candidate found!.......')
        console.log(e)
    })

    resolve();

    })
}


document.querySelector('#call').addEventListener('click',call)