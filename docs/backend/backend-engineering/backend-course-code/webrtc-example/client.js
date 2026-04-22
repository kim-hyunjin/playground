// DOM elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const roomIdInput = document.getElementById('roomId');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const leaveBtn = document.getElementById('leaveBtn');
const muteBtn = document.getElementById('muteBtn');
const videoBtn = document.getElementById('videoBtn');
const statusDiv = document.getElementById('status');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// WebRTC configuration
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// Global variables
let socket;
let localStream;
let peerConnections = {}; // Map of userId -> RTCPeerConnection
let dataChannels = {}; // Map of userId -> RTCDataChannel
let currentRoom = null;
let isAudioMuted = false;
let isVideoOff = false;

// Initialize the application
async function init() {
  try {
    // Connect to signaling server
    socket = io();
    
    // Set up socket event listeners
    setupSocketListeners();
    
    // Set up UI event listeners
    setupUIListeners();
    
    // Get local media stream
    localStream = await navigator.mediaDevices.getUserMedia({ 
      audio: true, 
      video: true 
    });
    
    // Display local video
    localVideo.srcObject = localStream;
    
    // Enable UI controls
    createBtn.disabled = false;
    joinBtn.disabled = false;
    
    updateStatus('Ready to connect');
  } catch (error) {
    console.error('Error initializing:', error);
    updateStatus(`Error: ${error.message}`);
  }
}

// Set up socket event listeners
function setupSocketListeners() {
  // Room events
  socket.on('room-created', handleRoomCreated);
  socket.on('room-joined', handleRoomJoined);
  socket.on('user-joined', handleUserJoined);
  socket.on('user-left', handleUserLeft);
  
  // WebRTC signaling events
  socket.on('offer', handleOffer);
  socket.on('answer', handleAnswer);
  socket.on('ice-candidate', handleIceCandidate);
  
  // Error events
  socket.on('error', (message) => {
    console.error('Server error:', message);
    updateStatus(`Error: ${message}`);
  });
  
  // Connection events
  socket.on('connect', () => {
    console.log('Connected to signaling server');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from signaling server');
    updateStatus('Disconnected from server');
    handleLeaveRoom();
  });
}

