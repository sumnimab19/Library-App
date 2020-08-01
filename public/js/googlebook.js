function getBooks() {
  const APIKey = "AIzaSyA6IRz2PfBZ2HyZlTjr0QD9_nZqZctgFKg";
  const searchedBook = $(".input").val();
  const queryURL =
    "https://www.googleapis.com/books/v1/volumes?q=intitle:" +
    searchedBook +
    "&key=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(response => {
    let title = "";
    let author = "";
    let image = "";
    let url = "";

    for (let i = 0; i < response.items.length; i++) {
      const newDiv = $("<div></div>");
      newDiv.addClass("eachBook");
      title = $(
        "<p class = 'title'>" + response.items[i].volumeInfo.title + "</p>"
      );
      image = $(
        "<img class = 'image'><br><a href" +
          // response.items[i].volumeInfo.infoLink +
          "><button id = 'imgButton' class = 'btnWantRead btn btn-warning'> Want to Read? </button></a>"
      );
      author = $(
        "<p class = 'author'>" + response.items[i].volumeInfo.authors + "</p>"
      );
      url = response.items[i].volumeInfo.imageLinks.thumbnail;

      image.attr("src", url);
      newDiv.append(title, author, image);
      newDiv.appendTo($(".bookList"));
    }
  });
}

// Book search button
$(".searchButton").on("click", e => {
  e.preventDefault();
  getBooks();
});

getBookList();
getReadBookList();

// Want to Read button event handler
$(document).on("click", ".btnWantRead", e => {
  e.preventDefault();
  const selectedBook = e.target.parentNode.parentNode;
  const title = selectedBook.children[0].textContent;
  const author = selectedBook.children[1].textContent;
  const url = selectedBook.children[2].src;

  const UserId = $(".member-id");

  // Constructing a book object to hand to the database
  const newBook = {
    title: title,
    author: author,
    url: url,
    UserId: UserId.text(),
    read: false
  };

  $.ajax("/api/members", {
    type: "POST",
    data: newBook
  }).then(() => {
    location.reload();
  });

  getBookList();
});

// Function for creating a new book div
function createBookDiv(bookData) {
  const newDiv = $("<div></div>");
  newDiv.data(bookData);
  // const id = bookData.id;

  const titlePara = $("<p>" + bookData.title + "</p>");
  newDiv.append(titlePara);

  titlePara.addClass("title");

  const authorPara = $("<p>" + bookData.author + "</p>");
  newDiv.append(authorPara);

  authorPara.addClass("author");

  const image = $(
    "<img src='" +
      bookData.url +
      "'/>" +
      "<br>" +
      "<button id = 'imgButton' class = 'btnFinished btn btn-warning'> Finished? </button></a>" +
      "<hr>"
  );

  newDiv.append(image);
  return newDiv;
}

// $(function () {
$(document).on("click", ".btnFinished", function() {
  const selectedBook = $(this)
    .parent()
    .data();
  selectedBook.read = true;
  console.log(selectedBook);

  $.ajax("/api/members", {
    type: "PUT",
    data: selectedBook
  }).then(() => {
    location.reload();
  });
  location.reload();
  getReadBookList();
});
// });

// Function for retrieving books and getting them ready to be rendered to the page
function getBookList() {
  $.get("/api/members", data => {
    console.log(data);

    const rowsToAdd = [];
    for (let i = 0; i < data.length; i++) {
      console.log($(".member-id").text());

      // ######### REVIEW THIS WITH THE TEAM ###############
      // if (data[i].read == false && data[i].UserId == $(".member-id").text()) {
         if((data[i].read == false) ) {
          // if((data[i].read == false) && (data[i].UserId == 1)) {

        rowsToAdd.push(createBookDiv(data[i]));
      }
    }
    renderBookList(rowsToAdd);
  });
}

// A function for rendering the list of books to the page
function renderBookList(rows) {
  const bookList = $(".bookSelected");
  if (rows.length) {
    bookList.append(rows);
  }
}

function createReadBookDiv(bookRead) {
  const newDiv = $("<div></div>");
  newDiv.addClass("readBooks");
  newDiv.data(bookRead);
  // const id = bookRead.id;

  const titlePara = $("<p>" + bookRead.title + "</p>");
  newDiv.append(titlePara);

  titlePara.addClass("title");

  const authorPara = $("<p>" + bookRead.author + "</p>");
  newDiv.append(authorPara);

  authorPara.addClass("author");

  const image = $("<img src='" + bookRead.url + "'/>");

  newDiv.append(image);
  return newDiv;
}

function getReadBookList() {
  $.get("/api/readbook", data => {
    console.log(data);
    const rowsToAdd = [];

    for (let i = 0; i < data.length; i++) {
      // if (data[i].read == true && data[i].UserId == $(".member-id").text()) {
        if((data[i].read == true)) {
          // if((data[i].read == true) && (data[i].UserId == 1)) {
        rowsToAdd.push(createReadBookDiv(data[i]));
      }
    }
    renderReadBook(rowsToAdd);
  });
}

// A function for rendering the list of books to the page
function renderReadBook(rows) {
  const readBookList = $(".readBookList");
  if (rows.length) {
    readBookList.append(rows);
  }
}
