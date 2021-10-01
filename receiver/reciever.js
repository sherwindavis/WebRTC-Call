const webSocket = new WebSocket("wss://dfb0-103-211-52-126.ngrok.io)

navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

webSocket.onmessage=(event)=>{
    handlesignallingdata(JSON.parse(event.data))
}
function handlesignallingdata(data){
    switch(data.type){
        case"offer":
            peerConn.setRemoteDesciption(data.offer)
            createAndSendAnswer()
            break
        case"candidate":
        peerConn.addIceCandidate(data.candidate)
    }

}
function createAndSendAnswer(){
    peerConn.createAnswer((answer)=>{
        peerConn.setLocalDescription(answer)
        sendData({
            type:"send_answer",
            answer:answer
        })
    },error=>{console.log(error)})
}


function sendData(data){
    data.username=username;
    webSocket.send(JSON.stringify(data))

}
let localStream
let peerConn
let username

function joinCall(){
    username=document.getElementById("username-input").value;
document.getElementById("video-call-div").style.display="inline";
navigator.getUserMedia({
    video:{
        frameRate:30,
        width:{
            min:480,ideal:720,max:1280
        }
    },
    audio: true
}, (stream)=>{
    document.getElementById("local-video").srcObject=stream
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
}
let isVideo=true
function mutevideo(){
    isVideo=!isVideo;
localStream.getVideoTracks()[0].enabled=isVideo

}
