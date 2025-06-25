# Matching Master

DESCRIPTION:
Matching Master is a memory card matching game built with React and Vite. Players can choose from different game modes such as color, emoji, or Marvel character matching. After selecting a mode, the game starts with a shuffled grid of cards. Players flip two cards at a time to find matching pairs. The game tracks the number of attempts, and sound effects are triggered for card flips and game completion (with the option to mute all sounds).

When the game ends, players can enter their name to save their score. The leaderboard displays all saved scores, allows users to edit names, and delete entries. Scores are stored in localStorage, ensuring persistence across page reloads. The app includes pagination to manage leaderboard display and routes like /, /settings, /game, and /endgame using react-router.

Matching Master meets all project requirements including proper routing, controlled form input, reusable components, conditional rendering, localStorage usage, error handling, and responsive design. The codebase is organized with a pages/, features/, and shared/ directory structure and follows best practices like using functional components, avoiding state mutation, and not directly accessing the DOM.

DEPENDICIES:
react + vite
react-router
prettier
styled-components
confetti
crypto-js

SETUP:
-Clone the repo and use your own API keys to pull from the Marvel API. An example of API keys is provided in env.local.example
-Use "npm run dev" to run the game locally

INSTRUCTIONS:
Use "Settings" to toggle music and sounds on/off
Use "Instructions" to learn how the game works
Use "Home" to return to the main page
Chose a matching mode and then begin matching after pressing the start button

BACKGROUND MUSIC:
"Cipher"
Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 3.0
http://creativecommons.org/licenses/by/3.0/

![Matching Master Screenshot]('./assets/Icon.jpg')