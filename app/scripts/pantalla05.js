// Import Main.js
import { currentUser, Question } from "./main.js";

// Load questionary
const questionary = currentUser.getQuestionary();

// Get array of questions to be evaluated sorted by their order (determined by user actions)
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

// Config form to check if is possible to enable nextBtn
const formQuestionary = document.querySelector(
  "section#containerQuestion form"
);
formQuestionary.addEventListener("change", () => {
  enableNextBtnIfPossible();
});

// Get inputs
const countdownInput = document.querySelector("input[name='countdown']");
const questionInput = document.querySelector("textarea[name='question']");
const correctAnswerInput = document.querySelector(
  "input[name='correctAnswer']"
);
const currentQuestionIndexInput = document.querySelector(
  "input[name='currentQuestionIndex']"
);

// maxPunctuation will be the sum of the points that are worth all the selected questions
currentUser.questionary.maxPunctuation = selectedQuestions.reduce(
  (total, question) => parseInt(total) + parseInt(question.value),
  0 // Start at 0
);

// By default, punctuation = 0, and each success add Question.value
currentUser.questionary.punctuation = 0;

// Save punctuation data in cookies
currentUser.saveUser();

// Prepare this questionary with first question data
const firstQuestion = selectedQuestions[0];

questionInput.textContent = firstQuestion.title;
correctAnswerInput.value = firstQuestion.answer;
currentQuestionIndexInput.value = 0;
currentUser.questionary.remainingTime = currentUser.questionary.duration;

countdownInput.value = currentUser.questionary.getCountdown();

// Prepare buttons to navegate to others menus
const endQuestionaryBtn = document.querySelector("button#endQuestionary");
const nextBtn = document.querySelector("button#next");

// Disabled by default
endQuestionaryBtn.disabled = true;
nextBtn.disabled = true;

// Go to results.html
endQuestionaryBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("./results.html");
});

// Go to next question
nextBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // Check if it's correct and save into cookies
  evaluateQuestion();

  // Go to next question
  nextQuestion(currentQuestionIndexInput.value);
});

// Start countdown and update every second
const countdown = setInterval(() => {
  let remaining = currentUser.questionary.countdown();
  countdownInput.value = currentUser.questionary.getCountdown();

  // When there's no more time available, stop the countdown and force to finish the questionary
  if (remaining == -1) {
    clearInterval(countdown);
    enableEndQuestionaryBtnIfPossible();
    nextBtn.disabled = true;
    countdownInput.classList.add("noTime");

    // Add this comprobation to enable endQuestionaryBtn in case checkbox wasnt't selected when remaining time end
    formQuestionary.addEventListener("change", () => {
      enableEndQuestionaryBtnIfPossible();
    });
  }
}, 1000);

/**
 * Check inputs values to evaluate the result
 *
 * It save the results of current question into the cookies
 */
const evaluateQuestion = () => {
  let answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked

  let currentQuestionIndex = currentQuestionIndexInput.value;
  let correctAnswer = correctAnswerInput.value;
  let userAnswer = answerInput.value;

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  // If user answer correctly, mark isCorrect true and add currentQuestion.value
  if (correctAnswer == userAnswer) {
    currentQuestion.isCorrect = true;

    currentUser.questionary.punctuation =
      parseInt(currentUser.questionary.punctuation) +
      parseInt(currentQuestion.value);
  }
  // If the user failed, mark isCorrect false
  else {
    currentQuestion.isCorrect = false;
  }

  // Whatever is the result, update info in cookies
  let updatedQuestion = new Question();
  updatedQuestion = updatedQuestion.getFromJSON(
    JSON.stringify(currentQuestion)
  );
  updatedQuestion.updateQuestion();
  currentUser.saveUser();
};

/**
 * Update this HTML with info of the next question in the list
 *
 * If this is the last one, update buttons
 *
 * @param {Number} currentIndex
 */
const nextQuestion = (currentIndex) => {
  const nextIndex = parseInt(currentIndex) + 1;

  // If there's more Questions left, load fresh data
  if (nextIndex < selectedQuestions.length) {
    const next = selectedQuestions[nextIndex];

    questionInput.textContent = next.title;
    currentQuestionIndexInput.value = nextIndex;
    correctAnswerInput.value = next.answer;

    document.querySelector("input[name='answer']:checked").checked = null;
    nextBtn.disabled = true;
  }
  // If this is the last question, disable nextBtn, clean form, and enable endQuestionaryBtn if possible
  else {
    enableEndQuestionaryBtnIfPossible();
    nextBtn.disabled = true;

    questionInput.textContent =
      "¡Cuestionario finalizado! Pulsa 'Finalizar' para ver tus resultados";

    // Stop countdown
    clearInterval(countdown);

    // Add some style to our competitor's time!
    countdownInput.classList.add("complete");
  }
};

/**
 * Review the necessary conditions to enable the endQuestionaryBtn and enable it if these conditions are met
 *
 */
const enableEndQuestionaryBtnIfPossible = () => {
  let answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked

  // Only enable if some answer has been checked
  if (answerInput) {
    endQuestionaryBtn.disabled = false;
  }
};

/**
 * Review the necessary conditions to enable the nextBtn and enable it if these conditions are met
 *
 */
const enableNextBtnIfPossible = () => {
  let answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked

  // Only enable if some answer has been checked and there's time left
  if (answerInput && parseInt(currentUser.questionary.remainingTime) > 0) {
    nextBtn.disabled = false;
  }
};
