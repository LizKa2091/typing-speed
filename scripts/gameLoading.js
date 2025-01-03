import getText from "./getText.js";
import updatePositionAllowed from './updatePositionAllowed.js';

const startWindow = document.querySelector('.start-window');
const gameWindow = document.querySelector('.game-window');
const textP = document.querySelector('.game-window__div-interactive__p');

const playButton = document.querySelector('.start-window__button-play');

const userInputField = document.querySelector('.game-window__div-interactive__input');

const resultWindow = document.querySelector('.result-window');
const resultP = document.querySelector('.result-window__info');

const userPositionLine = document.querySelector('.game-window__div-position__line');

const userInputObj = {
    userText: '',
    userInputText: '',
    correctText: '',
    currentlyTyping: false,
    startTime: null,
    speed: null,
    checkpoint: 0,
    errors: 0,
    wrongChars: '',
    showingErrorMessage: false
};

const errorMessage = document.createElement('span');

const integrateText = async () => {
    const text = await getText();
    switchVisibility();

    userInputObj.correctText = text;
    textP.innerHTML += `${text}`;
};

const switchVisibility = () => {
    startWindow.classList.toggle('hidden');
    gameWindow.classList.toggle('hidden');
};

const styleErrorInput = (input) => {
    input.style.color = 'red';
    input.style.border = '3px solid red';
    
    const incorrectPart = document.querySelector('.game-window__div-interactive__p__span-incorrect');
    
    if (incorrectPart === null) {
        return;
    }

    incorrectPart.style.color = 'red';
    incorrectPart.style.textDecoration = 'underline';
    incorrectPart.style.fontWeight = 'bold';
};

const styleDefaultInput = (input) => {
    input.style.color = '#000';
    input.style.border = '1px solid black';
};

const insertWords = () => {
    textP.textContent = '';

    textP.innerHTML = (!userInputObj.showingErrorMessage ? 
    `<span class='game-window__div-interactive__p__span-current'>${userInputObj.userText}</span>${userInputObj.correctText.slice(userInputObj.userText.length, userInputObj.correctText.length)}`
    : `<span class='game-window__div-interactive__p__span-current'>${userInputObj.userText.slice(0, userInputObj.wrongChars)}</span><span class='game-window__div-interactive__p__span-incorrect'>${userInputObj.middlePartWrong}</span>${userInputObj.rightPartCorrect}`
    );

    const currTypedText = document.querySelector('.game-window__div-interactive__p__span-current');
    currTypedText.style.color = 'wheat';
    currTypedText.style.textDecoration = 'underline';
};

const getInput = (e) => {
    userInputObj.userText = e.target.value;

    //avoid backspace errors
    if (userInputObj.userText.trim() === '') {
        return;
    }

    //error was detected
    if (userInputField.value !== userInputObj.correctText.slice(0, userInputObj.userText.length)) {
        userInputObj.errors+=1;

        //index of error char
        if (userInputObj.wrongChars.length === 0) {
            userInputObj.wrongChars = userInputObj.userText.length - 1;
        }

        //length of wrong chars has changed, then update value of userInputObj.wrongChars

        if (!userInputObj.showingErrorMessage) {
            userInputObj.showingErrorMessage = true;
            errorMessage.classList.add('error-message');
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '1.5rem';
            errorMessage.textContent = 'Исправьте ошибку';
        }
            
        userInputField.parentNode.insertBefore(errorMessage, userInputField);
    }

    //error wasn't detected
    else {
        userInputObj.showingErrorMessage = false;
        userInputObj.wrongChars = '';

        styleDefaultInput(userInputField);
        errorMessage.remove();
    }


    if (userInputObj.errors > 0) {
        userInputObj.rightPartCorrect = userInputObj.correctText.slice(userInputObj.wrongChars, userInputObj.correctText.length);
        userInputObj.middlePartWrong = userInputObj.userText.slice(userInputObj.wrongChars)
    }

    insertWords();

    if (userInputObj.showingErrorMessage) {
        styleErrorInput(userInputField);
    }

    const isUpdatePositionAllowed = updatePositionAllowed(userInputObj.correctText.length, userInputObj.userText.length, window.getComputedStyle(userPositionLine).width, userInputObj.checkpoint);

    if (isUpdatePositionAllowed[0] === true && !userInputObj.showingErrorMessage) {
        userInputObj.checkpoint++;

        const distance = isUpdatePositionAllowed[1];
        const userPositionHuman = document.querySelector('.game-window__div-position__img');

        const currentLeft = parseInt(window.getComputedStyle(userPositionHuman).left);
        userPositionHuman.style.left = `${currentLeft + distance}px`;
    }

    if (userInputObj.correctText === userInputObj.userText) {
        gameWindow.classList.toggle('hidden');
        resultWindow.classList.toggle('hidden');

        resultP.textContent += `${userInputObj.speed.toFixed(2)} знаков в минуту`;
    }

    if (userInputObj.userText.length > 0 && userInputObj.currentlyTyping) {
        const currentTime = new Date();
        const timeElapsed = (currentTime - userInputObj.startTime) / 1000;

        userInputObj.speed = userInputObj.userText.length / (timeElapsed / 60);

    }
};

const startTimer = () => {
    if (!userInputObj.currentlyTyping) {
        userInputObj.startTime = new Date();
        userInputObj.currentlyTyping = true;
    }
};

playButton.addEventListener('click', integrateText);
userInputField.addEventListener('input', getInput);
userInputField.addEventListener('focus', startTimer);