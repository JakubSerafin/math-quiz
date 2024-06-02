const problemDiv = document.getElementById('problem')!;
const input = document.getElementById('input') as HTMLInputElement;
const timerDiv = document.getElementById('timer')!;
const resultsDiv = document.getElementById('results')!;

type Problem = { x: number, y: number };

let problems: Problem[] = [];
for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 10; j++) {
    problems.push({ x: i, y: j });
  }
}

let currentProblemIndex = 0;
let startTime: number;
let timerInterval: number | undefined;
type Result = { time: number, date: string };
let pastResults: Result[] = JSON.parse(localStorage.getItem('results') || '[]');

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTest() {
  shuffleArray(problems);
  currentProblemIndex = 0;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  displayProblem();
}

//like normal test but only 3 cases
function startSimpleTest(){
  shuffleArray(problems);
  currentProblemIndex = problems.length-3;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  displayProblem();
}

function displayProblem() {
  const problem = problems[currentProblemIndex];
  updateProgressBar();
  problemDiv.textContent = `${problem.x} x ${problem.y} =`;
  input.value = '';
  input.focus();
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDiv.textContent = `Time: ${elapsed}s`;
}

function updateProgressBar() {
  const progressBar = document.getElementById('progress') as HTMLProgressElement;
  progressBar.value = ((currentProblemIndex+ 1) / problems.length) * 100;
}

function checkAnswer() {
  const problem = problems[currentProblemIndex];
  const correctAnswer = problem.x * problem.y;
  const userAnswer = parseInt(input.value);

  if (userAnswer === correctAnswer) {
    currentProblemIndex++;
    if (currentProblemIndex < problems.length) {
      displayProblem();
    } else {
      endTest();
    }
  } else {
    input.classList.add('incorrect');
    input.value = '';
    setTimeout(() =>
    {
      input.classList.remove('incorrect')
    }, 500);
  }
}

function endTest() {
  clearInterval(timerInterval);
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  const finishDate = new Date().toISOString();
  pastResults.push({ time: totalTime, date: finishDate });
  localStorage.setItem('results', JSON.stringify(pastResults));
  displayResults();
}


function displayResults() {
  resultsDiv.innerHTML = `<h2>Time taken: ${Math.floor((Date.now() - startTime) / 1000)}s</h2><h3>Past Results:</h3><ul>${pastResults.map(result => `<li>Time: ${result.time}s, Date: ${result.date}</li>`).join('')}</ul>`;
}

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkAnswer();
  }
});

startTest();
//startSimpleTest();