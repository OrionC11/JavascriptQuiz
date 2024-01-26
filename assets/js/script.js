var timerEl = document.getElementById('timer')
var startButton = document.getElementById("startBtn")
var content = document.querySelector('.contentContainer')
var main = document.querySelector('.mainContent')
var title = document.getElementById('mainTitle')
var description = document.getElementById('desc')
var viewHS = document.querySelector(".viewBtn")


// This will create a container which will be updated later with the correctness of the answers
var correctnessContainer = document.createElement('p')
correctnessContainer.setAttribute('id', 'correctness')
content.appendChild(correctnessContainer)


// This declares and creates an JSON formatted object storing all the questions answers and correct answer values.
var quizQuestions = [
    {
        question: "Commonly Used data types DO NOT include:",
        answers: [
            "1. Strings", 
            "2. Booleans", 
            "3. Alerts",
            "4. Numbers"
        ],
        correctanswer: "3. Alerts" },
    { 
        question: "The condition in an if/else statement is enclosed within ______.",
        answers: [
            "1. Quotes",
            "2. Curly Brackets",
            "3. Parentheses",
            "4. Square Brackets"
        ],
        correctanswer: "3. Parentheses"}, 
    {
        question: "Arrays in Javascript can be used to store _____.",
        answers: [
            "1. Numbers and Strings",
            "2. Other Arrays",
            "3. Booleans",
            "4. All of The Above"
        ],
        correctanswer: "4. All of The Above"},
    {
        question: "String values must be enclosed within _____ when being assigned to variables.",
        answers: [
           "1. Commas",
           "2. Curly Brackets",
           "3. Quotes",
           "4. Parentheses"
        ],
        correctanswer: "3. Quotes"},
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: [
            "1. JavaScript",
            "2. Terminal/Bash",
            "3. For Loops",
            "4. Console.Log"
        ],
        correctanswer: "4. Console.Log"}
]


// Below declares variables in the global scope for access from all functions
var timerValue = 90
var timerInterval
var score = 0


// startTimer is used to triger a 90 second timer starting when the startquiz function is run
function startTimer(){
    timerInterval = setInterval(function (){
        timerEl.textContent = 'Time: ' + timerValue
        timerValue--;
        if (timerValue <= 0) {
            clearInterval(timerInterval)
            endQuiz();
        }
    }, 1000)
}


function startQuiz(){
    
    // This will remove the starter code
   startButton.remove()
   title.remove()
   description.remove()

    // The following sets an index starting at 0 referring to which question we will be accessing
    var questionIndex = 0

    // handleAnswer is in place to check the answer selected by the users click and determine the correctness of said answer printing it in the earlier created container and changes the score/time based on whether incorrect or correct
    function handleAnswer(selectedAnswer) {
        var currentQuestion = quizQuestions[questionIndex]
        var correctness = document.createTextNode('')
        correctnessContainer.appendChild(correctness)

        if (selectedAnswer === currentQuestion.correctanswer){
            score++
            correctness.textContent = 'Correct!'
        } else {
            timerValue = timerValue - 10
            correctness.textContent = "Incorrect!"
        }
        // Below it moves the question index up by 1 to move to the next question and runs the display next question function, the timeout makes the grayed "correct" or "incorrect" fade away after 1.2s
        questionIndex++
        displayNextQuestion()
        setTimeout(function () {
            correctness.textContent = '';
        }, 1200);
    }
    function displayAnswers() {
        // This for loop sets the 4 answers paired with each question to their respective buttons.
        
        for (var i = 0; i < 4; i++) {
            var answerButton = document.createElement('button')
            answerButton.textContent = quizQuestions[questionIndex].answers[i]
            answerButton.setAttribute('class', 'btn quizbtn')
            answerButton.addEventListener('click', function(){
                // This reads the text of the button which the user clicks and runs it through the handleAnswer function to determine correctness, "this" refers to the button that the user directly clicks
                handleAnswer(this.textContent)
            })
            main.appendChild(answerButton)
        }
    }

    // The function below is used to remove each button before displaying the next question
    function clearAnswers() {
        var buttons = document.querySelectorAll('.btn')
        buttons.forEach(function(button){
            button.remove()
        })
    }
    function displayNextQuestion() {
        // This runs the clearAnswers function making space for new answers then if there are still questions left in the quizQuestions object it runs the displayNextQuestion function trigger the next question to start, and otherwise runs endquiz
        clearAnswers()
        if (questionIndex < quizQuestions.length) {
            var currentQuestion = quizQuestions[questionIndex]
            newQuestion.textContent = currentQuestion.question
            displayAnswers(currentQuestion.answers)
        } else {
            endQuiz()
        }
    }

    // Here the timer is officially started and the question box is created and populated for the first time
    startTimer()
    var newQuestion = document.createElement('h3')
    main.appendChild(newQuestion)
    displayNextQuestion()
    return score
}

    // The endQuiz function is used to end the quiz either upon the timer reaching 0 or the quiz having no more questions left, then asks the user to input initials for the highscores, and then adds a button for you to click to view the highscores
