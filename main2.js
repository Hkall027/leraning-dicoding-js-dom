document.addEventListener("DOMContentLoaded", function () {
  const unfinishedList = document.getElementById("unfinished-list");
  const finishedList = document.getElementById("finished-list");
  const form = document.getElementById("book-form");
  const searchInput = document.getElementById("searchInput");

  form.addEventListener("submit", addBook);

  function addBook(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = parseInt(document.getElementById("year").value);
    const isComplete = document.getElementById("isComplete").checked;

    if (!title || !author || !year) {
      alert("Mohon isi semua kolom informasi buku.");
      return;
    }

    const book = {
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    const shelf = isComplete ? finishedList : unfinishedList;
    displayBook(book, shelf);

    saveToLocalStorage(book);

    form.reset();
  }

  function displayBook(book, shelf) {
    const li = document.createElement("li");
    li.innerHTML = `
          <span>${book.title} - ${book.author} (${book.year})</span>
          <button class="toggle-button">${book.isComplete ? "Belum di Baca" : "Sudah di Baca"}</button>
          <button class="delete-button">Hapus</button>
      `;

    const toggleButton = li.querySelector(".toggle-button");
    toggleButton.addEventListener("click", toggleBookStatus);

    const deleteButton = li.querySelector(".delete-button");
    deleteButton.addEventListener("click", deleteBook);

    shelf.appendChild(li);
  }

  function toggleBookStatus(event) {
    const bookItem = event.target.parentElement;
    const shelf = bookItem.parentElement;

    // Ambil teks tombol toggle
    const toggleButtonText = event.target.textContent;

    // Periksa apakah buku sedang di rak selesai atau belum selesai
    const isComplete = toggleButtonText === "Belum di Baca";

    if (isComplete) {
      // Pindahkan ke rak "Belum Selesai di Baca"
      unfinishedList.appendChild(bookItem);
      event.target.textContent = "Sudah di Baca";
    } else {
      // Pindahkan ke rak "Selesai di Baca"
      finishedList.appendChild(bookItem);
      event.target.textContent = "Belum di Baca";
    }

    updateLocalStorage();
  }

  function deleteBook(event) {
    const bookItem = event.target.parentElement;
    bookItem.remove();
    updateLocalStorage();
  }

  function saveToLocalStorage(book) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  function updateLocalStorage() {
    const unfinishedBooks = Array.from(unfinishedList.children).map((bookItem) => {
      return {
        title: bookItem.innerText.split(" - ")[0],
        author: bookItem.innerText.split(" - ")[1].split(" (")[0],
        year: parseInt(bookItem.innerText.split(" (")[1].split(")")[0]),
        isComplete: false,
      };
    });

    const finishedBooks = Array.from(finishedList.children).map((bookItem) => {
      return {
        title: bookItem.innerText.split(" - ")[0],
        author: bookItem.innerText.split(" - ")[1].split(" (")[0],
        year: parseInt(bookItem.innerText.split(" (")[1].split(")")[0]),
        isComplete: true,
      };
    });

    localStorage.setItem("books", JSON.stringify(unfinishedBooks.concat(finishedBooks)));
  }

  searchInput.addEventListener("input", searchBooks);

  function searchBooks() {
    const query = searchInput.value.toLowerCase();
    const allBooks = [...Array.from(unfinishedList.children), ...Array.from(finishedList.children)];

    allBooks.forEach((bookItem) => {
      const bookTitle = bookItem.innerText.split(" - ")[0].toLowerCase();
      bookItem.style.display = bookTitle.includes(query) ? "block" : "none";
    });
  }

  // Load data dari localStorage saat halaman dimuat
  const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
  storedBooks.forEach((book) => {
    const shelf = book.isComplete ? finishedList : unfinishedList;
    displayBook(book, shelf);
  });
});
