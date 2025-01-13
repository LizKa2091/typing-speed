const feedbackLink = document.querySelector('.feedback-link');
const feedbackSection = document.querySelector('.footer__h3');

const showFeedback = (e) => {
    window.scroll({
        top: 10000,
        left: 0,
        behavior: 'smooth'
    });

    feedbackSection.classList.add('highlight');
    setTimeout(() => feedbackSection.classList.remove('highlight'), 1500);
};

feedbackLink.addEventListener('click', showFeedback);