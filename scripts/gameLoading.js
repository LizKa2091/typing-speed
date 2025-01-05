import getText from "./getText.js";
import updatePositionAllowed from './updatePositionAllowed.js';

const startWindow = document.querySelector('.start-window');

const gameWindow = document.querySelector('.game-window');
const textP = document.querySelector('.game-window__div-interactive__p');

const optionsDiv = document.querySelector('.start-window__div-options');
const randomTextButton = document.querySelector('.start-window__div-options__button-rand-text');
const wikiTextButton = document.querySelector('.start-window__div-options__button-wiki-text');
const randomCompositionButton = document.querySelector('.start-window__div-options__button-rand-comp');

const playButton = document.querySelector('.start-window__button-play');

const userInputField = document.querySelector('.game-window__div-interactive__input');

const speedSpan = document.querySelector('.game-window__div-statistics__span-speed');
const errorsSpan = document.querySelector('.game-window__div-statistics__span-errors');
const recordSpan = document.querySelector('.game-window__div-statistics__span-record');

const resultWindow = document.querySelector('.result-window');
const resultP = document.querySelector('.result-window__info');

const userPositionLine = document.querySelector('.game-window__div-position__line');

const textInfoObj = {
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
    showLoading();

    const text = await getText();

    switchWindowVisibility();

    textInfoObj.correctText = text;
    textP.innerHTML += `${text}`;
};

const switchOptionsVisibility = () => {
    playButton.classList.toggle('hidden');
    optionsDiv.classList.toggle('hidden');
};

const switchWindowVisibility = () => {
    startWindow.classList.toggle('hidden');
    gameWindow.classList.toggle('hidden');
};

const showLoading = () => {
    optionsDiv.classList.toggle('hidden');

    document.querySelector('.start-window__div-loading').classList.toggle('hidden');
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

    textP.innerHTML = (!textInfoObj.showingErrorMessage ? 
    `<span class='game-window__div-interactive__p__span-current'>${textInfoObj.userText}</span>${textInfoObj.correctText.slice(textInfoObj.userText.length, textInfoObj.correctText.length)}`
    : `<span class='game-window__div-interactive__p__span-current'>${textInfoObj.userText.slice(0, textInfoObj.wrongChars)}</span><span class='game-window__div-interactive__p__span-incorrect'>${textInfoObj.middlePartWrong}</span>${textInfoObj.rightPartCorrect}`
    );

    const currTypedText = document.querySelector('.game-window__div-interactive__p__span-current');
    currTypedText.style.color = 'wheat';
    currTypedText.style.textDecoration = 'underline';
};

const getInput = (e) => {
    textInfoObj.userText = e.target.value;

    //avoid backspace errors
    if (textInfoObj.userText.trim() === '') {
        return;
    }

    //error was detected
    if (userInputField.value !== textInfoObj.correctText.slice(0, textInfoObj.userText.length)) {
        textInfoObj.errors+=1;

        //index of error char
        if (textInfoObj.wrongChars.length === 0) {
            textInfoObj.wrongChars = textInfoObj.userText.length - 1;
        }

        //length of wrong chars has changed, then update value of textInfoObj.wrongChars

        if (!textInfoObj.showingErrorMessage) {
            textInfoObj.showingErrorMessage = true;
            errorMessage.classList.add('error-message');
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '1.5rem';
            errorMessage.textContent = 'Исправьте ошибку';
        }
            
        userInputField.parentNode.insertBefore(errorMessage, userInputField);
    }

    //error wasn't detected
    else {
        textInfoObj.showingErrorMessage = false;
        textInfoObj.wrongChars = '';

        styleDefaultInput(userInputField);
        errorMessage.remove();
    }


    if (textInfoObj.errors > 0) {
        textInfoObj.rightPartCorrect = textInfoObj.correctText.slice(textInfoObj.wrongChars, textInfoObj.correctText.length);
        textInfoObj.middlePartWrong = textInfoObj.userText.slice(textInfoObj.wrongChars)
    }

    insertWords();

    if (textInfoObj.showingErrorMessage) {
        styleErrorInput(userInputField);
    }

    const isUpdatePositionAllowed = updatePositionAllowed(textInfoObj.correctText.length, textInfoObj.userText.length, window.getComputedStyle(userPositionLine).width, textInfoObj.checkpoint);

    if (isUpdatePositionAllowed[0] === true && !textInfoObj.showingErrorMessage) {
        textInfoObj.checkpoint++;

        const distance = isUpdatePositionAllowed[1];
        const userPositionHuman = document.querySelector('.game-window__div-position__img');

        const currentLeft = parseInt(window.getComputedStyle(userPositionHuman).left);
        userPositionHuman.style.left = `${currentLeft + distance}px`;
    }

    if (textInfoObj.correctText === textInfoObj.userText) {
        const prevRecord = localStorage.getItem('record');
        const newRecord = textInfoObj.speed.toFixed(2);

        if (!prevRecord || prevRecord < newRecord) {
            localStorage.setItem('record', newRecord);
        }

        gameWindow.classList.toggle('hidden');
        resultWindow.classList.toggle('hidden');

        resultP.textContent += `${textInfoObj.speed.toFixed(2)} знаков в минуту, количество ошибок: ${textInfoObj.errors}`;
    }

    if (textInfoObj.userText.length > 0 && textInfoObj.currentlyTyping) {
        const currentTime = new Date();
        const timeElapsed = (currentTime - textInfoObj.startTime) / 1000;

        textInfoObj.speed = textInfoObj.userText.length / (timeElapsed / 60);
        speedSpan.textContent = `Текущая скорость печати: ${textInfoObj.speed.toFixed(2)}`;
        errorsSpan.textContent = `Текущее кол-во ошибок: ${textInfoObj.errors}`;
    }
};

const startTimer = () => {
    if (!textInfoObj.currentlyTyping) {
        textInfoObj.startTime = new Date();
        textInfoObj.currentlyTyping = true;
    }
};

playButton.addEventListener('click', switchOptionsVisibility);
userInputField.addEventListener('input', getInput);
userInputField.addEventListener('focus', startTimer);

randomTextButton.addEventListener('click', integrateText);
//wikiTextButton.addEventListener('click', );
//randomCompositionButton.addEventListener('click', )

document.addEventListener('DOMContentLoaded', () => {
    const recordData = localStorage.getItem('record');

    recordSpan.textContent = recordData ? `Ваш текущий рекорд: ${recordData} знаков в минуту` : `У вас нет рекорда. Начните игру и установите собственный рекорд!`;
});