const getComposition = async (requestWord) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${requestWord}&langRestrict=en&maxResults=5`;

    try {
        let successResult = false;
        let reqLimit = 5;

        while (!successResult && reqLimit > 0) {
            const res = await fetch(url);
            const data = await res.json();

            if (data.items && data.items.length > 0) {
                let randomIndex = Math.floor(Math.random() * data.items.length);
                let item = data.items[randomIndex]
                let desc = item.volumeInfo.description;
                let language = item.volumeInfo.language;
                let imageLink = item.volumeInfo.imageLinks.thumbnail;
                let authors = item.volumeInfo.authors;
                let title = item.volumeInfo.title;
    
                if (desc && language === 'en' && desc.length >= 500) {
                    successResult = true;

                    let lastSymb = 500;

                    if ('a' <= desc[500] && desc[500] <= 'z') {
                        for (let i=501; i<desc.length; i++) {

                            if (!('a' <= desc[i] && desc[i] <= 'z')) {
                                lastSymb = i;
                                break;
                            }
                        }
                    }

                    let resultText = desc.slice(0, lastSymb).replaceAll('’', `'`);

                    return [resultText, imageLink, authors, title];
                }
            }
            reqLimit--;
        }
        return null;
    }
    catch (err) {
        throw new Error(`failed to fetch: ${err}`);
    }
};

export default getComposition;