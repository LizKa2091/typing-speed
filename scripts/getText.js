const getText = async () => {
    try {
        const response = await fetch('https://fish-text.ru/get?number=5');
        
        if (!response.ok) {
            throw new Error('ответ сервера: ошибка');
        }

        const res = await response.json();
        const generatedText = res.text;
        
        return generatedText;
    } 
    catch (error) {
        console.error('Ошибка при получении текста:', error);
    }
};

export default getText;
