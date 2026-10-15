
# Library Books REST API Design

Base URL: `/api/books`

## 1. List All Books

- **Method:** GET
- **Path:** `/api/books`
- **Description:** Returns a list of all books in the library.
- **Success status:** 200 OK

## 2. Get One Book

- **Method:** GET
- **Path:** `/api/books/{id}`
- **Description:** Returns the details of one book using its ID.
- **Success status:** 200 OK

## 3. Create a Book

- **Method:** POST
- **Path:** `/api/books`
- **Description:** Adds a new book to the library.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

- **Success status:** 201 Created

## 4. Update a Book

- **Method:** PUT
- **Path:** `/api/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

- **Success status:** 200 OK

## 5. Delete a Book

- **Method:** DELETE
- **Path:** `/api/books/{id}`
- **Description:** Deletes a book from the library.
- **Success status:** 204 No Content

## 6. List Books by Author

- **Method:** GET
- **Path:** `/api/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author using the `author` query parameter.
- **Success status:** 200 OK

## Error Responses

### 400 Bad Request

This error occurs when the request contains invalid data, such as creating a book without a required title.

### 404 Not Found

This error occurs when a client requests a book ID that does not exist, such as `/api/books/9999`.
