const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const cameraSelect = document.getElementById('cameras');
const call = document.getElementById('call');
call.hidden = true;

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');
welcomeForm.addEventListener('submit', handleJoinRoom);

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

async function handleJoinRoom(e) {
  e.preventDefault();
  const input = welcomeForm.querySelector('input');
  await initCall();
  socket.emit('join_room', input.value);

  roomName = input.value;
  input.value = '';
}

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

async function getMedia(deviceId) {
  const initConfig = {
    audio: true,
    video: { facingMode: 'user' },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId
        ? {
            audio: true,
            video: { deviceId: { exact: deviceId } },
          }
        : initConfig
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameraSelectOptions();
    }
  } catch (e) {
    console.log(e);
  }
}

async function getCameraSelectOptions() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      console.log('camera', camera);
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

/*
  RTC
*/
function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    // STUN(Session Traversal Utilities for NAT)서버를 사용해 핸드폰과 컴퓨터가 서로의 공용 IP를 찾을 수 있도록 설정하기
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ], // 구글에서 제공하는 STUN서버 사용
  });

  // ice(연결 정보)가 만들어지면 peer에게 보낸다.
  myPeerConnection.addEventListener('icecandidate', (data) => {
    console.log('sent candidate');
    socket.emit('ice', data.candidate, roomName);
  });
  // peer로부터 받은 data stream 핸들링
  myPeerConnection.addEventListener('addstream', (data) => {
    console.log("Peer's Stream", data.stream);
    console.log('My Stream', myStream);
    const peerFace = document.getElementById('peerFace');
    peerFace.srcObject = data.stream;
  });
  myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
}

/*
  Camera control
*/
muteBtn.addEventListener('click', handleMuteBtn);
cameraBtn.addEventListener('click', handleCameraSwitch);
cameraSelect.addEventListener('input', handleCameraChange);

function handleMuteBtn() {
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute';
    muted = false;
  }
}

function handleCameraSwitch() {
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = 'Turn Camera Off';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Turn Camera On';
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(cameraSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    // 다른 브라우저로 보내진 비디오와 오디오 데이터를 컨트롤 하기 위해 Sender를 사용.
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === 'video');
    videoSender.replaceTrack(videoTrack);
  }
}

/*
  socket.io 이벤트 핸들링
*/
socket.on('welcome', handlePeerJoin);
socket.on('offer', handleIncomingOffer);

// 다른 브라우저로부터 answer가 오면 설정한다.
socket.on('answer', (answer) => {
  console.log('received answer', answer);
  myPeerConnection.setRemoteDescription(answer);
});

// ICE (Internet Connectivity Establishment) - 연결 정보를 수신
socket.on('ice', (ice) => {
  console.log('received ice cadidate');
  myPeerConnection.addIceCandidate(ice);
});

// 다른 브라우저가 접속하면 연결하기 위해 offer를 만들어 보내야 한다.
async function handlePeerJoin() {
  // peer가 room에 들어오면 data channel 생성
  myDataChannel = myPeerConnection.createDataChannel('chat');
  myDataChannel.addEventListener('message', handleIncomingMessage);
  console.log('made data channel');

  // peer에게 연결을 위한 offer 보냄
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log('sent the offer');
  socket.emit('offer', offer, roomName);
}

// 다른 브라우저로부터 offer가 오면 answer를 만들어 보낸다.
async function handleIncomingOffer(offer) {
  // peer가 만든 data channel 사용
  console.log('peer made datachannel');
  myPeerConnection.addEventListener('datachannel', (e) => {
    myDataChannel = e.channel;
    myDataChannel.addEventListener('message', handleIncomingMessage);
  });

  // peer가 보낸 offer를 remote에 세팅
  console.log('receive offer', offer);
  myPeerConnection.setRemoteDescription(offer);

  // peer에게 answer 보내기
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer); // 내가 보낼 answer를 local로 세팅
  socket.emit('answer', answer, roomName);
  console.log('sent the answer');
}

function handleIncomingMessage(event) {
  console.log(event.data);
}

function handleSendMessage(data) {
  myDataChannel.send(data);
}
