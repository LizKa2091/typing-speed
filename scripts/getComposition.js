const getComposition = async (requestWord) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${requestWord}&langRestrict=en&maxResults=5`;

    try {
        let successResult = false;
        let reqLimit = 25;

        while (!successResult && reqLimit > 0) {
            const res = await fetch(url);
            const data = await res.json();

            if (data.items) {
                for (let item of data.items) {
                    let desc = item.volumeInfo.description;
                    let language = item.volumeInfo.language;
    
                    if (desc && language === 'en' && desc.length >= 700) {
                       successResult = true;
                       let result = desc.slice(0, 700);
                       //add improved slice. last word is now not full
                       //add book image, title and author

                       return result;
                    }
                };
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