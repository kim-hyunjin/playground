import catSrc from "../assets/cat.jpg";
import "../styles/cat.css";

export default function renderCat() {
    const btn = document.getElementById("catBtn");
    btn.onclick = () => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.className = "catDiv";

        const catImg = document.createElement("img");
        catImg.src = catSrc;
        catImg.className = "catImg";
        div.appendChild(catImg);
    };
}
