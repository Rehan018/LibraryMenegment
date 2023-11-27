const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const bookReturnedList = document.getElementById("bookReturnList");
const books = [];

// Add this event listener to your JavaScript file
document.getElementById('deleteAllDataBtn').addEventListener('click', async () => {
  try {
    const response = await axios.post('http://localhost:8000/delete-all-data');
    console.log(response.data);
    alert('All data deleted successfully!');
  } catch (error) {
    console.error('Error deleting all data:', error);
    alert('Error deleting all data. Please check the console for details.');
  }
});

async function onSubmit(bookId) {
  try {
    if (typeof bookId !== "undefined") {
      const id = bookId;
      const fines = await axios.get(`http://localhost:8000/get-fine/${id}`);
      console.log(fines.data);
      console.log(
        `Book Name : ${fines.data.bookName} , Fine :${
          document.getElementById(bookId).childNodes[0].value
        }, Returned On :${new Date().toLocaleString()}`
      );
      const fine = document.getElementById(bookId).childNodes[0].value;
      console.log(document.getElementById(bookId));
      await axios.delete(`http://localhost:8000/delete/${id}`);
      document.getElementById(bookId).remove();
      const Name = fines.data.bookName;
      
      const Returned = new Date().toLocaleString();
      
      const response = await axios.post(`http://localhost:8000/add-fine`, {
        Name,
        fine,
        Returned,
      });

      bookReturnedList.innerHTML +=   `Book Name : ${response.data.Name} Fine : ${response.data.fine} Returned On :${response.data.Returned}`;
      console.log(response.data);
    } else {
      console.error("bookId is undefined");
    }
  } catch (error) {
    console.error("Error deleting book:", error);
  }
}

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const bookNameInput = document.getElementById("bookName");
  const bookName = bookNameInput.value.trim();

  if (bookName) {
    try {
      const response = await axios.post("http://localhost:8000/add-book", {
        bookName,
      });
      console.log(
        `Book added: ${response.data.bookName}, Created at: ${response.data.createdAt}`
      );
      displayBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const response = await axios.get("http://localhost:8000/get-book");
  const books = response.data;
  const fineResponse = await axios.get("http://localhost:8000/get-fine");
  console.log(fineResponse);

  console.log(response.data);
  //bookReturnedList.innerHTML = "";
  const newResponse = fineResponse.data;
  newResponse.forEach((bookResponse) => {
    //displayBooks(bookResponse)
    bookReturnedList.innerHTML += `Book Name : ${bookResponse.Name} Fine : ${bookResponse.fine} Returned On :${bookResponse.Returned}`;
  });
  console.log(books);
  books.forEach((book) => {
    displayBooks(book);
  });
});


async function displayBooks(book) {
  try {
    const span = document.createElement("span");
    span.id = book.id;
    const createdAtTimestamp = new Date(book.createdAt);
    const updatedAtdueDate = new Date(book.updatedAt);
    const dueDate = createdAtTimestamp;
    dueDate.setDate(dueDate.getDate());
    dueDate.setMinutes(createdAtTimestamp.getMinutes()+60);

    span.innerHTML = `<p> <h2> Book Title :</h2>  ${
      book.bookName
    }</p><p>  BookTaken: ${updatedAtdueDate.toLocaleString()} </p> <p> Due Start: ${createdAtTimestamp.toLocaleString()} </p>
        <p> Fine:$ ${
          (new Date().getHours() - updatedAtdueDate.getHours()) * 10
        }</p>
        <button onclick="onReturn(${book.id})">Return Book</button>`;

    bookList.appendChild(span);
  } catch (error) {
    console.error(error);
  }
}


async function onReturn(bookId) {
  const span = document.getElementById(bookId);
  const fine = span.childNodes[8].textContent.slice(7);
  console.log(fine);
  if (fine > 0) {
    span.innerHTML = `<input id="id" name="name" value="${fine}" disabled></input></br> <button type="submit" id="id" onclick="onSubmit(${bookId})">SEND</button>`;

    const bookIndex = books.findIndex((book) => book.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      bookReturnedList.appendChild(span);
    }
  } else {
    onSubmits(bookId);
    async function onSubmits(bookId) {
      try {
        if (typeof bookId !== "undefined") {
          const id = bookId;
          const fines = await axios.get(`http://localhost:8000/get-fine/${id}`);
          console.log(fines.data);
          console.log(
            `Book Name : ${fines.data.bookName} , Fine :${
              document.getElementById(bookId).childNodes[0].value
            }, Returned On :${new Date().toLocaleString()}`
          );
          await axios.delete(`http://localhost:8000/delete/${id}`);
          document.getElementById(bookId).remove();
          const Name = fines.data.bookName;
          const fine = 0;
          const Returned = new Date().toLocaleString();
          const response = await axios.post(`http://localhost:8000/add-fine`, {
            Name,
            fine,
            Returned,
          });
          //  const bookReturn =  document.getElementById("bookReturnList");

          bookReturnedList.innerHTML += `Book Name : ${response.data.Name} Fine : ${response.data.fine} Returned On :${response.data.Returned}`;
          console.log(response.data);
        } else {
          console.error("bookId is undefined");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  }
}
