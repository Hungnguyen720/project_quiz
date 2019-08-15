function Question(question, choices, answerkey) {
  this.question = question;
  this.choices = choices;
  this.answerkey = answerkey;
}

function Quiz(questions) {
  this.questions = questions;
  this.score = 0;
  this.currentIndex = 0;
}

Quiz.prototype.getCurrentQuestion = function () {
  return this.questions[this.currentIndex];
};

Quiz.prototype.reset = function () {
  this.score = 0;
  this.currentIndex = 0;
}


Question.prototype.isCorrect = function (guessKey) {
  return this.answerkey === guessKey;
};

Quiz.prototype.nextIndex = function () {
  this.currentIndex++;
};

//if the current index = questions length
Quiz.prototype.hasEnded = function () {
  return this.currentIndex === this.questions.length;
};

Quiz.prototype.guess = function (userGuess) {
  const currentQuestion = this.questions[this.currentIndex];
  if (currentQuestion.isCorrect(userGuess)) {
    this.score++;
  }
  this.nextIndex();
};

const App = (() => {
  const quizEl = document.querySelector(".jabquiz");
  const quizQuestionEl = document.querySelector(".jabquiz__question");
  const trackerEL = document.querySelector(".jabquiz__tracker");
  const taglineEl = document.querySelector(".jabquiz__tagline");
  const choicesEl = document.querySelector(".jabquiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButtonEl = document.querySelector(".next")
  const restartButtonEl = document.querySelector(".restart")

  const q1 = new Question("what is 1+1", [1, 2, 3, 4], 1);
  const q2 = new Question("what is 1+2", [1, 2, 3, 4], 2);
  const q3 = new Question("what is 1+3", [1, 2, 3, 4], 3);
  const q4 = new Question("what is 1+4", [1, 2, 3, 5], 3);
  const q5 = new Question("what is 1+5", [1, 2, 3, 6], 3);
  const q6 = new Question("what is 1+6", [1, 2, 3, 7], 3);
  const q7 = new Question("what is 1+7", [1, 2, 3, 8], 3);
  const q8 = new Question("what is 1+8", [1, 2, 3, 9], 3);

  const quiz = new Quiz([q1, q2, q3, q4, q5, q6, q7, q8])

  const listeners = _ => {
    nextButtonEl.addEventListener("click", function () {
      const selectedRadioElem = document.querySelector('input[name="choice"]:checked')
      if (selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute("data-order"))
        quiz.guess(key)
        renderAll();
      }
    })

    restartButtonEl.addEventListener("click", function () {
      // 1. reset the quiz
      quiz.reset()
      // 2. render all again
      renderAll()
      // 3. restore next button
      nextButtonEl.style.opacity = 1
    })
  }

  const renderQuestion = (_) => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question)
  }

  const setValue = (elem, value) => {
    elem.innerHTML = value
  }


  const renderChoicesElements = _ => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
      <li class="jabquiz__choice">
      <input
        type="radio"
        data-order="${index}"
        name="choice"
        class="jabquiz__input"
        id="choice${index}"
      />
      <label for="choice${index}" class="jabquiz__label">
        <i></i>
          <span>${elem}</span>
      </label>
    </li>
      `
    })
    choicesEl.innerHTML = markup;
  }

  const renderTracker = _ => {
    const index = quiz.currentIndex
    setValue(trackerEL, `${index+1} of ${quiz.questions.length}`)
  }


  const getPercentage = (num1, num2) => {
    return Math.round((num1 / num2) * 100)
  }

  const launch = (width, maxPercent) => {
    let loadingBar = setInterval(function () {
      if (width > maxPercent) {
        clearInterval(loadingBar)
      } else {
        width++;
        progressInnerEl.style.width = width + "%"
      }
    }, 3)
  }

  const renderProgress = _ => {
    //1. width
    const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length)
    //2. launch(0, width)
    launch(0, currentWidth)

  }

  const renderEndScreen = _ => {
    setValue(quizQuestionEl, 'Great Job')
    setValue(taglineEl, 'Complete')
    document.getElementById('jabquiz__tracker').innerHTML = `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`;
    nextButtonEl.style.opacity = 0;
    renderProgress();
  }

  renderQuestion();
  renderChoicesElements();
  renderTracker();
  renderProgress();




  const renderAll = (_) => {
    if (quiz.hasEnded()) {
      // render game ended
      renderEndScreen()
    } else {
      // 1. render the question
      renderQuestion();
      // 2. render the answer choices
      renderChoicesElements()
      // 3. render the tracker
      renderTracker();
      renderProgress();
    }
  }
  //if new game render quiz

  return {
    renderAll: renderAll,
    listeners: listeners
  }

})();

App.renderAll();
App.listeners();
