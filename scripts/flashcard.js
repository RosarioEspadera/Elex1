const flashcard = document.getElementById("flashcard");
const flipBtn = document.getElementById("flip");
const nextBtn = document.getElementById("next");
const bookmarkBtn = document.getElementById("bookmark");
const topicNav = document.getElementById("topic-nav");

let cards = [];
let currentIndex = 0;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker registered.");
  });
}

// Load cards from JSON file
async function loadCards(topicFile) {
  try {
    const response = await fetch(`./${topicFile}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Invalid JSON format: expected an array.");
      return;
    }

    cards = data;
    currentIndex = 0;
    showCard(currentIndex);
  } catch (error) {
    console.error("Failed to load cards:", error);
  }
}

// Display current card
function showCard(index) {
  const card = cards[index];
  if (!card) {
    console.warn(`Card at index ${index} is undefined.`);
    return;
  }

  document.getElementById("card-question").textContent = card.question;
  document.getElementById("card-answer").textContent = card.answer;
  flashcard.classList.remove("flipped");
}

// Flip card
flipBtn.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
});

// Next card
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % cards.length;
  showCard(currentIndex);
});

// Bookmark card
bookmarkBtn.addEventListener("click", () => {
  alert(`Bookmarked: "${cards[currentIndex]?.question}"`);
});

// Topic navigation
topicNav.addEventListener("click", async (e) => {
  if (e.target.tagName === "LI") {
    const topicFile = e.target.dataset.file;
    if (topicFile) {
      await loadCards(topicFile);
    }
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  loadCards("introsemiconductors.json"); // default topic
});
