import md5 from 'crypto-js/md5';

async function MarvelAPIFetch () {
    try {
        const limit = 60;
        const offset = Math.floor(Math.random() * 1500);
        const ts = new Date().getTime().toString();
        const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
        const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY;
        const hash = md5(ts + privateKey + publicKey).toString();

        console.log("Marvel API keys present:", !!publicKey, !!privateKey);
        if (!publicKey || !privateKey) {
            throw new Error("Marvel API keys are missing in environment variables");
        }

        const url = `https://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        console.log('Fetching from URL', url);
        const response = await fetch(url);

        if (!response.ok){
            throw new Error (`Marvel API responded with status: ${response.status}`);
        }

        const image = await response.json();

        if (!image.data || !image.data.results){
            throw new Error('Invalid response format from Marvel API');
        }

        const characters = image.data.results;

        /* 
            fetch thumbnail.path & thumbnail.extension 
            filter out characters without images
        */

        const cleanCharImg = characters.filter(charImg => {
            if (!charImg.thumbnail){
                return false;
            }
            const path = charImg.thumbnail.path.toLowerCase();
            return (
                !path.includes("image_not_available") &&
                !path.includes("4c002e0305708") &&
                !path.includes("not_available")
            );
        });

        console.log(`Filtered ${characters.length - cleanCharImg.length} characters with missing images`);
        console.log(`Remaining valid characters: ${cleanCharImg.length}`);

        if (cleanCharImg.length < 9) {
            throw new Error('Not enough valid character images found');
        }

      const characterImages = cleanCharImg
            .slice(0, 9)
            .map((charImg) => `${charImg.thumbnail.path}.${charImg.thumbnail.extension}`);
            
        console.log("Successfully loaded 9 character images");
        return characterImages;
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