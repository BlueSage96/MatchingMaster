import md5 from 'crypto-js/md5';

async function MarvelAPIFetch (marvelMode) {
    try {
        const limit = 60;
        const offset = Math.floor(Math.random() * 1500);
        const ts = new Date().getTime().toString();
        const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
        const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;
        const hash = md5(ts + privateKey + publicKey).toString();

        if (!publicKey || !privateKey) {
            throw new Error("Marvel API keys are missing in environment variables");
        }

        const characterUrl = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        const comicUrl = `https://gateway.marvel.com/v1/public/comics?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        
        const url = marvelMode === 'characters' ? characterUrl : comicUrl;
        const response = await fetch(url);

        if (!response.ok){
            throw new Error (`Marvel API responded with status: ${response.status}`);
        }

        const image = await response.json();

        if (!image.data || !image.data.results){
            throw new Error('Invalid response format from Marvel API');
        }

        const results = image.data.results;

        /* 
            character fetch thumbnail.path & thumbnail.extension 
            comic fetch item.images[0].path & item.images[0].path
            filter out characters or comics without images
            improved filtering to handle errors (lines 44, 57, and 68)
        */

        const clean = results.filter(item => {
             //let else be a mix of both characters & comics!
            if (marvelMode === 'comic') {
                const image = item.images?.[0];
                if (!image || !image.path) {
                    return false;
                }
                const path = image.path.toLowerCase();
                return (
                    !path.includes("image_not_available") &&
                    !path.includes("4c002e0305708") &&
                    !path.includes("not_available")
                );
            }
           
            else if (marvelMode === 'characters') {
                const thumb = item.thumbnail;
                if (!thumb || !thumb.path){
                    return false;
                }
                const path = thumb.path.toLowerCase();
                return (
                    !path.includes("image_not_available") &&
                    !path.includes("4c002e0305708") &&
                    !path.includes("not_available")
                );
            }
            return false;
        });

        console.log(`Filtered ${results.length - clean.length} ${results} with missing images`);
        console.log(`Remaining valid ${results}: ${clean.length}`);

        if (clean.length < 9) {
            throw new Error('Not enough valid character images found');
        }
        //Return only the URL strings for the first 9 characters
        const cleanImages = clean
                .slice(0, 9)
                .map((item) => {
                    if (marvelMode === 'comic') {
                        return item.images[0].path + "." + item.images[0].extension;
                    }
                    else {
                    return item.thumbnail.path + "." + item.thumbnail.extension; 
                    }          
                });
                console.log('Valid character thumbnails:', cleanImages.length);

            return cleanImages;
    }

    catch (error) {
        console.error('Error in MarvelAPI fetch:',error);
        return [
            'red','blue','green','purple','orange','yellow',
            'black','pink','turquoise'
        ];
    }

}
export default MarvelAPIFetch;