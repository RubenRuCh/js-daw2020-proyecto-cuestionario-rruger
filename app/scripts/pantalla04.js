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

// Back to logged.html
endBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./logged.html");
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
});

/*
// First we gonna modify capa1
var capa1 = document.querySelector("#capa1");

// Make capa1 draggable
capa1.setAttribute("draggable", "true");

// When capa1 is dragged, opacity = 50% and transfer it's id to check later
capa1.addEventListener("dragstart", (event) => {
  capa1.style.opacity = 0.5;
  event.dataTransfer.setData("idDraggedElement", event.target.id);
});

// When we release capa1, set it's opacity to it's original state
capa1.addEventListener("dragend", (event) => {
  capa1.style.opacity = 1;
});

// Finally, we gonna modify capa2
var capa2 = document.querySelector("#capa2");

// Avoid the default action so we can introduce our own way of dealing with the drop event
capa2.addEventListener("dragover", (event) => {
  event.preventDefault();
});

/* When we drop something onto capa2 and confirm that it's capa1 (we can't assume it), 
we delete it, then put some text in capa2 and pint it with yellow background */
/*
capa2.addEventListener("drop", (event) => {
  let idDraggedElement = event.dataTransfer.getData("idDraggedElement");

  if (idDraggedElement == "capa1") {
    let draggedElement = document.querySelector(`#${idDraggedElement}`);
    draggedElement.parentNode.removeChild(draggedElement);
    capa2.textContent = "¡Lo has logrado!";
    capa2.style.backgroundColor = "yellow";
  }
});
*/
