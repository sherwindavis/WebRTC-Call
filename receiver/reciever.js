const webSocket = new WebSocket("wss://web-rtc-call-app.herokuapp.com")

navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

                       webSocket.onmessage = (event) => {
                        handleSignallingData(JSON.parse(event.data))
                    }
                    
                    function handleSignallingData(data) {
                        switch (data.type) {
                            case "offer":
                                peerConn.setRemoteDescription(data.offer)
                                createAndSendAnswer()
                                break
                            case "candidate":
                                peerConn.addIceCandidate(data.candidate)
                        }
                    }
                    
                    function createAndSendAnswer () {
                        peerConn.createAnswer((answer) => {
                            peerConn.setLocalDescription(answer)
                            sendData({
                                type: "send_answer",
                                answer: answer
                            })
                        }, error => {
                            console.log(error)
                        })
                    }
                    
                    function sendData(data) {
                        data.username = username
                        webSocket.send(JSON.stringify(data))
                    }
                    
                    
                    let localStream
                    let peerConn
                    let username
                    
                    function joinCall() {
                    
                        username = document.getElementById("username-input").value
                    
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
                    
    let configuration={
        iceservers:[
            {
                "urls":[
                "stun: stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302"]
            }
        ]
    }
    peerConn=new RTCPeerConnection()
    peerConn.addStream(localStream)
    peerConn.onaddstream=(e)=>{
        document.getElementById("remote-video")
        .srcObject=e.stream

    }
    peerConn.onicecandidate=((e)=> {
        if(e.candidate==null)
            return
        sendData({
            type:"send_candidate",
            candidate:e.candidate
        })
    
    })

    sendData({
        type:"join-call"
    })

},(error)=>{
    console.log(error)
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
let isAudio= true
function muteaudio(){
    isAudio=!isAudio;
    localStream.getAudioTracks()[0].enabled=isAudio
    if(isAudio==true){
        document.getElementById("muteaudio").src="../resources/mute.svg";
    }
    else{
        document.getElementById("muteaudio").src="../resources/unmute.svg";
    }
    }

let isVideo=true
function mutevideo(){
    isVideo=!isVideo;
localStream.getVideoTracks()[0].enabled=isVideo
if(isVideo==true){
    document.getElementById("cam").src="../resources/cam.svg";
}
else{
    document.getElementById("cam").src="../resources/camdisable.svg";
}
}
function hangup(){
    window.open("../index.html","_self");
}