let books = [];// Initialize an empty array to store books
// This array will hold all the book objects that are added by the user.

function addBook() {
  const title = document.getElementById('bookTitle').value;
  const author = document.getElementById('bookAuthor').value;
  const genre = document.getElementById('bookGenre').value;
  const status = document.getElementById('bookStatus').value;
  const favorite = document.getElementById('favorite').checked;
  
  let image = document.getElementById('bookImage').files[0]; // Get the uploaded image file
  
  //.files[0] is used to access the first file in the FileList object returned by the input element.
  // This allows the user to upload an image file for the book.
  if (image) {
    const reader = new FileReader();
    
    reader.onloadend = function () {
      const imageUrl = reader.result; // Get the file URL
      addToBooks(title, author, genre, status, imageUrl, favorite);
    };
    reader.readAsDataURL(image); // Convert the image file to a base64 string
  } else {
    // Use default image if no image is uploaded
    const defaultImage = "https://via.placeholder.com/150";
    addToBooks(title, author, genre, status, defaultImage, favorite);
  }
}
// FileReader is a built-in JavaScript object that allows you to read the contents of files (like images) asynchronously.


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
    renderBooks();
    clearInputs();
  } else {
    alert('Please fill out all fields.');
  }
}

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
      <button onclick="deleteBook(${index})">Delete</button>
      
    `;
    bookList.appendChild(bookDiv);
  });
}

function deleteBook(index) {
  books.splice(index, 1);
  renderBooks();
}

function editBook(index) {
  const book = books[index];
  const title = prompt('Edit title:', book.title);
  
  const author = prompt('Edit author:', book.author);
  const genre = prompt('Edit genre:', book.genre);
  const status = prompt('Edit status:', book.status);
  const image = prompt('Edit image URL:', book.image);
  const favorite = confirm('Is this book a favorite?');

  if (title && author && genre && status && image !== null) {
    //&& image !== null checks if the user provided a new image URL
    books[index] = { ...book, title, author, genre, status, image, favorite };
    renderBooks();
  }
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
      <button onclick="deleteBook(${index})">Delete</button>
      <button onclick="editBook(${index})">Edit</button>
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
// Save books to localStorage
function saveBooksToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books)); // Save books to localStorage
}
// localStorage is a web storage API that allows you to store data in the browser persistently.
// .setItem() is used to store data in localStorage, and .getItem() is used to retrieve it.
// stringify converts the books array to a JSON string for storage.
// This allows the books to be retrieved later even after the page is refreshed or closed.





// Load books from localStorage
function loadBooksFromLocalStorage() {
  const storedBooks = localStorage.getItem('books');
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    renderBooks();
  }
}
//JSON.parse() is used to convert the JSON string back into a JavaScript object (in this case, an array of books).
// This allows the application to retrieve the previously saved books from localStorage when the page is loaded.
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

function deleteBook(index) {
  books.splice(index, 1);
  saveBooksToLocalStorage(); // Save to localStorage
  renderBooks();
} // Save books to localStorage whenever a book is deleted

function editBook(index) {
  const book = books[index];
  const title = prompt('Edit title:', book.title);
  const author = prompt('Edit author:', book.author);
  const genre = prompt('Edit genre:', book.genre);
  const status = prompt('Edit status:', book.status);
  const image = prompt('Edit image URL:', book.image);
  const favorite = confirm('Is this book a favorite?');

  if (title && author && genre && status && image !== null) {
    books[index] = { ...book, title, author, genre, status, image, favorite };
    saveBooksToLocalStorage(); // Save to localStorage
    renderBooks();
  }
} // Save books to localStorage whenever a book is edited

// Load books when the page is loaded
window.onload = loadBooksFromLocalStorage;
// window.onload = function() is used to ensure that the loadBooksFromLocalStorage function is called when the page is fully loaded.
// This will load any previously saved books from localStorage and render them on the page.
// This ensures that the user's data is preserved even after refreshing or closing the browser.
// Set a default image for books
 



