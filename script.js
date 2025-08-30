document.addEventListener('DOMContentLoaded', () => {
    const jokeTextElement = document.getElementById('joke-text');
    const newJokeButton = document.getElementById('new-joke-btn');
    const currentYearElement = document.getElementById('current-year');

    const fetchedJokes = new Set(); // To store joke IDs and prevent repetition

    // Set current year in footer
    currentYearElement.textContent = new Date().getFullYear();

    async function fetchDadJoke() {
        jokeTextElement.textContent = 'Fetching a fresh batch of chuckles...'; // Loading state

        let jokeFound = false;
        let retries = 0;
        const maxRetries = 5; // Prevent infinite loops if all jokes are repeated

        while (!jokeFound && retries < maxRetries) {
            try {
                // Fetch from Reddit's r/dadjokes in JSON format
                const response = await fetch('https://www.reddit.com/r/dadjokes/top.json?limit=100&t=week');
                const data = await response.json();

                if (data && data.data && data.data.children) {
                    const posts = data.data.children.filter(post =>
                        post.data.selftext.length > 0 &&
                        post.data.title.length > 0 &&
                        !post.data.stickied // Filter out pinned posts
                    );

                    if (posts.length === 0) {
                        throw new Error('No suitable jokes found in the fetched posts.');
                    }

                    // Get a random post
                    const randomPost = posts[Math.floor(Math.random() * posts.length)];
                    const jokeId = randomPost.data.id;

                    if (!fetchedJokes.has(jokeId)) {
                        const setup = randomPost.data.title;
                        const punchline = randomPost.data.selftext;
                        const fullJoke = `${setup}\n\n${punchline}`;

                        jokeTextElement.textContent = fullJoke;
                        fetchedJokes.add(jokeId); // Add to set
                        jokeFound = true;
                    } else {
                        console.log('Joke already displayed, trying another...');
                        retries++;
                    }
                } else {
                    throw new Error('Invalid data structure from Reddit API.');
                }
            } catch (error) {
                console.error('Error fetching dad joke:', error);
                jokeTextElement.textContent = 'Oops! Couldn\'t fetch a joke right now. Please try again later.';
                break; // Exit loop on critical error
            }
        }

        if (!jokeFound && retries >= maxRetries) {
            jokeTextElement.textContent = 'Ran out of new jokes to show! Please try again in a bit.';
        }
    }

    // Initial joke load
    fetchDadJoke();

    // Event listener for button
    newJokeButton.addEventListener('click', fetchDadJoke);
});

// Optional: Basic Ad Management (placeholder, integrate real ad code here)
function loadAds() {
    const adSpaces = document.querySelectorAll('.ad-space');
    adSpaces.forEach((ad, index) => {
        // In a real scenario, you'd replace this with actual ad network code
        // For example, if using Google AdSense:
        // ad.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-YOUR_PUBLISHER_ID" data-ad-slot="YOUR_AD_SLOT_ID"></ins>';
        // (adsbygoogle = window.adsbygoogle || []).push({});

        ad.innerHTML = `<p>Ad Content Here - Slot ${index + 1}</p><img src="https://via.placeholder.com/250x100?text=Ad+${index+1}" alt="Ad Placeholder">`;
    });
}

document.addEventListener('DOMContentLoaded', loadAds);
