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
        }
    },
    audio: true
}, (stream)=>{
    document.getElementById("local-video").srcObject=stream

},(error)=>{
    console.log(error)
})
}
