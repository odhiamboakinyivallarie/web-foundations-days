let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];


// 1. Search notes
function searchNotes(word) {
    return notes.filter(function(note) {
        return note.text.toLowerCase().includes(word.toLowerCase());
    });
}


// 2. Find the longest note
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }

    return longest;
}


// 3. Count notes by category
function countByCategory() {
    let counts = {};

    for (let note of notes) {
        if (counts[note.category] === undefined) {
            counts[note.category] = 0;
        }

        counts[note.category]++;
    }

    return counts;
}


// 4. Get summary
function getSummary() {
    let counts = countByCategory();

    let total = notes.length;
    let noteWord = total === 1 ? "note" : "notes";

    return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}


// 5. Check for duplicate note
function isDuplicate(text) {
    let cleanedText = text.trim().toLowerCase();

    return notes.some(function(note) {
        return note.text.trim().toLowerCase() === cleanedText;
    });
}


// 6. Add a note
function addNote(text, category) {
    let cleanedText = text.trim();

    if (cleanedText.length < 1 || cleanedText.length > 200) {
        console.log("Note must be between 1 and 200 characters.");
        return false;
    }

    if (isDuplicate(cleanedText)) {
        console.log("Note is a duplicate.");
        return false;
    }

    if (category !== "personal" &&
        category !== "work" &&
        category !== "study") {
        console.log("Invalid category.");
        return false;
    }

    let newNote = {
        id: notes.length + 1,
        text: cleanedText,
        category: category
    };

    notes.push(newNote);

    return true;
}


// ====================
// TESTS
// ====================

// searchNotes()
console.log(searchNotes("day"));
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]

console.log(searchNotes("python"));
// Expected: []

// longestNote()
console.log(longestNote());
// Expected: { id: 2, text: "Finish the Day 3 assignment", category: "study" }

let savedNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null

notes = savedNotes;

// countByCategory()
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

notes = [];

console.log(countByCategory());
// Expected: {}

notes = savedNotes;

// getSummary()
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [savedNotes[0]];

console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."

notes = savedNotes;

// isDuplicate()
console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true

console.log(isDuplicate("Buy eggs"));
// Expected: false

// addNote()
console.log(addNote("Study JavaScript functions", "study"));
// Expected: true

console.log(addNote("  buy milk and bread  ", "personal"));
// Expected: false and logs "Note is a duplicate."

console.log(addNote("", "personal"));
// Expected: false and logs "Note must be between 1 and 200 characters."

console.log(addNote("New task", "shopping"));
// Expected: false and logs "Invalid category."