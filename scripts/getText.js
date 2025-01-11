const getText = async () => {
    try {
        const response = await fetch('https://fish-text.ru/get?number=5');
        
        if (!response.ok) {
            throw new Error('response status not ok');
        }

        const res = await response.json();
        const generatedText = res.text;
        
        return [generatedText.replaceAll('—', '-'), null];
    } 
    catch (err) {
        throw new Error(`failed to fetch: ${err}`);
    }
};

export default getText;
