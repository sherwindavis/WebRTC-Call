var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
openFullscreen();


const webSocket = new WebSocket("")
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
function startCall(){
document.getElementById("video-call-div").style.display="inline";
navigator.getUserMedia({
    video:{
        frameRate:30,
        width:{
            min:480,ideal:720,max:1280
        },
        aspectRatio:1.85
    },
    audio: true
}, (stream)=>{
    document.getElementById("local-video").srcObject=stream

},(error)=>{
    console.log(error)
})
}