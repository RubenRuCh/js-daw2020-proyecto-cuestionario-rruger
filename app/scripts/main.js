// Import temporizador.js
import * as Temporizador from "./temporizador.js";

// Import User.js
import { User } from "./class/User.js";

// Import Question.js
import { Question } from "./class/Question.js";

// Import Questionary.js
import { Questionary } from "./class/Questionary.js";

// If the url is not index.html, get CurrentUser
const userClass = new User();
var currentUser = false;
let url = window.location.href;

if (!url.includes("index.html")) {
  currentUser = userClass.getCurrentUser();
  currentUser.loadQuestionary();
}

// Export modules to be used outside
export { Temporizador, User, currentUser, Question, Questionary };
