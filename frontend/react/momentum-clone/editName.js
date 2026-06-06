const edit = document.querySelector(".editNameBtn"),
  nameInput = form.querySelector("input");

document.getElementById("greet").onmouseover = function() {
  mouseOver();
};
document.getElementById("greet").onmouseout = function() {
  mouseOut();
};

function mouseOver() {
  edit.classList.add(SHOWING_CN);
}

function mouseOut() {
  edit.classList.remove(SHOWING_CN);
}

function editName() {
  localStorage.removeItem(USER_LS);
  form.classList.add(SHOWING_CN);
  greeting.classList.remove(SHOWING_CN);
  nameInput.value = "";
}

edit.onclick = editName;
