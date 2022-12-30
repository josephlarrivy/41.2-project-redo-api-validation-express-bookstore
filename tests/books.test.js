process.env.NODE_ENV = "test"
const app = require("../app");
const db = require("../db");
const request = require("supertest");

// #####################

beforeEach(async (req, res, next) => {
    let response = await db.query(
        `INSERT INTO books (isbn, amazon_url,author,language,pages,publisher,title,year) VALUES (
        '123432122',
        'https://amazon.com/taco',
        'Elie',
        'English',
        100,
        'Nothing publishers',
        'my first book', 2008)
      RETURNING isbn)`
    )
});

describe("POST a book to /books", function () {
    test("creates a new book", async (req, res, next) => {
        const response = await request(app).post('/books')
        .send({
            isbn: '32794782',
            amazon_url: "https://taco.com",
            author: "mctest",
            language: "english",
            pages: 1000,
            publisher: "yeah right",
            title: "amazing times",
            year: 2000
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toHaveProperty("isbn");
    });
    test("checks if all data is present for creating book", async () => {
        const response = await request(app)
            .post('/books')
            .send({ "isnb": "123546" });
        expect(response.statusCode).toBe(400);
    });
})

afterEach(async function () {
    await db.query("DELETE FROM BOOKS");
});


afterAll(async function () {
    await db.end()
});