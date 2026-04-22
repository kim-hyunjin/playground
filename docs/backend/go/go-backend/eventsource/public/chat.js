$(function () {
  if (!window.EventSource) {
    alert("No Event Source");
    return;
  }

  var $chatlog = $("#chat-log");
  var $chatmsg = $("#chat-msg");

  var isBlank = function (string) {
    return string == null || string.trim() === "";
  };

  var username;
  while (isBlank(username)) {
    username = prompt("What's your name?");
    if (!isBlank(username)) {
      $("#chat-name").html("<b>" + username + "</b>");
    }
  }

  $("#input-form").on("submit", function (e) {
    $.post("/messages", {
      msg: $chatmsg.val(),
      name: username,
    });
    $chatmsg.val("");
    $chatmsg.focus();
    return false;
  });

  var addMsg = function (data) {
    var text = "";
    if (!isBlank(data.name)) {
      text = "<string>" + data.name + ":</strong>";
    }
    text += data.msg;
    $chatlog.prepend("<div><span>" + text + "</span></div>");
  };

  var es = new EventSource("/stream");
  es.onopen = function (e) {
    $.post("/users", {
      name: username,
    });
  };
  es.onmessage = function (e) {
    var msg = JSON.parse(e.data);
    addMsg(msg);
  };

  window.onbeforeunload = function () {
    $.ajax({
      url: "/users?username=" + username,
      type: "DELETE",
    });
    es.close();
  };
});
