// Import Main.js
import { Temporizador, currentUser, Questionary } from "./main.js";

// Load questionary
const questionary = currentUser.getQuestionary();

// Get input
const durationInput = document.querySelector("input[name='duration']");
durationInput.value = questionary.getDuration();

// Disable keypress event in durationInput
durationInput.addEventListener("keypress", (event) => {
  event.preventDefault();
  return false;
});

// Save duration in cookie when value changes
durationInput.addEventListener("change", (event) => {
  currentUser.questionary.setDuration(event.target.value);
});

// Prepare buttons to navegate to others menus
const viewBtn = document.querySelector("button#view");
const endBtn = document.querySelector("button#end");

// If there are selected questions, enable viewBtn. If not, let it disabled
let arrayQuestionSelected = currentUser.questionary.getQuestionsSelected();
viewBtn.disabled = true;
if (Object.keys(arrayQuestionSelected).length > 0) {
  viewBtn.disabled = false;
}

// Back to logged.html
endBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./logged.html");
});

// Go to questionary.html
viewBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./questionary.html");
});

// Load questions
questionary.printQuestionsAvailable();
questionary.printQuestionsSelected();

// Config drag and drop
const listQuestionsAvailable = document.querySelector("#questionsAvailable");
const listQuestionsSelected = document.querySelector("#questionsSelected");

// Avoid the default action so we can introduce our own way of dealing with the drop event
listQuestionsAvailable.addEventListener("dragover", (event) => {
  event.preventDefault();
});

listQuestionsSelected.addEventListener("dragover", (event) => {
  event.preventDefault();
});

/* When we drop a Question inside a list, we delete it from old list, 
then create it in the new list and update the info in cookies */
listQuestionsAvailable.addEventListener("drop", (event) => {
  let questionTitle = event.dataTransfer.getData("text");

  let draggedQuestion = document.querySelector(
    `li[data-title='${questionTitle}']`
  );

  // If Question come from questionsSelected, remove it and create in his new place
  if (draggedQuestion.dataset.origin == "selected") {
    draggedQuestion.parentNode.removeChild(draggedQuestion);

    draggedQuestion.dataset.origin = "available";
    listQuestionsAvailable.appendChild(draggedQuestion);

    // Update in cookie
    currentUser.questionary.moveQuestion(questionTitle);
  }

  // Enable or disable viewBtn depending on whether or not there are selected questions
  let arrayQuestionSelected = currentUser.questionary.getQuestionsSelected();
  viewBtn.disabled = true;

  if (Object.keys(arrayQuestionSelected).length > 0) {
    viewBtn.disabled = false;
  } else {
    viewBtn.disabled = true;
  }
});

listQuestionsSelected.addEventListener("drop", (event) => {
  let questionTitle = event.dataTransfer.getData("text");

  let draggedQuestion = document.querySelector(
    `li[data-title='${questionTitle}']`
  );

  // If Question come from questionsAvailable, remove it and create in his new place
  if (draggedQuestion.dataset.origin == "available") {
    draggedQuestion.parentNode.removeChild(draggedQuestion);

    draggedQuestion.dataset.origin = "selected";
    listQuestionsSelected.appendChild(draggedQuestion);

    // Update in cookie
    currentUser.questionary.moveQuestion(questionTitle);
  }

  // Enable or disable viewBtn depending on whether or not there are selected questions
  let arrayQuestionSelected = currentUser.questionary.getQuestionsSelected();
  viewBtn.disabled = true;

  if (Object.keys(arrayQuestionSelected).length > 0) {
    viewBtn.disabled = false;
  } else {
    viewBtn.disabled = true;
  }
});