function endQuiz(){
    while (main.firstChild) {
        main.removeChild(main.firstChild)
    }
    clearInterval(timerInterval)
    var ending = document.createElement('h2')
    var endingScore = document.createElement('h3')
    var hsbutton = document.createElement('button')
    hsbutton.setAttribute('class','btn')
    var userInitials = prompt("Enter your Initials:")

    // This if statement checks to make sure the user did not input nothing or just a bunch of spaces before comitting the initials and score to the highscores object in local storage.
    if (userInitials !== null && userInitials.trim() !== "") {
        var highscores = JSON.parse(localStorage.getItem('highscores')) || []
        highscores.push({initials: userInitials, score: score*10})
        localStorage.setItem('highscores', JSON.stringify(highscores))
    }
    ending.textContent = "The End!"
    endingScore.textContent = "Your score: " + score*10 + "/" + "50"
    hsbutton.textContent = "View Highscores!"
    hsbutton.addEventListener('click', displayHighScores)
    main.appendChild(ending)
    main.appendChild(endingScore)
    main.appendChild(hsbutton)

}


// The displayHighScores function first pulls the local storage item highscores and if it cant find highscore it sets the value equal to an empty array
// It then iterates through main to remove all of main's children before creating a new title element for the highscores screen, it then checks if the highscores object is empty and if it is prints no scores present
// As long as the highscores object is not empty it creates an ordered list displaying the highscores with the initials first followed by the score they got
// last but not least it creates a button which is used to refresh the page and send you back to the beginning so that youre not stuck on the highscore screen.
function displayHighScores(){
    var highscores = JSON.parse(localStorage.getItem('highscores')) || []
    while (main.firstChild) {
        main.removeChild(main.firstChild)
    }
    var hsTitle = document.createElement('h2')
    hsTitle.textContent = "High Scores out of 50"
    main.appendChild(hsTitle)
    if (highscores.length === 0) {
        var noScores = document.createElement('p')
        noScores.textContent = "No High Scores Available Yet."
        main.appendChild(noScores)
    } else {
        
        var scoreList = document.createElement('ul')
        var i = 0
        while (i < highscores.length){
            var scoreItem = document.createElement('li')
            scoreItem.textContent = highscores[i].initials + " : " + highscores[i].score
            scoreList.appendChild(scoreItem)
            i++
        }
        
        main.appendChild(scoreList)

        var backBtn = document.createElement('button')
        backBtn.textContent = "Back to Beginning"
        backBtn.setAttribute('class', 'btn')
        backBtn.addEventListener('click', refreshpage)
        main.appendChild(backBtn)
    }
}

// This function is used solely to refresh the page
function refreshpage() {
    location.reload()
}


// Finally added the event listeners which allow the buttons to run the code
startButton.addEventListener('click', startQuiz)
viewHS.addEventListener('click', displayHighScores)
