const webSocket = new WebSocket("wss://web-rtc-call-app.herokuapp.com:");
var peerConn;
var dc;
navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    webSocket.onmessage = (event) => {
        handleSignallingData(JSON.parse(event.data))
    }
    
    function handleSignallingData(data) {
        switch (data.type) {
            case "answer":
                peerConn.setRemoteDescription(data.answer)
                break
            case "candidate":
                peerConn.addIceCandidate(data.candidate)
        }
    }
    
    let username
    function sendUsername() {
    
        username = document.getElementById("username-input").value
        sendData({
            type: "store_user"
        })
        startCall()
    }
    
    function sendData(data) {
        data.username = username
        webSocket.send(JSON.stringify(data))
    }
    
    
    var localStream
    var peerConn
    var dc
    function startCall() {
        document.body.requestFullscreen();
        document.getElementById("video-call-div")
        .style.display = "inline"
    
        navigator.getUserMedia({
            video: {
                frameRate: 24,
                width: {
                    min: 480, ideal: 1280, max: 1280
                },
                aspectRatio: 1.7777777778
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
    
            peerConn = new RTCPeerConnection(configuration);

            dc = peerConn.createDataChannel("channel")
            dc.onmessage = e=> recievemessage(e.data);
            dc.onopen =e=> dc.send("You are now connected");
            dc.onclose=e=>alert("User ended the call")

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
    
    function createAndSendOffer() {
        peerConn.createOffer((offer) => {
            sendData({
                type: "store_offer",
                offer: offer
            })
    
            peerConn.setLocalDescription(offer)
        }, (error) => {
            console.log(error)
        })
    }




let isAudio=true;

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
    document.exitFullscreen()
     peerConn.close();
    showCallContent();
    window.open("../index.html","_self");
}
function homepage(){
    window.open("../receiver/reciever.html","_self");
}
function indexpage(){
    window.open("../index.html","_self");
}


var displayMediaOptions = {
    video: {
        cursor:"always",
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
  };
  
  async function screenshare(){
    let newstream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    let newtrack = newstream.getTracks()[0];
    peerConn.getSenders().forEach(async s => {await s.replaceTrack(newtrack);});
    document.getElementById("local-video").srcObject = newstream

}

  function showCallContent(){
    alert("Call has been ended.")
}




  function chat(){
    document.getElementById("chat").src="../resources/chat_white_24dp.svg";

    if (document.getElementById("chatbar").style.display=="inline"){
        document.getElementById("chatbar").style.display="none";
        document.getElementById("callactiondiv").style.width="100vw";
    }
    else{
        document.getElementById("chatbar").style.display="inline";
        document.getElementById("callactiondiv").style.width="70vw";
    }
}

function sendtext(){
    var text=document.getElementById("textdata").value
    if(text==""){
        return
    }
    else{
    var element = document.createElement("li");
    var text=document.getElementById("textdata").value
    element.className="localtext"
    element.innerHTML=text;
    document.getElementById('chatlog').appendChild(element);
    dc.send(text);
    }
}

function recievemessage(txt){
    document.getElementById("chat").src="../resources/mark_chat_unread_white_48dp.svg";
    var element = document.createElement("li");
    element.className="localtextr"
    element.innerHTML=txt;
    document.getElementById('chatlog').appendChild(element);  
}