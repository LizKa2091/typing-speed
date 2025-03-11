import getText from "./getText.js";
import getWikiText from "./getWikiText.js";
import getComposition from "./getComposition.js";
import updatePositionAllowed from './updatePositionAllowed.js';

const elements = {
    startWindow: document.querySelector('.start-window'),
    optionsDiv: document.querySelector('.start-window__div-options'),
    playButton: document.querySelector('.start-window__button-play'),
    compositionInputDiv: document.querySelector('.start-window__div-comp-query'),
    compositionInput: document.querySelector('.start-window__div-comp-query__input'),
    compositionButton: document.querySelector('.start-window__div-comp-query__button'),
    errMsg: document.querySelector('.error-message'),
    gameWindow: document.querySelector('.game-window'),
    textP: document.querySelector('.game-window__div-interactive__p'),
    randomTextButton: document.querySelector('.start-window__div-options__button-rand-text'),
    wikiTextButton: document.querySelector('.start-window__div-options__button-wiki-text'),
    randomCompositionButton: document.querySelector('.start-window__div-options__button-rand-comp'),
    userInputField: document.querySelector('.game-window__div-interactive__input'),
    speedSpan: document.querySelector('.game-window__div-statistics__span-speed'),
    errorsSpan: document.querySelector('.game-window__div-statistics__span-errors'),
    recordSpan: document.querySelector('.game-window__div-statistics__span-record'),
    resultWindow: document.querySelector('.result-window'),
    resultP: document.querySelector('.result-window__info'),
    resultBookDiv: document.querySelector('.result-window__book-info'),
    userPositionLine: document.querySelector('.game-window__div-position__line'),
}; 

const errorMessage = document.createElement('span');

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
    showingErrorMessage: false,
    isComposition: false
};

const switchOptionsVisibility = () => {
    elements.playButton.classList.toggle('hidden');
    elements.optionsDiv.classList.toggle('hidden');

    textInfoObj.errors = 0;
    elements.userInputField.value = '';
};

const switchWindowVisibility = () => {
    elements.startWindow.classList.toggle('hidden');
    elements.gameWindow.classList.toggle('hidden');
};

const showLoading = () => {
    elements.optionsDiv.classList.toggle('hidden');

    document.querySelector('.start-window__div-loading').classList.toggle('hidden');
};

const reqUserCompositionInput = () => {
    elements.optionsDiv.classList.toggle('hidden');
    elements.compositionInputDiv.classList.toggle('hidden');

    elements.compositionInput.addEventListener('input', getCompositionInput);
    elements.compositionButton.addEventListener('click', processCompositionButton);
};

const getCompositionInput = (e) => {
    const value = e.target.value;

    const allLettersAreEn = /^[a-zA-Z]+$/.test(value);
    const isSingleWord = !value.includes(' ');

    if (!allLettersAreEn) {
        elements.errMsg.textContent = 'Все символы должны быть английскими буквами';
        elements.compositionButton.style.cursor = 'not-allowed';
    }

    if (!isSingleWord) {
        elements.errMsg.textContent = 'Должно быть всего 1 слово без пробелов';
        elements.compositionButton.style.cursor = 'not-allowed';
    }

    if (allLettersAreEn && isSingleWord) {
        elements.errMsg.textContent = '';
        elements.compositionInput.style.borderColor = '#fff';
        elements.compositionButton.style.cursor = 'pointer';
    }
};

const processCompositionButton = () => {
    if (elements.errMsg.textContent === '' && elements.compositionInput.value !== '') {
        integrateText(elements.compositionInput.value);
    }
};

const integrateText = async (type) => {
    showLoading();

    let res;
    switch (type) {
        case 'text':
            res = await getText();

            textInfoObj.isComposition = false;
            break;

        case 'wiki':
            res = await getWikiText();

            textInfoObj.isComposition = false;
            break;
        default: 
            elements.optionsDiv.classList.toggle('hidden');
            elements.compositionInputDiv.classList.toggle('hidden');

            res = await getComposition(type);

            if (res) {
                textInfoObj.isComposition = true;
                textInfoObj.bookAuthors = res[2];
                textInfoObj.bookTitle = res[3];
            }
            break;
    }
    
    if (res) {
        switchWindowVisibility();

        textInfoObj.correctText = res[0];
        elements.textP.innerHTML += `${res[0]}`;

        if (res[1]) {
            textInfoObj.bookImage = res[1];
        }
    }

    else {
        elements.compositionInputDiv.classList.toggle('hidden');
        document.querySelector('.start-window__div-loading').classList.toggle('hidden');
        
        elements.errMsg.textContent = 'По вашему запросу ничего не найдено. Попробуйте другое слово'
    }
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
    elements.textP.textContent = '';

    elements.textP.innerHTML = (!textInfoObj.showingErrorMessage ? 
    `<span class='game-window__div-interactive__p__span-current'>${textInfoObj.userText}</span>${textInfoObj.correctText.slice(textInfoObj.userText.length, textInfoObj.correctText.length)}`
    : `<span class='game-window__div-interactive__p__span-current'>${textInfoObj.userText.slice(0, textInfoObj.wrongChars)}</span><span class='game-window__div-interactive__p__span-incorrect'>${textInfoObj.middlePartWrong}</span>${textInfoObj.rightPartCorrect}`
    );

    const currTypedText = document.querySelector('.game-window__div-interactive__p__span-current');
    currTypedText.style.color = 'wheat';
    currTypedText.style.textDecoration = 'underline';
};

