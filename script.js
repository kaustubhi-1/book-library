const searchBtn = document.querySelector('.searchBtn');
const searchBox = document.querySelector('.searchBox');
const gridViewBtn = document.querySelector('.grid');
const listViewBtn = document.querySelector('.list');
const sortSelect = document.querySelector('.Sort');
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const bookContainer = document.querySelector('.bookContainer');

let bookData = [];

async function getData() {
    const url = 'https://api.freeapi.app/api/v1/public/books';

    try {
        const response = await fetch(url);
        const data = await response.json();
        bookData = data.data.data;
        console.log("Fetched Books:", bookData);

        displayBooks(bookData);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function displayBooks(books) {
    bookContainer.innerHTML = "";

    books.forEach(book => {
        let bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        let title = document.createElement("h3");
        title.innerText = book.volumeInfo.title;

        let author = document.createElement("p");
        author.innerText = book.volumeInfo.authors?.join(", ") || "Unknown Author"; // ✅ Fix for authors

        let image = document.createElement("img");
        image.src = book.volumeInfo.imageLinks?.smallThumbnail || "default-image.jpg"; // ✅ Fix for missing image

        let moreInfo = document.createElement("a");
        moreInfo.href = book.volumeInfo.infoLink;
        moreInfo.innerText = "More Info..";
        moreInfo.target = "_blank";

        bookCard.appendChild(image);
        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(moreInfo);
        bookContainer.appendChild(bookCard);
    });
}

searchBox.addEventListener("keyup", function () {
    let searchTerm = searchBox.value.toLowerCase();
    console.log("Search Term:", searchTerm);

    let filteredBooks = bookData.filter(book => {
        return book.volumeInfo.title.toLowerCase().includes(searchTerm) ||
            book.volumeInfo.authors?.some(author => author.toLowerCase().includes(searchTerm)); // ✅ Fix for authors
    });
    bookContainer.innerHTML = "";
    if(filteredBooks === 0){
      bookContainer.innerHTML = "<p>Book not found</p>";
    }
    else
    {
      displayBooks(filteredBooks);
    }
});

gridViewBtn.addEventListener('click',() => {
 gridViewBtn.classList.add('active');
 listViewBtn.classList.remove('active');
 bookContainer.classList.add('grid-view');
 bookContainer.classList.remove('list-view');
})

listViewBtn.addEventListener('click',() => {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    bookContainer.classList.add('list-view');
    bookContainer.classList.remove('grid-view');
})

sortSelect.addEventListener("change", function () {
    let sortBy = sortSelect.value;
    let sortedBooks = [...bookData];

    if (sortBy === "title-asc") {
        sortedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
    } 
    else if (sortBy === "title-desc") {
        sortedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title)).reverse();
    } 
    else if (sortBy === "date-new") {
        sortedBooks.sort((a, b) => (a.volumeInfo.publishedDate || "").localeCompare(b.volumeInfo.publishedDate || "")).reverse();
    } 
    else if (sortBy === "date-old") {
        sortedBooks.sort((a, b) => (a.volumeInfo.publishedDate || "").localeCompare(b.volumeInfo.publishedDate || ""));
    }

    displayBooks(sortedBooks);
});



getData();
