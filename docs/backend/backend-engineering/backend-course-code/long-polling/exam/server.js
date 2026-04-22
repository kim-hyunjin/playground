
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 클라이언트의 응답(res) 객체를 저장할 배열
// 새 이벤트가 발생했을 때 모든 대기 중인 클라이언트에게 응답을 보내기 위함입니다.
let clients = [];

// 새 메시지가 들어오면 이 함수를 호출하여 모든 클라이언트에게 전송합니다.
function sendEventsToAll(newMessage) {
  // 현재 클라이언트 목록의 복사본을 만듭니다.
  const currentClients = [...clients];
  // 즉시 원래 배열을 비워 다음 요청이 중복 처리하지 않도록 합니다.
  clients = [];

  currentClients.forEach(client => {
    // 응답을 보내고, HTTP 연결을 종료합니다.
    client.res.end(JSON.stringify(newMessage));
  });
}

// 1. index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. 롱 폴링 엔드포인트
app.get('/events', (req, res) => {
  // HTTP 헤더 설정
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // 헤더 즉시 전송

  // 클라이언트 객체를 저장합니다.
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res, // response 객체를 저장
  };
  clients.push(newClient);
  console.log(`Client connected: ${clientId}, Total clients: ${clients.length}`);

  // 클라이언트가 연결을 끊었을 때 처리
  req.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    clients = clients.filter(client => client.id !== clientId);
  });
});

// 3. 메시지 전송 엔드포인트
app.post('/messages', (req, res) => {
  const { message } = req.body;
  // POST 요청에 대한 응답을 먼저 보냅니다.
  res.status(204).end();
  // 그 다음, 대기 중인 모든 클라이언트에게 새 메시지를 전송합니다.
  sendEventsToAll({ message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Long polling server listening on port ${PORT}`);
});
