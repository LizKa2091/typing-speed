import getText from "./getText.js";

const startWindow = document.querySelector('.start-window');
const gameWindow = document.querySelector('.game-window');
const textP = document.querySelector('.game-window__div-interactive__p');

const playButton = document.querySelector('.start-window__button-play');

const userInputField = document.querySelector('.game-window__div-interactive__input');

const userInputObj = {
    userText: '',
    userInputText: '',
    correctText: '',
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
    `<span class='game-window__div-interactive__p__span-current'>${userInputObj.userText}</span>${userInputObj.correctText.slice(userInputObj.userText.length, userInputObj.correctText.length-1)}`
    : `<span class='game-window__div-interactive__p__span-current'>${userInputObj.userText.slice(0, userInputObj.wrongChars)}</span><span class='game-window__div-interactive__p__span-incorrect'>${userInputObj.middlePartWrong}</span>${userInputObj.rightPartCorrect}`
    );

    const currTypedText = document.querySelector('.game-window__div-interactive__p__span-current');
    currTypedText.style.color = 'wheat';
    currTypedText.style.textDecoration = 'underline';
};

const getInput = (e) => {
    userInputObj.userText = e.target.value;

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
};

playButton.addEventListener('click', integrateText);
userInputField.addEventListener('input', getInput);