// Import Main.js
import {
  Temporizador,
  User,
  currentUser,
  Question,
  loadQuestions,
} from "./main.js";

// Prepare buttons to navegate to others menus
const backBtn = document.querySelector("button#back");
const saveBtn = document.querySelector("button#save");

backBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./logged.html");
});

saveBtn.addEventListener("click", (event) => {
  event.preventDefault();
  // Get inputs
  const titleInput = document.querySelector("textarea[name='question']");
  const answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked
  const valueInput = document.querySelector("input[name='score']");

  const question = new Question();
  question.title = titleInput.value;
  question.answer = answerInput.value;
  question.value = valueInput.value;
  currentUser.createQuestion(question);
});

// Clean form
const questionForm = document.querySelector("section#questionsForm form");
questionForm.reset();

// Config form
questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

// Load questions
const questionary = currentUser.getQuestionary();
loadQuestions(true); // Force it to wait 5 seconds before load them

// TODO Remove
console.log(currentUser);
