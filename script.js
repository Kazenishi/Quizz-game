// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionBlock = document.getElementById("questionBlock");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const timerBar = document.getElementById("timerBar");
const timerFill = document.getElementById("timerFill");
const timerLabel = document.getElementById("timerLabel");
const timeLeftSpan = document.getElementById("time-left");

// Quiz questions
const quizQuestions = [
  {
    question: "What is the capital of Haiti?",
    answers: [
      { text: "Petit-Goaves", correct: false },
      { text: "Jacmel", correct: false },
      { text: "Port-au-Prince", correct: true },
      { text: "Cap-Haitien", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
  {
    question: "What is the date of Haiti independence day?",
    answers: [
      { text: "July 4th 1776", correct: false },
      { text: "January 1st 1804", correct: true },
      { text: "May 18th 1840", correct: false },
      { text: "January 2nd 1803", correct: false },
    ],
  },
  {
    question: "Which Haitian hero led the slave revolt before independence?",
    answers: [
      { text: "Jean-Jacques Dessalines", correct: false },
      { text: "Henry Christophe", correct: false },
      { text: "Charlemagne Peralte", correct: false },
      { text: "Toussaint Louverture", correct: true },
    ],
  },
  {
    question: "Which country is famous for the pyramids of Giza?",
    answers: [
      { text: "Mexico", correct: false },
      { text: "Egypt", correct: true },
      { text: "Paris", correct: false },
      { text: "China", correct: false },
    ],
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Michelangelo", correct: false },
      { text: "Van Gogh", correct: false },
      { text: "Leonardo Da Vinci", correct: true },
      { text: "Raphael", correct: false },
    ],
  },
  {
    question: "What is the capital of Japan?",
    answers: [
      { text: "Shibuya", correct: false },
      { text: "Tokyo", correct: true },
      { text: "Hokkaido", correct: false },
      { text: "Taiping", correct: false },
    ],
  },
  {
    question: "On which island is Haiti located?",
    answers: [
      { text: "Cuba", correct: false },
      { text: "Jamaica", correct: false },
      { text: "Hispaniola", correct: true },
      { text: "Puerto Rico", correct: false },
    ],
  },
  {
    question: "Who is the most titled football player?",
    answers: [
      { text: "Lionel Messi", correct: true },
      { text: "Luka Modric", correct: false },
      { text: "Cristiano Ronaldo", correct: false },
      { text: "Daniel Alves", correct: false },
    ],
  },
  {
    question: "Which basketball player has the most NBA rings?",
    answers: [
      { text: "Kobe Bryant", correct: false },
      { text: "Bill Russel", correct: true },
      { text: "Micheal Jordan", correct: false },
      { text: "Wilt Chamberlain", correct: false },
    ],
  },
];

// Timing config
const QUESTION_TIME = 15; // seconds allowed per question
const REVEAL_DELAY_MS = 1000; // how long correct/incorrect stays highlighted
const TRANSITION_MS = 220; // must match the CSS transition on .question-block

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let timeLeft = QUESTION_TIME;
let timerInterval = null;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;
  progressBar.style.width = "0%";

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  renderQuestion();
  startTimer();
}

function renderQuestion() {
  answersDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);

    answersContainer.appendChild(button);
  });
}

function startTimer() {
  clearTimer();
  timeLeft = QUESTION_TIME;
  timeLeftSpan.textContent = timeLeft;
  timerBar.classList.remove("is-low");
  timerLabel.classList.remove("is-low");

  // Snap the bar to full instantly, then let it animate down over the
  // question's duration. The reflow forces the browser to register the
  // reset before the transition is re-enabled, so it always animates.
  timerFill.style.transition = "none";
  timerFill.style.width = "100%";
  void timerFill.offsetWidth;
  timerFill.style.transition = `width ${QUESTION_TIME}s linear`;
  timerFill.style.width = "0%";

  timerInterval = setInterval(() => {
    timeLeft--;
    timeLeftSpan.textContent = Math.max(timeLeft, 0);

    if (timeLeft <= 5) {
      timerBar.classList.add("is-low");
      timerLabel.classList.add("is-low");
    }

    if (timeLeft <= 0) {
      clearTimer();
      handleTimeUp();
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function selectAnswer(event) {
  if (answersDisabled) return;

  clearTimer();
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  revealAnswers(selectedButton);

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  goToNextQuestion();
}

function handleTimeUp() {
  if (answersDisabled) return;

  answersDisabled = true;
  revealAnswers(null);
  goToNextQuestion();
}

function revealAnswers(selectedButton) {
  Array.from(answersContainer.children).forEach((button) => {
    button.disabled = true;

    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });
}

function goToNextQuestion() {
  setTimeout(() => {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      questionBlock.classList.add("is-hidden");

      setTimeout(() => {
        renderQuestion();
        startTimer();
        requestAnimationFrame(() => {
          questionBlock.classList.remove("is-hidden");
        });
      }, TRANSITION_MS);
    } else {
      showResults();
    }
  }, REVEAL_DELAY_MS);
}

function showResults() {
  clearTimer();

  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  progressBar.style.width = "100%";
  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  startQuiz();
}
