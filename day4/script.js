
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
  const text = noteText.value;
  const characters = text.length;

  // Count words, ignoring extra spaces
  const trimmedText = text.trim();
  const words = trimmedText === ""
    ? 0
    : trimmedText.split(/\s+/).length;

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.remove("warning", "over");

  if (characters > 200) {
    charCount.classList.add("over");
  } else if (characters > 180) {
    charCount.classList.add("warning");
  }
}

function clearNote() {
  noteText.value = "";
  localStorage.removeItem("quicknotes-draft");
  updateCounts();
}

function updateThemeButton() {
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "Light mode"
    : "Dark mode";
}

// Restore the saved draft
const savedDraft = localStorage.getItem("quicknotes-draft");

if (savedDraft !== null) {
  noteText.value = savedDraft;
}

// Restore the saved theme
const savedTheme = localStorage.getItem("quicknotes-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

updateThemeButton();
updateCounts();

// Save the draft and update counters as the user types
noteText.addEventListener("input", function () {
  updateCounts();
  localStorage.setItem("quicknotes-draft", noteText.value);
});

// Clear button
clearBtn.addEventListener("click", clearNote);

// Escape key
noteText.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    clearNote();
  }
});

// Toggle the theme
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  const currentTheme = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("quicknotes-theme", currentTheme);
  updateThemeButton();
});