// Set up UI event listeners
function setupUIListeners() {
  createBtn.addEventListener('click', handleCreateRoom);
  joinBtn.addEventListener('click', handleJoinRoom);
  leaveBtn.addEventListener('click', handleLeaveRoom);
  muteBtn.addEventListener('click', toggleMute);
  videoBtn.addEventListener('click', toggleVideo);
  sendBtn.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Create a new room
function handleCreateRoom() {
  const roomId = roomIdInput.value.trim() || generateRoomId();
  roomIdInput.value = roomId;
  
  socket.emit('create-room', roomId);
  updateStatus('Creating room...');
}

// Join an existing room
function handleJoinRoom() {
  const roomId = roomIdInput.value.trim();
  
  if (!roomId) {
    updateStatus('Please enter a room ID');
    return;
  }
  
  socket.emit('join-room', roomId);
  updateStatus('Joining room...');
}

// Handle room created event
function handleRoomCreated(roomId) {
  currentRoom = roomId;
  updateStatus(`Room created: ${roomId}`);
  
  // Update UI
  createBtn.disabled = true;
  joinBtn.disabled = true;
  leaveBtn.disabled = false;
  
  // No need to create peer connection yet, wait for another user to join
}

// Handle room joined event
function handleRoomJoined(roomId, existingParticipants) {
  currentRoom = roomId;
  updateStatus(`Joined room: ${roomId} with ${existingParticipants.length} existing participants`);
  
  // Update UI
  createBtn.disabled = true;
  joinBtn.disabled = true;
  leaveBtn.disabled = false;
  
  // Create peer connections with all existing participants
  existingParticipants.forEach(peerId => {
    createPeerConnection(peerId);
    createDataChannel(peerId);
    createAndSendOffer(peerId);
  });
}

// Handle user joined event
function handleUserJoined(userId) {
  updateStatus(`User ${userId.substring(0, 4)}... joined the room`);
  
  // We don't need to create a connection here
  // The new user will create connections with all existing users
  // and send offers to them
}

// Handle user left event
function handleUserLeft(userId) {
  updateStatus(`User ${userId.substring(0, 4)}... left the room`);
  
  // Close the specific peer connection
  closePeerConnection(userId);
  
  // Check if we still have any open data channels
  const anyChannelOpen = Object.values(dataChannels).some(
    channel => channel.readyState === 'open'
  );
  
  // Disable send button if no open channels
  if (!anyChannelOpen) {
    sendBtn.disabled = true;
  }
}

// Leave the current room
function handleLeaveRoom() {
  if (currentRoom) {
    socket.emit('leave-room', currentRoom);
    
    // Close all peer connections
    closePeerConnection(); // No parameter means close all
    
    // Update UI
    createBtn.disabled = false;
    joinBtn.disabled = false;
    leaveBtn.disabled = true;
    sendBtn.disabled = true;
    messageInput.disabled = true;
    
    currentRoom = null;
    updateStatus('Left the room');
  }
}

// Create a WebRTC peer connection for a specific peer
function createPeerConnection(peerId) {
  // Close existing connection for this peer if it exists
  closePeerConnection(peerId);
  
  // Create a new connection
  const peerConnection = new RTCPeerConnection(configuration);
  peerConnections[peerId] = peerConnection;
  
  // Add local stream tracks to the connection
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });
  
  // Set up event handlers
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        target: peerId,
        candidate: event.candidate
      });
    }
  };
  
  peerConnection.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      // Create or get video element for this peer
      let videoElement = document.getElementById(`remote-video-${peerId}`);
      
      if (!videoElement) {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'remote-video-container';
        videoContainer.id = `remote-video-container-${peerId}`;
        
        const videoLabel = document.createElement('h3');
        videoLabel.textContent = `Peer ${peerId.substring(0, 4)}...`;
        
        videoElement = document.createElement('video');
        videoElement.id = `remote-video-${peerId}`;
        videoElement.autoplay = true;
        videoElement.playsinline = true;
        
        videoContainer.appendChild(videoLabel);
        videoContainer.appendChild(videoElement);
        
        document.getElementById('remoteVideosContainer').appendChild(videoContainer);
      }
      
      videoElement.srcObject = event.streams[0];
    }
  };
  
  peerConnection.ondatachannel = (event) => {
    dataChannels[peerId] = event.channel;
    setupDataChannel(peerId);
  };
  
  console.log(`Peer connection created for ${peerId}`);
  return peerConnection;
}

// Create a data channel for chat with a specific peer
function createDataChannel(peerId) {
  if (peerConnections[peerId]) {
    const dataChannel = peerConnections[peerId].createDataChannel('chat');
    dataChannels[peerId] = dataChannel;
    setupDataChannel(peerId);
    console.log(`Data channel created for peer ${peerId}`);
    return dataChannel;
  }
  return null;
}

// Set up data channel event handlers for a specific peer
function setupDataChannel(peerId) {
  const dataChannel = dataChannels[peerId];
  if (!dataChannel) return;
  
  dataChannel.onopen = () => {
    console.log(`Data channel opened for peer ${peerId}`);
    sendBtn.disabled = false;
    messageInput.disabled = false;
  };
  
  dataChannel.onclose = () => {
    console.log(`Data channel closed for peer ${peerId}`);
    // Only disable send button if all data channels are closed
    const anyChannelOpen = Object.values(dataChannels).some(
      channel => channel.readyState === 'open'
    );
    if (!anyChannelOpen) {
      sendBtn.disabled = true;
      messageInput.disabled = true;
    }
  };
  
  dataChannel.onmessage = (event) => {
    const message = event.data;
    // Use the first 4 characters of the peer ID as the sender name
    addMessageToChat(`Peer ${peerId.substring(0, 4)}...`, message);
  };
}

// Create and send an offer to a specific peer
async function createAndSendOffer(peerId) {
  const peerConnection = peerConnections[peerId];
  if (!peerConnection) return;
  
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    
    socket.emit('offer', {
      target: peerId,
      offer: offer
    });
    
    console.log(`Offer sent to ${peerId}`);
  } catch (error) {
    console.error(`Error creating offer for ${peerId}:`, error);
  }
}

