var problemDiv = document.getElementById('problem');
var input = document.getElementById('input');
var timerDiv = document.getElementById('timer');
var resultsDiv = document.getElementById('results');
var problems = [];
for (var i = 0; i <= 10; i++) {
    for (var j = 0; j <= 10; j++) {
        problems.push({ x: i, y: j });
    }
}
var currentProblemIndex = 0;
var startTime;
var timerInterval;
var pastResults = JSON.parse(localStorage.getItem('results') || '[]');
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
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
function startSimpleTest() {
    shuffleArray(problems);
    currentProblemIndex = problems.length - 3;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    displayProblem();
}
function displayProblem() {
    var problem = problems[currentProblemIndex];
    problemDiv.textContent = "".concat(problem.x, " x ").concat(problem.y, " =");
    input.value = '';
    input.focus();
}
function updateTimer() {
    var elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDiv.textContent = "Time: ".concat(elapsed, "s");
}
function checkAnswer() {
    var problem = problems[currentProblemIndex];
    var correctAnswer = problem.x * problem.y;
    var userAnswer = parseInt(input.value);
    if (userAnswer === correctAnswer) {
        currentProblemIndex++;
        if (currentProblemIndex < problems.length) {
            displayProblem();
        }
        else {
            endTest();
        }
    }
    else {
        input.classList.add('incorrect');
        input.value = '';
        setTimeout(function () {
            input.classList.remove('incorrect');
        }, 500);
    }
}
function endTest() {
    clearInterval(timerInterval);
    var totalTime = Math.floor((Date.now() - startTime) / 1000);
    var finishDate = new Date().toISOString();
    pastResults.push({ time: totalTime, date: finishDate });
    localStorage.setItem('results', JSON.stringify(pastResults));
    displayResults();
}
function displayResults() {
    resultsDiv.innerHTML = "<h2>Time taken: ".concat(Math.floor((Date.now() - startTime) / 1000), "s</h2><h3>Past Results:</h3><ul>").concat(pastResults.map(function (result) { return "<li>Time: ".concat(result.time, "s, Date: ").concat(result.date, "</li>"); }).join(''), "</ul>");
}
input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});
//startTest();
startSimpleTest();
