const questions = [
  {
    q: "A region around a magnet where a magnetic force is felt is called?",
    options: [
      "A. Magnetic field",
      "B. Electric field",
      "C. Gravitational field",
      "D. Electric potential",
    ],
    answer: "A",
  },
  {
    q: "Electric field is caused by?",
    options: ["A. Current", "B. Charge", "C. Mass", "D. Velocity", "E. None"],
    answer: "B",
  },
  {
    q: "Fleming right hand is applied in?",
    options: [
      "A. Electric motors",
      "B. Electric generators",
      "C. Conductance",
      "D. Mechanism",
      "E. None",
    ],
    answer: "B",
  },
  {
    q: "A point where current spilt in a circuit is called?",
    options: ["A. Node", "B. Anti node", "C. Current splitter", "D. None"],
    answer: "A",
  },
];

let shuffled = [],
  selectedAnswers = [],
  current = 0,
  score = 0,
  timer = null,
  timeLeft = 60;
let totalQuestions = 0;

const setup = document.getElementById("setup");
const confirmation = document.getElementById("confirmation");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const review = document.getElementById("review");

const continueBtn = document.getElementById("continue-btn");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn = document.getElementById("review-btn");

const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const progressText = document.getElementById("progress-text");
const timeText = document.getElementById("time-text");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const percentageText = document.getElementById("percentage-text");
const messageText = document.getElementById("message-text");
const confirmText = document.getElementById("confirm-text");

continueBtn.onclick = () => {
  totalQuestions = Math.min(
    +document.getElementById("question-count").value,
    questions.length
  );
  const mins = +document.getElementById("minutes").value;
  const secs = +document.getElementById("seconds").value;

  timeLeft = mins * 60 + secs;

  if (timeLeft <= 0) {
    alert("Please set a time greater than 00:00.");
    return;
  }

  confirmText.textContent = `You are about to take a ${totalQuestions}-question quiz for ${String(
    mins
  ).padStart(2, "0")} minutes and ${String(secs).padStart(2, "0")} seconds.`;

  setup.classList.add("hidden");
  confirmation.classList.remove("hidden");
};

backBtn.onclick = () => {
  confirmation.classList.add("hidden");
  setup.classList.remove("hidden");
};

startBtn.onclick = () => {
  shuffled = [...questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, totalQuestions);
  selectedAnswers = Array(totalQuestions).fill(null);
  current = 0;
  score = 0;
  confirmation.classList.add("hidden");
  quiz.classList.remove("hidden");
  result.classList.add("hidden");
  review.classList.add("hidden");
  startTimer();
  showQuestion();
};

function showQuestion() {
  const q = shuffled[current];
  questionText.textContent = `Question ${current + 1}: ${q.q}`;
  questionText.classList.add("platypi");
  progressText.textContent = `${current + 1}/${shuffled.length}`;
  optionsBox.innerHTML = "";
  nextBtn.classList.toggle("hidden", !selectedAnswers[current]);

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("platypi");
    if (selectedAnswers[current] === opt) btn.classList.add("selected");
    btn.onclick = () => {
      selectedAnswers[current] = opt;
      document
        .querySelectorAll("#options button")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      nextBtn.classList.remove("hidden");
    };
    optionsBox.appendChild(btn);
  });

  prevBtn.classList.toggle("hidden", current === 0);
}

nextBtn.onclick = () => {
  if (current < shuffled.length - 1) {
    current++;
    showQuestion();
  } else {
    endQuiz();
  }
};

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    showQuestion();
  }
};

function startTimer() {
  timeText.textContent = formatTime(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) endQuiz();
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function endQuiz() {
  clearInterval(timer);
  score = selectedAnswers.reduce((acc, ans, i) => {
    const correct = shuffled[i].options.find((opt) =>
      opt.startsWith(shuffled[i].answer + ".")
    );
    return ans === correct ? acc + 1 : acc;
  }, 0);

  quiz.classList.add("hidden");
  result.classList.remove("hidden");
  scoreText.textContent = `${score} / ${shuffled.length}`;

  const percent = Math.round((score / shuffled.length) * 100);
  percentageText.textContent = `You got ${percent}% correct`;

  let grade = "";
  if (percent >= 90) grade = "A";
  else if (percent >= 80) grade = "B";
  else if (percent >= 70) grade = "C";
  else if (percent >= 60) grade = "D";
  else if (percent >= 50) grade = "E";
  else grade = "F";

  gradeText.textContent = grade;
  gradeText.className = `grade-${grade.toLowerCase()}`;

  messageText.textContent =
    grade === "A"
      ? "Excellent!"
      : grade === "B"
      ? "Great Job!"
      : grade === "C"
      ? "Good Effort!"
      : grade === "D"
      ? "Needs Improvement."
      : grade === "E"
      ? "Poor. Try Again."
      : "Failed. Better luck next time!";
}

restartBtn.onclick = () => {
  setup.classList.remove("hidden");
  result.classList.add("hidden");
};

reviewBtn.onclick = () => {
  if (review.classList.contains("hidden")) {
    review.classList.remove("hidden");
    review.innerHTML = "<h3>Review:</h3>";
    shuffled.forEach((q, i) => {
      const userAns = selectedAnswers[i] || "No Answer";
      const correct = q.options.find((opt) => opt.startsWith(q.answer + "."));
      const isCorrect = userAns === correct;
      review.innerHTML += `
    <p>
      <strong>Q${i + 1}: ${q.q}</strong><br>
      Your Answer: ${userAns} <br>
      Correct Answer: ${correct} <br>
      <span style="color: ${isCorrect ? "green" : "red"}">${
        isCorrect ? "Correct ✅" : "Wrong ❌"
      }</span>
    </p>
  `;
    });
    reviewBtn.textContent = "Close Answers";
  } else {
    review.classList.add("hidden");
    reviewBtn.textContent = "Check Answers";
  }
};
