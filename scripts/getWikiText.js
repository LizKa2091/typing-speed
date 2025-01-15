const getWikiText = async () => {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext&exlimit=1&generator=random';

    try {
        let wrongReq = true;
        let articleText;
        let resultText

        while (wrongReq) {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('response status not ok');
            }
            
            const data = await response.json();
    
            const pageId = Object.keys(data.query.pages)[0];
            articleText = data.query.pages[pageId].extract;
    
            //avoid displaying empty text and text from forum
            if (articleText !== '' && !articleText.includes('delete') && !articleText.includes('http') && articleText.length >= 300 && !articleText.includes('file') && !articleText.includes('pronunciation') && !articleText.includes('talk') && !articleText.includes('edit') && !articleText.split('').filter(char => 'A' <= char.toUpperCase && char.toUpperCase <= 'Z' ).length > 0) {
                wrongReq = false;

                let lastSymb = 500;
                if ('a' <= articleText[500] && articleText[500] <= 'z') {
                    for (let i=501; i<articleText.length; i++) {

                        if (!('a' <= articleText[i] && articleText[i] <= 'z')) {
                            lastSymb = i;
                            break;
                        }
                    }
                }

                resultText = articleText.slice(0, lastSymb).replaceAll('’', `'`).replaceAll('—', '-').replaceAll('=', '').replaceAll('–', '-');
            }
        }
        return [resultText, null];
    }
    catch (err) {
        throw new Error(`Failed to fetch article: `, err);
    }
}

export default getWikiText;