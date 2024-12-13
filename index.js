// Import required modules
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Enable JSON parsing for requests
app.use(express.json());

// In-memory data store (no database)
let books = [
  { id: 1, title: 'Book 1', author: 'Author 1', isbn: '1234567890', reviews: [] },
  { id: 2, title: 'Book 2', author: 'Author 2', isbn: '2345678901', reviews: [] },
  { id: 3, title: 'Book 3', author: 'Author 3', isbn: '3456789012', reviews: [] }
];

let users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
  res.json(books);
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    res.json(book);
  }
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = books.filter((b) => b.author === author);
  if (booksByAuthor.length === 0) {
    res.status(404).json({ message: 'No books found by this author' });
  } else {
    res.json(booksByAuthor);
  }
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = books.filter((b) => b.title === title);
  if (booksByTitle.length === 0) {
    res.status(404).json({ message: 'No books found with this title' });
  } else {
    res.json(booksByTitle);
  }
});

// Task 5: Get book Review
app.get('/books/:id/reviews', (req, res) => {
  const id = req.params.id;
  const book = books.find((b) => b.id === parseInt(id));
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    res.json(book.reviews);
  }
});

// Task 6: Register New user
app.post('/users', (req, res) => {
  const { username, password } = req.body;
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.json({'message':"new user registered sucessfully."});
});

// Task 7: Login as a Registered user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  console.log(username,password);
  if (!user) {
    res.status(401).json({ message: 'Invalid username or password' });
  } else {
    res.json("logged in successfully.");
  }
});

// Task 8: Add/Modify a book review
app.put('/books/:id/reviews', (req, res) => {
  const id = req.params.id;
  const book = books.find((b) => b.id === parseInt(id));
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
  } else {
    const { review } = req.body;
    book.reviews.push(review);
    res.json(book.reviews);
  }
});

// Task 9: Delete book review added by that particular user
app.delete('/books/:id/reviews/:reviewId', (req, res) => {
    const id = req.params.id;
    const reviewId = req.params.reviewId;
    const book = books.find((b) => b.id === parseInt(id));
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      const reviewIndex = book.reviews.findIndex((r) => r.id === parseInt(reviewId));
      if (reviewIndex === -1) {
        res.status(404).json({ message: 'Review not found' });
      } else {
        book.reviews.splice(reviewIndex, 1);
        res.json({ message: 'Review deleted successfully' });
      }
    }
  });
  
  // Task 10: Get all books – Using async callback function – 2 Points
  app.get('/api/books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3000/books');
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  });
  
  // Task 11: Search by ISBN – Using Promises – 2 Points
  app.get('/api/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:3000/books/isbn/${isbn}`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.status(404).json({ message: 'Book not found' });
      });
  });
  
  // Task 12: Search by Author – 2 Points
  app.get('/api/books/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:3000/books/author/${author}`);
      res.json(response.data);
    } catch (error) {
      res.status(404).json({ message: 'No books found by this author' });
    }
  });
  
  // Task 13: Search by Title - 2 Points
  app.get('/api/books/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:3000/books/title/${title}`);
      res.json(response.data);
    } catch (error) {
      res.status(404).json({ message: 'No books found with this title' });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });