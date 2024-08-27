// Existing variables
const noteList = document.getElementById("note-list");
const searchInput = document.getElementById("search");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const saveNoteBtn = document.getElementById("save-note");
const cancelNoteBtn = document.getElementById("cancel-note");
const showAddNoteBtn = document.getElementById("show-add-note");
const noteInput = document.getElementById("note-input");
const emptyMessage = document.getElementById("empty-message");
const initNoteBtn = document.getElementById("init-notes");

// Delete modal variables
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
let noteToDeleteIndex = null;

// Notes array
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentNoteIndex = null;

// Function to format the date
function formatDate(date) {
  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Function to save notes to localStorage
function saveNotesToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Function to render notes
function renderNotes() {
  noteList.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase(); // Pobieramy aktualną wartość wyszukiwania

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm)
  );

  if (filteredNotes.length === 0) {
    emptyMessage.style.display = "block";
    noteInput.style.display = "none";
    showAddNoteBtn.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    showAddNoteBtn.style.display = "none";
    filteredNotes.forEach((note, index) => {
      const noteItem = document.createElement("li");
      noteItem.classList.add("note-item");

      const noteTitle = document.createElement("p");
      noteTitle.classList.add("note-title");
      noteTitle.textContent = note.title || "Bez tytułu";

      const noteDate = document.createElement("p");
      noteDate.classList.add("note-date");
      noteDate.textContent = formatDate(note.date);

      const noteContentText = document.createElement("p");
      noteContentText.classList.add("note-content-text");
      noteContentText.textContent = note.content;

      const noteActions = document.createElement("div");
      noteActions.classList.add("note-actions");

      const editIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      editIcon.setAttribute("viewBox", "0 0 24 24");
      editIcon.innerHTML = `<path d="M16.875 12.1042L15.3958 10.625L16 10.0208C16.1111 9.90972 16.2569 9.85417 16.4375 9.85417C16.6181 9.85417 16.7639 9.90972 16.875 10.0208L17.4792 10.625C17.5903 10.7361 17.6458 10.8819 17.6458 11.0625C17.6458 11.2431 17.5903 11.3889 17.4792 11.5L16.875 12.1042ZM10 17.5V16.0208L14.5 11.5208L15.9792 13L11.4792 17.5H10ZM2.5 13.125V11.875H8.75V13.125H2.5ZM2.5 9.6875V8.4375H12.2917V9.6875H2.5ZM2.5 6.25V5H12.2917V6.25H2.5Z" fill="#3B3C3E"/>`;
      editIcon.addEventListener("click", () => openNoteModal(index));

      const deleteIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      deleteIcon.setAttribute("viewBox", "0 0 24 24");
      deleteIcon.innerHTML = `<path d="M6.25 16.25H13.75V6.25H6.25V16.25ZM4.375 4.58333V3.33333H7.16667L8 2.5H12L12.8333 3.33333H15.625V4.58333H4.375ZM6.25 17.5C5.91667 17.5 5.625 17.375 5.375 17.125C5.125 16.875 5 16.5833 5 16.25V5H15V16.25C15 16.5833 14.875 16.875 14.625 17.125C14.375 17.375 14.0833 17.5 13.75 17.5H6.25ZM6.25 16.25H13.75H6.25Z" fill="#3B3C3E"/>`;
      deleteIcon.addEventListener("click", () => openDeleteModal(index));

      noteActions.appendChild(editIcon);
      noteActions.appendChild(deleteIcon);

      noteItem.appendChild(noteTitle);
      noteItem.appendChild(noteContentText);
      noteItem.appendChild(noteDate);
      noteItem.appendChild(noteActions);

      noteList.appendChild(noteItem);
    });
  }
}

// Function to open the note input modal
function openNoteModal(index) {
  currentNoteIndex = index;
  noteTitleInput.value = notes[index].title;
  noteContentInput.value = notes[index].content;
  noteInput.style.display = "block"; // Show the note input field
}

// Function to open the delete confirmation modal
function openDeleteModal(index) {
  noteToDeleteIndex = index;
  deleteModal.style.display = "flex";
}

// Function to close the delete confirmation modal
function closeDeleteModal() {
  deleteModal.style.display = "none";
  noteToDeleteIndex = null;
}

// Function to close the note input modal
function closeNoteModal() {
  noteInput.style.display = "none"; // Hide the note input field
  noteTitleInput.value = "";
  noteContentInput.value = "";
  currentNoteIndex = null;
  showAddNoteBtn.style.display = "block";
}

// Event listener for the "Add new" button
showAddNoteBtn.addEventListener("click", () => {
  currentNoteIndex = null;
  noteTitleInput.value = "";
  noteContentInput.value = "";
  noteInput.style.display = "block"; // Show the note input field
  showAddNoteBtn.style.display = "none";
});

initNoteBtn.addEventListener("click", () => {
  emptyMessage.style.display = "none";
  showAddNoteBtn.style.display = "block";
});

// Event listener for the save button
saveNoteBtn.addEventListener("click", () => {
  const noteData = {
    title: noteTitleInput.value.trim(),
    content: noteContentInput.value.trim(),
    date: new Date().toISOString(),
  };

  // Prevent adding empty notes
  if (!noteData.title && !noteData.content) {
    alert("Notatka musi mieć tytuł lub treść.");
    return;
  }

  if (currentNoteIndex === null) {
    notes.push(noteData);
  } else {
    notes[currentNoteIndex] = noteData;
  }

  saveNotesToLocalStorage();
  closeNoteModal();
  renderNotes();
  showAddNoteBtn.style.display = "block";
});

// Event listener for the cancel button in note input
cancelNoteBtn.addEventListener("click", closeNoteModal);

// Event listener for the delete confirmation button
confirmDeleteBtn.addEventListener("click", () => {
  if (noteToDeleteIndex !== null) {
    notes.splice(noteToDeleteIndex, 1);
    saveNotesToLocalStorage();
    renderNotes();
    closeDeleteModal();
  }
});

// Event listener for the cancel button in delete modal
cancelDeleteBtn.addEventListener("click", closeDeleteModal);

// Event listener to close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === noteInput) {
    closeNoteModal();
  }
  if (e.target === deleteModal) {
    closeDeleteModal();
  }
});

// Event listener to handle search input changes
searchInput.addEventListener("input", renderNotes);

// Initialize the application
renderNotes();
