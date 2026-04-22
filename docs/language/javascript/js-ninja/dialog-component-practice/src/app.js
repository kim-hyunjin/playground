import { CommonDialog } from "./common/dialog.js";

const dialog1 = CommonDialog("예제1", {
    contents: [
        {
            label: "이름",
            text: "김현진",
            editable: false,
        },
        {
            label: "나이",
            text: 30,
            editable: false,
        },
        {
            label: "이메일",
            text: "hyunjin1612@gmail.com",
        },
        {
            label: "자기소개",
        },
    ],
});
const btn1 = document.getElementById("exam1");
btn1.onclick = function () {
    dialog1.open();
};

const dialog2 = CommonDialog("예제2", {
    contents: [
        {
            label: "날짜",
            computed: function () {
                const now = new Date();
                return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            },
            editable: false,
        },
    ],
});
const btn2 = document.getElementById("exam2");
btn2.onclick = function () {
    dialog2.open();
};

const dialog3 = CommonDialog("예제3", {
    contents: [
        {
            label: "팀명",
            text: "Scuderia Ferrari",
        },
    ],
});
dialog3.setDataSource([
    {
        label: "팀명",
        text: " Red Bull Racing",
    },
    {
        label: "드라이버",
        text: "막스 베르스타펜, 세르히오 페레즈",
    },
]);

dialog3.changeTitle("F1");
console.log(dialog3.getDataSource());

const btn3 = document.getElementById("exam3");
btn3.onclick = function () {
    dialog3.open();
};

dialog3.on("onOpen", () => {
    console.log("대화창 열림");
});

dialog3.on("onClose", () => {
    console.log("대화창 닫힘");
});
