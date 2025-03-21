let books = [];

function addBook() {
  const title = document.getElementById('bookTitle').value;
  const author = document.getElementById('bookAuthor').value;
  const genre = document.getElementById('bookGenre').value;
  const status = document.getElementById('bookStatus').value;
  const favorite = document.getElementById('favorite').checked;
  
  let image = document.getElementById('bookImage').files[0]; // Get the uploaded image file
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
      <button onclick="deleteBook(${index})">Delete</button>
      <button onclick="editBook(${index})">Edit</button>
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

