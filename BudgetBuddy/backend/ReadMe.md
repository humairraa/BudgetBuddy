## Tech Stack

-   **Node.js**
-   **Express.js**
-   **MySQL**

## Project Setup

### 1. Clone the Repository

```Bash
git clone https://github.com/your-username/your-repository-name.git

```

```Bash
cd your-repository-name
```

### 2. Install Dependencies

```Bash
npm install
```

### 3. Set Up Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=auth_db
```

### Start the Server

```Bash
node app.js
```

The server will start on http://localhost:3000.

## Running Tests

To run the tests:

1. Make sure you're in the backend directory:
```bash
cd backend
```

2. Run all tests:
```bash
npm test
```

3. Run a specific test file:
```bash
npm test src/tests/YourTestFile.test.js
```

Test files are located in:
- `src/tests/` 
