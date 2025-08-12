let currentDeck = [];
let currentIndex = 0;
let flipped = false;

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const flipBtn = document.getElementById("flip");
const nextBtn = document.getElementById("next");
const bookmarkBtn = document.getElementById("bookmark");
const topicNav = document.getElementById("topic-nav");

function showCard(index) {
  const card = cards[index];
  if (!card) {
    console.warn(`Card at index ${index} is undefined.`);
    return;
  }

  document.getElementById('card-question').textContent = card.question;
  document.getElementById('card-answer').textContent = card.answer;
}


topicNav.addEventListener("click", async (e) => {
  if (e.target.tagName === "LI") {
    const topic = e.target.dataset.topic;
    await loadDeck(`data/${topic}.json`);
    showCard(0);
  }
});

flipBtn.addEventListener("click", () => {
  flipped = !flipped;
  updateCard();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentDeck.length;
  flipped = false;
  showCard(currentIndex);
});

bookmarkBtn.addEventListener("click", () => {
  const card = currentDeck[currentIndex];
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  bookmarks.push(card);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  bookmarkBtn.textContent = "✅";
  setTimeout(() => (bookmarkBtn.textContent = "🔖"), 1000);
});

async function loadDeck(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Deck not found");
    currentDeck = await res.json();
    currentIndex = 0;
    showCard(currentIndex);
  } catch (err) {
    questionEl.textContent = "⚠️ Unable to load flashcards.";
    answerEl.textContent = "";
    console.error("Flashcard load error:", err);
  }
}

function showCard(index) {
  const card = currentDeck[index];
  questionEl.textContent = card.question;
  answerEl.textContent = card.answer;
  flipped = false;
  updateCard();
}

function updateCard() {
  document.getElementById("card").classList.toggle("flipped", flipped);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
