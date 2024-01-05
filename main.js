import "./style.css";
import { Questions } from "./questions";

const app = document.querySelector("#app");
const startBtn = document.querySelector("#start");

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
	let currentQuestion = 0;
	let score = 0;

	displayQuestion(currentQuestion);

	function clean() {
		while (app.firstElementChild) {
			app.firstElementChild.remove();
		}
        const progress = getProgressBar(Questions.length, currentQuestion)
        app.appendChild(progress)

	}

	function displayQuestion(index) {
        clean()

		const question = Questions[index];

		if (!question) {
		    displayFinishMessage()
            return
		}

		const title = getTitleElement(question.question);
		app.appendChild(title);

		const answersDiv = createAnswers(question.answers);
		app.appendChild(answersDiv);

		const submitBtn = getSubmitBtn();
		app.appendChild(submitBtn);
		submitBtn.addEventListener("click", submit);
	}

    function displayFinishMessage() {
        const h1 = document.createElement("h1")
        h1.innerText = "Bravo, tu as fini le Quiz !"

        const p = document.createElement("p")
        p.innerText = `Ton score est de ${score} sur ${Questions.length} points.`

        app.appendChild(h1)
        app.appendChild(p)
    }

	function submit() {
		const selectedAnswer = app.querySelector('input[name="answer"]:checked');

        disableAllAnswers()

		const value = selectedAnswer.value;
		const question = Questions[currentQuestion];
		const isCorrect = question.correct === value;

		if (isCorrect) {
			score++;
		}

		showFeedback(isCorrect, question.correct, value);
        const feedback = getFeedbackMassage(isCorrect, question.correct)
        app.appendChild(feedback)

        displayNextQuestionbutton(() => {
            currentQuestion++
            displayQuestion(currentQuestion)
        })
	}

	function createAnswers(answers) {
		const answersDiv = document.createElement("div");
		answersDiv.classList.add("answers");

		for (const answer of answers) {
			const label = getAnswerElement(answer);
			answersDiv.appendChild(label);
		}

		return answersDiv;
	}
}

function getTitleElement(text) {
	const title = document.createElement("h3");
	title.innerText = text;
	return title;
}

function formatId(text) {
	return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

function getAnswerElement(text) {
	const label = document.createElement("label");
	label.innerText = text;
	const input = document.createElement("input");
	const id = formatId(text);
	input.id = id;
	label.htmlFor = id;
	input.setAttribute("type", "radio");
	input.setAttribute("name", "answer");
	input.setAttribute("value", text);

	label.appendChild(input);

	return label;
}

function getSubmitBtn() {
	const submitBtn = document.createElement("button");
	submitBtn.innerText = "Submit";

	return submitBtn;
}

function showFeedback(isCorrect, correct, answer) {
	const correctAnswerId = formatId(correct);
	const correctElement = document.querySelector(
		`label[for="${correctAnswerId}"]`
	);

	const selectedAnswerId = formatId(answer);
	const selectedElement = document.querySelector(
		`label[for="${selectedAnswerId}"]`
	);

	if (isCorrect) {
		selectedElement.classList.add("correct");
	} else {
		selectedElement.classList.add("incorrect");
		correctElement.classList.add("correct");
	}
}

function getFeedbackMassage(isCorrect, correct) {
    const paragraphe = document.createElement("p")
    paragraphe.innerText = isCorrect? "Bravo, tu as trouvé la bonne répone" : `Oups, la bonne réponse était ${correct}`

    return paragraphe
}

function getProgressBar(max, value) {
    const progress = document.createElement("progress")
    progress.setAttribute("max", max)
    progress.setAttribute("value", value)

    return progress
}

function displayNextQuestionbutton(callback) {
    const TIMEOUT = 4000
    let remainingTimeout = TIMEOUT

    app.querySelector("button").remove()

    const getBtnText = () => `Next (${remainingTimeout / 1000}s)`

    const nextBtn = document.createElement("button")
    nextBtn.innerText = getBtnText()
    app.appendChild(nextBtn)

    const interval = setInterval(() => {
        remainingTimeout -= 1000
        nextBtn.innerText= getBtnText()
    }, 1000);

    const timeout = setTimeout(() => {
        handleNextQuestion()
    }, TIMEOUT);

    const handleNextQuestion = () => {
        clearInterval(interval)
        clearTimeout(timeout)
        callback()
    }
    
    nextBtn.addEventListener("click", () => {
        handleNextQuestion()
    })
}

function disableAllAnswers() {
    const radioInputs = document.querySelectorAll('input[type="radio"]')

    for (const radio of radioInputs){
        radio.disabled = true
    }
}