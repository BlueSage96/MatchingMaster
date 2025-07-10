async function AnimalsAPIFetch(animalMode) {
  const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

  console.log('Getting 9 different breeds for', animalMode);

  // Lists of breeds that work with the API (more breeds as backup)
  const catBreeds = [
    'abyssinian',
    'american_shorthair',
    'bengal',
    'birman',
    'bombay',
    'british_shorthair',
    'burmese',
    'himalayan',
    'maine_coon',
    'manx',
    'munchkin',
    'persian',
    'ragdoll',
    'siamese'
  ];

  const dogBreeds = [
    'akita',
    'basenji',
    'beagle',
    'boxer',
    'chihuahua',
    'collie',
    'dachshund',
    'german_shepard',
    'golden_retriever',
    'husky',
    'mastiff',
    'poodle',
    'pomeranian',
    'rottweiler'
  ];

  const breeds = animalMode === 'cats' ? catBreeds : dogBreeds;

  // Get more breeds than we need as backup
  const shuffledBreeds = [...breeds].sort(() => Math.random() - 0.5);
  const selectedBreeds = shuffledBreeds; // Try all breeds until we get 9 images

  console.log(`Trying ${animalMode}:`, selectedBreeds);

  const images = [];

  // Fetch each breed individually until we have 9 images
  for (const breed of selectedBreeds) {
    if (images.length >= 9) break; // Stop when we have enough

    try {
      const catURL = `https://api.api-ninjas.com/v1/cats?name=${breed}`;
      const dogURL = `https://api.api-ninjas.com/v1/dogs?name=${breed}`;
      const url = animalMode === 'cats' ? catURL : dogURL;

      console.log(`Fetching ${breed}... (${images.length}/9)`);

      const response = await fetch(url, {
        headers: {
          'X-Api-Key': apiKey
        }
      });

      if (response.ok) {
        const result = await response.json();
        const animal = Array.isArray(result) ? result[0] : result;

        if (animal && animal.image_link && animal.image_link.startsWith('http')) {
          images.push(animal.image_link);
          console.log(`✅ Got ${breed}: ${animal.image_link}`);
        } else {
          console.log(`❌ ${breed}: No valid image_link`);
        }
      } else {
        console.log(`❌ ${breed}: API error ${response.status}`);
      }

      // Small delay to be nice to the API
      await new Promise((resolve) => setTimeout(resolve, 10));
    } catch (error) {
      console.log(`❌ Failed to get ${breed}:`, error.message);
    }
  }

  if (images.length < 9) {
    throw new Error(`Only got ${images.length} images, need 9`);
  }

  console.log(`Success! Got ${images.length} different ${animalMode} images`);
  return images.slice(0, 9);
}

export default AnimalsAPIFetch;
