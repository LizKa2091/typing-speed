const getText = async () => {
    try {
        const response = await fetch('https://fish-text.ru/get?number=5');
        
        if (!response.ok) {
            throw new Error('response status not ok');
        }

        const res = await response.json();
        const generatedText = res.text;
        
        let lastSymb = 500;
        if ('а' <= generatedText[500] && generatedText[500] <= 'я') {
            for (let i=501; i<generatedText.length; i++) {

                if (!('а' <= generatedText[i] && generatedText[i] <= 'я')) {
                    lastSymb = i;
                    break;
                }
            }
        }

        let resultText = generatedText.slice(0, lastSymb).replaceAll('’', `'`).replaceAll('—', '-');

        return [resultText, null];
    } 
    catch (err) {
        throw new Error(`failed to fetch: ${err}`);
    }
};

export default getText;
