// Import Main.js
import { currentUser } from "./main.js";

// Load questionary
const questionary = currentUser.getQuestionary();

// Get array of questions of questionary that have been answered
const selectedQuestions = questionary.getQuestionsSelected().sort((a, b) => {
  // If there's order, use it
  if (a.order >= 0 && b.order >= 0) {
    return parseInt(a.order) - parseInt(b.order);
  }
  // If not, order alphabetically
  else {
    return a.title.toString().localeCompare(b.title, "es");
  }
});

const resultsTable = document.querySelector("section#result table#questions");

// For each question of the questionary, print it's result in table
for (const question of selectedQuestions) {
  let row = document.createElement("tr");
  let cellQuestion = document.createElement("td");
  let cellAnswer = document.createElement("td");
  let cellValue = document.createElement("td");
  let cellResult = document.createElement("td");

  let labelQuestion = document.createElement("label");
  let inputQuestion = document.createElement("textarea");
  labelQuestion.textContent = "Pregunta: ";
  inputQuestion.readOnly = true;
  inputQuestion.value = question.title;

  let spanRespuesta = document.createElement("span");
  let spanAnswer = document.createElement("span");
  spanRespuesta.textContent = "Respuesta: ";
  spanAnswer.textContent = question.answer.toUpperCase();

  cellValue.textContent = `Valor: ${question.value}`;

  let result = question.isCorrect ? "Acierto" : "Fallo";

  cellResult.textContent = result;
  cellResult.classList.add(result.toLowerCase());

  cellQuestion.appendChild(labelQuestion);
  cellQuestion.appendChild(inputQuestion);

  cellAnswer.appendChild(spanRespuesta);
  cellAnswer.appendChild(spanAnswer);

  row.appendChild(cellQuestion);
  row.appendChild(cellAnswer);
  row.appendChild(cellValue);
  row.appendChild(cellResult);

  resultsTable.appendChild(row);
}

// Print time used
document.querySelector(
  "span#timeUsed"
).textContent = `${questionary.getTimeUsed()} minutos de ${questionary.getDuration()} minutos disponibles`;

// Print punctuation under h1
let punctuation = document.createElement("h2");
punctuation.textContent = `Tu puntuación ha sido de ${questionary.punctuation}/${questionary.maxPunctuation}`;

let h1 = document.querySelector("h1");
h1.parentNode.insertBefore(punctuation, h1.nextSibling);

// Prepare buttons to navegate to others menus
const startBtn = document.querySelector("button#start");

// Go to logged.html
startBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // Reset questionary
  currentUser.questionary.resetQuestionary();
  currentUser.saveUser();

  // Redirect to pantalla02
  window.location.replace("./logged.html");
});
