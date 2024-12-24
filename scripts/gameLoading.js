import getText from "./getText.js";

const startWindow = document.querySelector('.start-window');
const gameWindow = document.querySelector('.game-window');
const textP = document.querySelector('.game-window__div-interactive__p');

const playButton = document.querySelector('.start-window__button-play');

const integrateText = async () => {
    const text = await getText();
    switchVisibility();

    textP.innerHTML += `${text}`;
};

const switchVisibility = () => {
    startWindow.classList.toggle('hidden');
    gameWindow.classList.toggle('hidden');
};

playButton.addEventListener('click', integrateText);