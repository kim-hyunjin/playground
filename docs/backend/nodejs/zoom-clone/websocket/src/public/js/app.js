const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  const msg = JSON.parse(message.data);
  li.innerText = `${msg.nickname}: ${msg.chat}`;
  messageList.appendChild(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nickname = messageForm.querySelector("#nickname");
  const chat = messageForm.querySelector("#chat");

  socket.send(JSON.stringify({ nickname: nickname.value, chat: chat.value }));
  chat.value = "";
});
