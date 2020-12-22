// Import Main.js
import { currentUser, Question } from "./main.js";

// Load questionary
const questionary = currentUser.getQuestionary();

// Get array of questions to be evaluated sorted by their order (determined by user actions)
const selectedQuestions = questionary.getQuestionsSelected().sort((a, b) => {
  // If there's order
  if (a.order >= 0 && b.order >= 0) {
    return parseInt(a.order) - parseInt(b.order);
  }
  // If not, order alphabetically
  else {
    return a.title.toString().localeCompare(b.title, "es");
  }
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

// Prepare this questionary with first question data
const firstQuestion = selectedQuestions[0];

questionInput.textContent = firstQuestion.title;
correctAnswerInput.value = firstQuestion.answer;
currentQuestionIndexInput.value = 0;
currentUser.questionary.remainingTime = currentUser.questionary.duration;

countdownInput.value = currentUser.questionary.getCountdown();

// By default, punctuation = maxPunctuation, and each fail discounts Question.value
currentUser.questionary.punctuation = currentUser.questionary.maxPunctuation;

// Prepare buttons to navegate to others menus
const endQuestionaryBtn = document.querySelector("button#endQuestionary");
const nextBtn = document.querySelector("button#next");

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

/**
 * Check inputs values to evaluate the result
 *
 * It save the results of current question into the cookies
 */
const evaluateQuestion = () => {
  let answerInput = document.querySelector("input[name='answer']:checked"); // Get the one it's checked

  let currentQuestionIndex = currentQuestionIndexInput.value;
  let correctAnswer = correctAnswerInput.value;

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  // If user answer correctly, mark isCorrect true
  if (correctAnswer == currentQuestion.answer) {
    currentQuestion.isCorrect = true;
  }
  // If the user failed, mark isCorrect false and subtract currentQuestion.value
  else {
    currentQuestion.isCorrect = false;
    currentUser.questionary.punctuation =
      parseInt(punctuation) - parseInt(currentQuestion.value);
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
  currentQuestionIndexInput.value;
  correctAnswerInput.value;
};

// Load question
//questionary.examineQuestion();
