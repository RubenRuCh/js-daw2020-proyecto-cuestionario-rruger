// Import Main.js
import { Temporizador, User } from "./main.js";

// Create a control variable to check if login screen has been printed
var printed = false;

/**
 * Print a login screen inside section#initialMessage
 *
 * It only works if it hasn't been printed yet
 */
function printLoginScreen() {
  // If login screen hasn't been printed yet, we print it
  if (!printed) {
    let oldSection = document.querySelector("#initialMessage");

    // Create the new section that represent the login screen
    let section = document.createElement("section");
    section.setAttribute("id", "login");

    // Create a form to login at
    let form = document.createElement("form");

    // Create label with some text
    let label = document.createElement("label");
    label.setAttribute("for", "usuario");
    label.innerHTML = "Usuario<br>";

    // Create an input type email (identification of users)
    let input = document.createElement("input");
    input.setAttribute("type", "email");
    input.setAttribute("name", "usuario");
    input.setAttribute("id", "usuario");

    // We assemble everything onto new section
    form.appendChild(label);
    form.appendChild(input);
    section.appendChild(form);

    // Finally, remove all inside oldSection and put our login screen inside it
    oldSection.innerHTML = "";
    oldSection.appendChild(section);

    // Change printed value to avoid being printed again (by setTimer or by ctrl + F10)
    printed = true;

    // Prepare login to validate users
    configUserValidation(input, form);
  }
}

/**
 * Prepare login screen to validate users
 *
 * @param {Node} input Input email
 * @param {Node} form Form that represent the login screen
 */
function configUserValidation(input, form) {
  // When input lost focus, check if value have the right format
  input.addEventListener("blur", (event) => {
    // If there's a previus error message, delete it
    let errorEmail = document.querySelector(".errorEmail");
    if (errorEmail) {
      errorEmail.parentNode.removeChild(errorEmail);
    }

    let regexEmail = new RegExp(
      "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
    );

    // If the value doesn't have the right format, create a message error and put it under login screen
    if (regexEmail.test(event.target.value) == false) {
      let errorEmail = document.createElement("strong");
      errorEmail.setAttribute("class", "errorEmail");
      errorEmail.style.color = "red";
      errorEmail.innerHTML =
        "<br/>El email introducido no cumple el formato CARACTERES@CARACTERES.CARACTERES";
      // Insert the message before the nextSibling of email input
      event.target.parentNode.insertBefore(
        errorEmail,
        event.target.nextSibling
      );

      // Wait 10s to give time to blur event to end, a nd then select the text inside input
      setTimeout(() => {
        input.select();
      }, 10);
    }
    // If the value have the right format, save the login in a cookie and redirect to next screen
    else {
      login(input.value);
      window.location.replace("./logged.html");
    }
  });

  // Stop the default submit event to prevent send the data even if the values are correct
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

/**
 * Save user data into Cookies
 *
 * If the user did log before, update it's data on his cookie. If not, create a new user.
 * In both cases we create a cookie currentUser that contains the info of the current user
 *
 * @param {String} email Value of email input
 */
function login(email) {
  // Get User object (empty for now)
  const user = new User();
  // Try to get user info from cookies
  var oldUserJSON = Cookies.get(email);

  if (oldUserJSON != undefined) {
    // If cookies have info of user, update it's data and set it as currentUser
    const oldUser = user.getFromJSON(oldUserJSON);
    oldUser.lastLogin = oldUser.newLogin;
    oldUser.saveUser();
  } else {
    // If cookies don't have info of user, create it using empty User object and set it as currentUser
    user.email = email;
    user.saveUser();
  }
}

/**
 * Once windows is loaded, create a timer that trigger printLoginScreen() when 5 seconds elapse
 */
window.addEventListener("load", (event) => {
  // Call setTimer with 5 seconds and actions to manage resolv and reject situations
  let promise = Temporizador.setTimer(5000, printLoginScreen);
  // If everything its correct, execute printLoginScreen function
  promise.then(
    (response) => {
      response();
    },
    // If the timer goes wrong, we print an error message instead of login screen
    (error) => {
      document.querySelector("#initialMessage").innerHTML = error;
    }
  );
});

/**
 * If the user press ctrl + F10, trigger printLoginScreen()
 */
document.addEventListener("keyup", (event) => {
  if (event.ctrlKey && event.key == "F10") {
    printLoginScreen();
  }
});