// Handle an incoming offer
async function handleOffer(data) {
  const sourceId = data.source;
  
  // Create peer connection if it doesn't exist
  if (!peerConnections[sourceId]) {
    createPeerConnection(sourceId);
  }
  
  const peerConnection = peerConnections[sourceId];
  
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    socket.emit('answer', {
      target: sourceId,
      answer: answer
    });
    
    console.log(`Answer sent to ${sourceId}`);
  } catch (error) {
    console.error(`Error handling offer from ${sourceId}:`, error);
  }
}

// Handle an incoming answer
async function handleAnswer(data) {
  const sourceId = data.source;
  const peerConnection = peerConnections[sourceId];
  
  if (!peerConnection) {
    console.error(`Received answer from ${sourceId} but no peer connection exists`);
    return;
  }
  
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    console.log(`Answer from ${sourceId} received and set`);
  } catch (error) {
    console.error(`Error handling answer from ${sourceId}:`, error);
  }
}

// Handle an incoming ICE candidate
async function handleIceCandidate(data) {
  const sourceId = data.source;
  const peerConnection = peerConnections[sourceId];
  
  if (!peerConnection) {
    console.error(`Received ICE candidate from ${sourceId} but no peer connection exists`);
    return;
  }
  
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    console.log(`ICE candidate from ${sourceId} added`);
  } catch (error) {
    console.error(`Error handling ICE candidate from ${sourceId}:`, error);
  }
}

// Close a specific peer connection or all peer connections
function closePeerConnection(peerId = null) {
  if (peerId) {
    // Close specific peer connection
    if (dataChannels[peerId]) {
      dataChannels[peerId].close();
      delete dataChannels[peerId];
    }
    
    if (peerConnections[peerId]) {
      peerConnections[peerId].close();
      delete peerConnections[peerId];
    }
    
    // Remove the video element
    const videoContainer = document.getElementById(`remote-video-container-${peerId}`);
    if (videoContainer) {
      videoContainer.remove();
    }
    
    console.log(`Closed peer connection with ${peerId}`);
  } else {
    // Close all peer connections
    Object.keys(dataChannels).forEach(id => {
      dataChannels[id].close();
    });
    
    Object.keys(peerConnections).forEach(id => {
      peerConnections[id].close();
    });
    
    // Clear the containers
    dataChannels = {};
    peerConnections = {};
    
    // Remove all remote videos
    const remoteVideosContainer = document.getElementById('remoteVideosContainer');
    remoteVideosContainer.innerHTML = '';
    
    console.log('Closed all peer connections');
  }
}

// Toggle audio mute
function toggleMute() {
  if (localStream) {
    const audioTracks = localStream.getAudioTracks();
    
    if (audioTracks.length > 0) {
      isAudioMuted = !isAudioMuted;
      audioTracks[0].enabled = !isAudioMuted;
      muteBtn.textContent = isAudioMuted ? 'Unmute' : 'Mute';
    }
  }
}

// Toggle video on/off
function toggleVideo() {
  if (localStream) {
    const videoTracks = localStream.getVideoTracks();
    
    if (videoTracks.length > 0) {
      isVideoOff = !isVideoOff;
      videoTracks[0].enabled = !isVideoOff;
      videoBtn.textContent = isVideoOff ? 'Video On' : 'Video Off';
    }
  }
}

// Send a chat message to all connected peers
function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  let messageSent = false;
  
  // Send to all open data channels
  Object.entries(dataChannels).forEach(([peerId, channel]) => {
    if (channel.readyState === 'open') {
      channel.send(message);
      messageSent = true;
    }
  });
  
  if (messageSent) {
    addMessageToChat('You', message);
    messageInput.value = '';
  } else {
    updateStatus('No open connections to send message');
  }
}

// Add a message to the chat display
function addMessageToChat(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${sender}: ${message}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Update the status display
function updateStatus(message) {
  statusDiv.textContent = message;
}

// Generate a random room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

// Initialize the application when the page loads
window.addEventListener('load', init);