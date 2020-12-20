// Import Main.js
import { Temporizador, currentUser, Questionary } from "./main.js";

// Get inputs
const durationInput = document.querySelector("input[name='duration']");

// Prepare buttons to navegate to others menus
const viewBtn = document.querySelector("button#view");
const endBtn = document.querySelector("button#end");

// Back to logged.html
endBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./logged.html");
});

// Load questions
const questionary = currentUser.getQuestionary();
loadQuestions(true); // Force it to wait 5 seconds before load them
