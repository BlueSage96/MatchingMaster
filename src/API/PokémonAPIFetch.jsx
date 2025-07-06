async function PokémonAPIFetch () {
    try {
           const limit = 50;
    const offset = Math.floor(Math.random() * 200);//Pokémon API supports pagination
    const pokéURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(pokéURL);

    if (!response.ok) {
        throw new Error(`Pokémon API response with status: ${response.status}`);
    }

    const pokéData = await response.json();
    const promises = pokéData.results.map(async (poké) => {
        const res = await fetch(poké.url);
        const data = await res.json();
        const image = data?.sprites?.other?.['official-artwork']?.front_default;
        return {
            name: data.name,
            image,
        };
    });

    const fullPokéData = await Promise.all(promises);

    const clean = fullPokéData.filter(
      (poké) =>
        poké.image &&
        !poké.image.includes('image_not_available') &&
        !poké.image.includes('not_available') &&
        !poké.image.includes('4c002e0305708')
    ).slice(0,9);
        
        //return only the URL string for the first 9 characters
        const finalPokémon = clean.map((poké) => ({
            name: poké.name,
            image: poké.image
        }));
        console.log('Successfully loaded 9 Pokémon character images');
        return finalPokémon;

    } catch (error) {
        console.error('Error in Pokémon API fetch:', error);
        //return color if fetch error occurs
        return ['blue','red','green','purple','yellow','orange','black','pink','turquoise'];
    }
}
export default PokémonAPIFetch;