const getInput = (e) => {
    textInfoObj.userText = e.target.value;

    if (textInfoObj.userText.trim() === '') {
        elements.textP.textContent = '';
        elements.textP.innerHTML = `<span class='game-window__div-interactive__p__span-current'>${textInfoObj.userText}</span>${textInfoObj.correctText.slice(textInfoObj.userText.length, textInfoObj.correctText.length)}`

        styleDefaultInput(elements.userInputField);
    
        return;
    }

    if (elements.userInputField.value !== textInfoObj.correctText.slice(0, textInfoObj.userText.length)) {
        textInfoObj.errors+=1;

        if (textInfoObj.wrongChars.length === 0) {
            textInfoObj.wrongChars = textInfoObj.userText.length - 1;
        }


        if (!textInfoObj.showingErrorMessage) {
            textInfoObj.showingErrorMessage = true;
            errorMessage.classList.add('error-message');
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '1.5rem';
            errorMessage.textContent = 'Исправьте ошибку';
        }
            
        elements.userInputField.parentNode.insertBefore(errorMessage, elements.userInputField);
    }

    else {
        textInfoObj.showingErrorMessage = false;
        textInfoObj.wrongChars = '';

        styleDefaultInput(elements.userInputField);
        errorMessage.remove();
    }


    if (textInfoObj.errors > 0) {
        textInfoObj.rightPartCorrect = textInfoObj.correctText.slice(textInfoObj.wrongChars, textInfoObj.correctText.length);
        textInfoObj.middlePartWrong = textInfoObj.userText.slice(textInfoObj.wrongChars)
    }

    insertWords();

    if (textInfoObj.showingErrorMessage) {
        styleErrorInput(elements.userInputField);
    }

    const isUpdatePositionAllowed = updatePositionAllowed(textInfoObj.correctText.length, textInfoObj.userText.length, window.getComputedStyle(elements.userPositionLine).width, textInfoObj.checkpoint);

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

        elements.gameWindow.classList.toggle('hidden');  
        elements.resultWindow.classList.toggle('hidden');
        
        if (textInfoObj.isComposition) {
            elements.resultBookDiv.innerHTML = '';
            elements.resultBookDiv.innerHTML = `<p class='result-window__book-info__author'>${textInfoObj.bookAuthors.length > 1 ? 'Авторы' : 'Автор'}: ${textInfoObj.bookAuthors[0]}${textInfoObj.bookAuthors.slice(1).join(', ') ? '<br>' + textInfoObj.bookAuthors.slice(1).join(', ') : ''}</p>
                                        <p class='result-window__book-info__title'>Название: ${textInfoObj.bookTitle}</p>`;

            if (textInfoObj.bookImage) {
                elements.resultBookDiv.innerHTML += `<img src=${textInfoObj.bookImage} alt='book image'>`;
            }
        }

        elements.resultP.innerHTML = '';
        elements.resultP.innerHTML = `<p>Игра пройдена <br> Ваш результат: ${textInfoObj.speed.toFixed(2)} знаков в минуту <br> Количество ошибок: ${textInfoObj.errors}`;
    }

    if (textInfoObj.userText.length > 0 && textInfoObj.currentlyTyping) {
        const currentTime = new Date();
        const timeElapsed = (currentTime - textInfoObj.startTime) / 1000;

        textInfoObj.speed = textInfoObj.userText.length / (timeElapsed / 60);
        elements.speedSpan.textContent = `Текущая скорость печати: ${textInfoObj.speed.toFixed(2)}`;
        elements.errorsSpan.textContent = `Текущее кол-во ошибок: ${textInfoObj.errors}`;
    }
};

const startTimer = () => {
    if (!textInfoObj.currentlyTyping) {
        textInfoObj.startTime = new Date();
        textInfoObj.currentlyTyping = true;
    }
};

elements.playButton.addEventListener('click', switchOptionsVisibility);

elements.userInputField.addEventListener('input', getInput);
elements.userInputField.addEventListener('focus', startTimer);

elements.randomTextButton.addEventListener('click', () => integrateText('text'));
elements.wikiTextButton.addEventListener('click', () => integrateText('wiki'));
elements.randomCompositionButton.addEventListener('click', reqUserCompositionInput)

document.addEventListener('DOMContentLoaded', () => {
    const recordData = localStorage.getItem('record');

    elements.recordSpan.textContent = recordData ? `Ваш текущий рекорд: ${recordData} знаков в минуту` : `У вас нет рекорда. Начните игру и установите собственный рекорд!`;
});