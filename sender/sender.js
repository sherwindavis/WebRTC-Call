const webSocket = new WebSocket("wss://web-rtc-call-app.herokuapp.com")

webSocket.onmessage=(event)=>{
    handlesignallingdata(JSON.parse(event.data))
}
function handlesignallingdata(data){
    switch(data.type){
        case"answer":
            peerConn.setRemoteDesciption(data.answer)
            break
        case"candidate":
        peerConn.addIceCandidate(data.candidate)
    }

}


function sendusername(){
    username = document.getElementById("username-input").value
    sendData({
        type:"store_user",
    })
}
function sendData(data){
    data.username=username;
    webSocket.send(JSON.stringify(data))

}
let localStream

function startCall() {
    document.getElementById("video-call-div")
    .style.display = "inline"

    navigator.getUserMedia({
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    }, (stream) => {
        localStream = stream
        document.getElementById("local-video").srcObject = localStream

        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                }
            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        peerConn.addStream(localStream)

        peerConn.onaddstream = (e) => {
            document.getElementById("remote-video")
            .srcObject = e.stream
        }

        peerConn.onicecandidate = ((e) => {
            if (e.candidate == null)
                return
            sendData({
                type: "store_candidate",
                candidate: e.candidate
            })
        })

        createAndSendOffer()
    }, (error) => {
        console.log(error)
    })
}

function createAndSendOffer(){
peerConn.createOffer((offer) => {
    sendData({
        type:"store_offer",
        offer: offer
    })
    peerConn.setLocalDescription(offer)
},(error)=>{console.log(error)
})
}

function chat(){
    if (document.getElementById("chatbar").style.display=="inline"){
        document.getElementById("chatbar").style.display="none";
        document.getElementById("callactiondiv").style.width="100vw";
    }
    else{
        document.getElementById("chatbar").style.display="inline";
        document.getElementById("callactiondiv").style.width="70vw";
    }
}
let isAudio=true;
function muteaudio(){
isAudio=!isAudio;
localStream.getAudioTracks()[0].enabled=isAudio
}
let isVideo=true
function mutevideo(){
    isVideo=!isVideo;
localStream.getVideoTracks()[0].enabled=isVideo

}