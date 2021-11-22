
const webSocket = new WebSocket("wss://web-rtc-call-app.herokuapp.com")
var peerConn
var localStream

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
                    
                    
                    var localStream
                    var peerConn
                    let username
                    
                    function joinCall() {
                        document.body.requestFullscreen();
                        username = document.getElementById("username-input").value
                    
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
                    
                            peerConn = new RTCPeerConnection(configuration)
                            peerConn.ondatachannel = e=>{
                                peerConn.dc=e.channel;
                                peerConn.dc.onmessage=e=>recievemessage(e.data);
                                peerConn.dc.onopen=e=> peerConn.dc.send("Connection opened")
                                peerConn.dc.onclose=e=>alert("User ended the call")
                            }

                            peerConn.addStream(localStream)
                    
                            peerConn.onaddstream = (e) => {
                                document.getElementById("remote-video").srcObject = e.stream
                            }
                    
                            peerConn.onicecandidate = ((e) => {
                                if (e.candidate == null)
                                    return
                                
                                sendData({
                                    type: "send_candidate",
                                    candidate: e.candidate
                                })
                            })
                    
                            sendData({
                                type: "join_call"
                            })
                    
                        }, (error) => {
                            console.log(error)
                        })
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
    document.exitFullscreen()
    peerConn.close();
    showCallContent();
    window.open("../index.html","_self");
}
function homepage(){
    window.open("../sender/sender.html","_self");
}
function indexpage(){
    window.open("../index.html","_self");
}
function showCallContent(){
    alert(" Call is ended")
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
  let isShare= false
  async function screenshare(){
    let newstream
    let newtrack
    if(isShare==false){
    newstream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    newtrack = newstream.getTracks()[0];
    peerConn.getSenders().forEach(async s => { await s.replaceTrack(newtrack);});
    document.getElementById("local-video").srcObject = newstream
    isShare=true
    }
    else{
    peerConn.getSenders().forEach(track => track.stop());
    let newtracks= localStream.getTracks()[0];
    peerConn.getSenders().forEach(async s => { await s.replaceTrack(newtracks);});
    document.getElementById("local-video").srcObject = localStream
    isShare=false
    }
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
    element.className="localtext"
    element.innerHTML=text;
    document.getElementById('chatlog').appendChild(element);
    peerConn.dc.send(text);
    }
}
function recievemessage(txt){
    document.getElementById("chat").src="../resources/mark_chat_unread_white_48dp.svg";
    var element = document.createElement("li");
    element.className="localtextr"
    element.innerHTML=txt;
    document.getElementById('chatlog').appendChild(element);  
}