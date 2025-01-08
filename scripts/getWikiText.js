const getWikiText = async () => {
    let wrongReq = true;
    let articleText;

    while (wrongReq) {
        const response = await fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext&exlimit=1&generator=random');

        const data = await response.json();

        const pageId = Object.keys(data.query.pages)[0];
        articleText = data.query.pages[pageId].extract;

        //avoid displaying empty text and text from forum
        if (articleText !== '' && !articleText.includes('delete') && !articleText.includes('http') && !articleText.includes('pronunciation') && !articleText.includes('talk') && !articleText.includes('edit') && !articleText.split('').filter(char => 'A' <= char.toUpperCase && char.toUpperCase <= 'Z' ).length > 0) {
            wrongReq = false;
        }
    }

    return articleText.replaceAll('=', '').slice(0, 700);
}

export default getWikiText;