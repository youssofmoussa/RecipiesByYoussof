import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  applyActionCode,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7OokO1CwXxf-Sm6tNyeUUnT7fgw_SzrY",
  authDomain: "youmiy.firebaseapp.com",
  projectId: "youmiy",
  storageBucket: "youmiy.appspot.com",
  messagingSenderId: "25405744637",
  appId: "1:25405744637:web:ea3315aeba103e34b3a594",
  measurementId: "G-FS25X6XZ5E",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupEmailIn = document.getElementById("signup-email");
const confirmSignupEmailIn = document.getElementById("confirm-email");
const signupPasswordIn = document.getElementById("signup-password");
const confirmSignUpPasswordIn = document.getElementById("confirm-password");
const createacctbtn = document.getElementById("create-acct-btn");
const returnBtn = document.getElementById("return-btn");
const notification = document.getElementById("notification");

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  setTimeout(() => {
    notification.className = `notification ${type}`;
  }, 3000);
}

function redirectToRecipePage(email) {
  setTimeout(() => {
    window.location.href = `/recipe/html/index.html?user=${encodeURIComponent(
      email
    )}&type=signup`;
  }, 3000);
}


createacctbtn.addEventListener("click", function () {
  var isVerified = true;

  const signupEmail = signupEmailIn.value;
  const confirmSignupEmail = confirmSignupEmailIn.value;
  if (signupEmail !== confirmSignupEmail) {
    showNotification("Email fields do not match. Try again.", "error");
    isVerified = false;
  }

  const signupPassword = signupPasswordIn.value;
  const confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if (signupPassword !== confirmSignUpPassword) {
    showNotification("Password fields do not match. Try again.", "error");
    isVerified = false;
  }

  if (
    !signupEmail ||
    !confirmSignupEmail ||
    !signupPassword ||
    !confirmSignUpPassword
  ) {
    showNotification("Please fill out all required fields.", "error");
    isVerified = false;
  }

  if (isVerified) {
    const username = document.getElementById("username").value;

    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: username })
          .then(() => {
            sendEmailVerification(user)
              .then(() => {
                showNotification(
                  "Sign Up Successfully! Redirecting...",
                  "success"
                );
                redirectToRecipePage(signupEmail);
              })
              .catch((error) => {
                console.error(
                  "Error sending email verification: ",
                  error.message
                );
                showNotification("Error occurred. Try again.", "error");
              });
          })
          .catch((error) => {
            console.error("Error updating profile: ", error.message);
            showNotification("Error occurred. Try again.", "error");
          });
      })
      .catch((error) => {
        console.error("Error occurred during signup: ", error.message);
        showNotification("Error occurred. Try again.", "error");
      });
  }
});

submitButton.addEventListener("click", function () {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      showNotification("Login Successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = `/recipe/html/index.html?user=${encodeURIComponent(
          email
        )}&type=login`;
      }, 3000);
    })
    .catch((error) => {
      console.error("Error occurred: ", error.message);
      showNotification("Error occurred. Try again.", "error");
    });
});


signupButton.addEventListener("click", function () {
  main.style.display = "none";
  createacct.style.display = "block";
});

returnBtn.addEventListener("click", function () {
  main.style.display = "block";
  createacct.style.display = "none";
});

// Handle email verification link
function handleEmailVerification() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");
  const apiKey = urlParams.get("apiKey");
  const lang = urlParams.get("lang");
  const continueUrl = urlParams.get("continueUrl"); // Not used but available

  if (mode === "verifyEmail") {
    if (oobCode) {
      auth
        .applyActionCode(oobCode)
        .then(() => {
          showNotification("Email successfully verified!", "success");
        })
        .catch((error) => {
          console.error("Error verifying email: ", error.message);
          showNotification("Error occurred. Try again.", "error");
        });
    }
  }
}

handleEmailVerification();
