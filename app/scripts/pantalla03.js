// Import Main.js
import { currentUser, Question } from "./main.js";

// Clear form
const questionForm = document.querySelector("section#questionsForm form");
questionForm.reset();

// Reset numQuestionToSave
currentUser.questionary.numQuestionsToSave = 0;
currentUser.saveUser();

// Get inputs (answerInput only will be called when necessary)
const titleInput = document.querySelector("textarea[name='question']");
const valueInput = document.querySelector("input[name='score']");

// Prepare buttons to navegate to others menus
const backBtn = document.querySelector("button#back");
const saveBtn = document.querySelector("button#save");

// Back to logged.html
backBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./logged.html");
});

// Create a question. saveBtn only will be enabled based on current form content
saveBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked

  const question = new Question();
  question.title = titleInput.value;
  question.answer = answerInput.value;
  question.value = valueInput.value;
  currentUser.questionary.createQuestion(question);

  // Clear form
  questionForm.reset();

  // Disable saveBtn
  saveBtn.disabled = true;
});

// Config form
questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

/**
 * Check every change on form to decide if btnSave can be enabled (it will only be enabled when all inputs have value)
 *
 * @param {Event} event
 */
const checkInputs = (event) => {
  let answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked
  const formValues = [titleInput.value, answerInput, valueInput.value];

  if (
    formValues.includes(undefined) ||
    formValues.includes(null) ||
    formValues.includes("")
  ) {
    saveBtn.disabled = true;
  } else {
    saveBtn.disabled = false;
  }
};

// Check inputs
questionForm.addEventListener("change", checkInputs);
valueInput.addEventListener("keyup", checkInputs);
titleInput.addEventListener("keyup", checkInputs);

// Config valueInput
valueInput.addEventListener("keydown", (event) => {
  let key = event.charCode || event.keyCode;
  // Ignore backspace but put value as 0
  if (key == 8) {
    event.target.value = 0;
    event.preventDefault();
    return false;
  }
  // Ignore all non numeric keys between 1 and 9 (numeric pad or regular digit keys)
  else if (!(key >= 48 && key <= 57) && !(key >= 96 && key <= 105)) {
    event.preventDefault();
    return false;
  }
});

// If key it's between 1 and 9, check for lenght of total value
valueInput.addEventListener("keyup", (event) => {
  let numericValue = parseInt(event.target.value);
  if (numericValue > 9) event.target.value = 9;
});

// Load questions
const questionClass = new Question();
questionClass.loadQuestions(true); // Force it to wait 5 seconds before load them
