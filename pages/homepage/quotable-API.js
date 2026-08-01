document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quote-container');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    if (!quoteContainer || !quoteText || !quoteAuthor) return;

    async function fetchQuote() {
        try {
            // Using DummyJSON as an alternative
            const response = await fetch('https://dummyjson.com/quotes/random');
            
            if (!response.ok) throw new Error('Failed to fetch quote');
            const data = await response.json();
            
            // Strictly enforce the 12-word maximum constraint
            const wordCount = data.quote.split(' ').length;
            
            if (wordCount <= 15) {
                quoteText.textContent = `"${data.quote}"`;
                quoteAuthor.textContent = `— ${data.author}`;
            } else {
                // Fallback if the random quote is too long
                quoteText.textContent = '"Code is like humor. When you have to explain it, it’s bad."';
                quoteAuthor.textContent = '— Cory House';
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            // Fallback for network or CORS failures
            quoteText.textContent = '"First, solve the problem. Then, write the code."';
            quoteAuthor.textContent = '— John Johnson';
        } finally {
            quoteContainer.style.display = 'block'; 
        }
    }

    fetchQuote();
});