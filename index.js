let books = []; // Initialize an empty array to store books

function addBook() {
  const title = document.getElementById('bookTitle').value;
  const author = document.getElementById('bookAuthor').value;
  const genre = document.getElementById('bookGenre').value;
  const status = document.getElementById('bookStatus').value;
  const favorite = document.getElementById('favorite').checked;

  let image = document.getElementById('bookImage').files[0];


  if (image) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const imageUrl = reader.result;
      addToBooks(title, author, genre, status, imageUrl, favorite);
    };
    reader.readAsDataURL(image);
  } else {
    const defaultImage = "./default_image.jpg"; // Local image

    addToBooks(title, author, genre, status, defaultImage, favorite);
  }
}

// reader is a built-in JavaScript object that reads the contents of files stored on the user's computer.
// by reading the file contents, it allows you to display the image in the book list.

// FileReader is used to read the uploaded image file and convert it to a base64 string for display.
// it converts images to a format that can be displayed in the browser.

// Add book without image upload


// Saving books to localStorage
function saveBooksToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books)); 
}

// localStorage is a web storage API that allows you to store data in the browser persistently.
// .setItem() is used to store data in localStorage, and .getItem() is used to retrieve it.
// stringify converts the books array to a JSON string for storage.
// This allows the books to be retrieved later even after the page is refreshed or closed.


// Loading books from localStorage
function loadBooksFromLocalStorage() {
  const storedBooks = localStorage.getItem('books');
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBooks();
  }
}
// parse converts the JSON string back to a JavaScript object (array of books).


// Add book with image upload
function addToBooks(title, author, genre, status, image, favorite) {
  if (title && author && genre && status) {
    const newBook = {
      id: crypto.randomUUID(),
      title,
      author,
      genre,
      status,
      image,
      favorite,
    };

    books.push(newBook);
    saveBooksToLocalStorage(); // Save to localStorage
    renderBooks();
    clearInputs();
  } else {
    alert('Please fill out all fields.');
  }
} // Save books to localStorage whenever a book is added



// Editing a book
function editBook(index) {
  const book = books[index];
  editingIndex = index;

  document.getElementById('editTitle').value = book.title;
  document.getElementById('editAuthor').value = book.author;
  document.getElementById('editGenre').value = book.genre;
  document.getElementById('editStatus').value = book.status;
  document.getElementById('editFavorite').checked = book.favorite;

  document.getElementById('editImageFile').value = '';
  const preview = document.getElementById('editImagePreview');
  preview.src = book.image;
  preview.style.display = 'block'; 

  document.getElementById("editForm").style.display = "block";
}


function saveEdit() {
  const title = document.getElementById('editTitle').value;
  const author = document.getElementById('editAuthor').value;
  const genre = document.getElementById('editGenre').value;
  const status = document.getElementById('editStatus').value;
  const favorite = document.getElementById('editFavorite').checked;
  const fileInput = document.getElementById('editImageFile');
  const file = fileInput.files[0];

  const updateBook = (image) => {
    books[editingIndex] = { ...books[editingIndex], title, author, genre, status, image, favorite };
    saveBooksToLocalStorage();
    renderBooks();
    cancelEdit();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => updateBook(reader.result);
    reader.readAsDataURL(file);
  } else {
    updateBook(books[editingIndex].image);
  }
}

function cancelEdit() {
  document.getElementById("editForm").style.display = "none";
}

function deleteBook(index) {
  books.splice(index, 1);
  saveBooksToLocalStorage(); 
  renderBooks();
} // Save books to localStorage whenever a book is deleted

// Load books when the page is loaded
window.onload = loadBooksFromLocalStorage;
// window.onload = function() is used to ensure that the loadBooksFromLocalStorage function is called when the page is fully loaded.
// This will load any previously saved books from localStorage and render them on the page.
// This ensures that the user's data is preserved even after refreshing or closing the browser.

function renderBooks() {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';

  books.forEach((book, index) => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book-item');

    bookDiv.innerHTML = `
      <div class="book-info">
      <img src="${book.image}" alt="${book.title}" class="book-image">
      <div>
      <span class="book-title">${book.title} by ${book.author}</span>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Status:</strong> ${book.status}</p>
      <p><strong>Favorite:</strong> ${book.favorite ? 'Yes' : 'No'}</p>

      </div>
      </div>
      <button onclick="editBook(${index})" style="background-color: green; color: white;">Edit</button>
      <button onclick="if(confirm('Are you sure you want to delete this book?')) deleteBook(${index})">Delete</button> 
    `;
    bookList.appendChild(bookDiv);
  });
}

function searchBooks() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.genre.toLowerCase().includes(searchTerm) ||
    book.status.toLowerCase().includes(searchTerm)
  );

  renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';

  filteredBooks.forEach((book, index) => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book-item');

    bookDiv.innerHTML = `
      <div class="book-info">
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <div>
          <span class="book-title">${book.title} by ${book.author}</span>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <p><strong>Status:</strong> ${book.status}</p>
          <p><strong>Favorite:</strong> ${book.favorite ? 'Yes' : 'No'}</p>
        </div>
      </div>
      <button onclick="editBook(${index})" style="background-color: green; color: white;">Edit</button>
      <button onclick="if(confirm('Are you sure you want to delete this book?')) deleteBook(${index})">Delete</button> 
    `;

    bookList.appendChild(bookDiv);
  });
}
function clearInputs() {
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookGenre').value = '';
  document.getElementById('bookStatus').value = '';
  document.getElementById('bookImage').value = '';
  document.getElementById('favorite').checked = false;
}

function filterBooks(filter) {
  let filteredBooks = [];

  switch (filter) {
    case 'favorites':
      filteredBooks = books.filter(book => book.favorite);
      break;
    case 'unread':
      filteredBooks = books.filter(book => book.status.toLowerCase() === 'unread');
      break;
    case 'read':
      filteredBooks = books.filter(book => book.status.toLowerCase() === 'read');
      break;
    default:
      filteredBooks = books; // Show all books
  }

  renderFilteredBooks(filteredBooks);
}



