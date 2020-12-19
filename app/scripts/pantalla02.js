// Import Main.js
import { User, currentUser } from "./main.js";

let h1 = document.querySelector("section#userInfo h1");
let p = document.querySelector("section#userInfo p");

h1.textContent = `Hola ${currentUser.email}`;
p.innerHTML = currentUser.lastLogin
  ? currentUser.getLastLoginInfo()
  : "Es la primera vez que entras. El funcionamiento de la aplicación es bastante intuitivo, pero si tienes alguna duda puedes <a href='mailto:ruben_27895@hotmail.com'>enviarme un email</a> y estaré encantado de ayudar";

// Prepare buttons to navegate to others menus
const questionaryBtn = document.querySelector("button#questionary");
const questionsyBtn = document.querySelector("button#questions");

questionaryBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./preparation.html");
});

questionsyBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./questions.html");
});
