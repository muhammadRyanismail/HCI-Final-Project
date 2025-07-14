const mangaData = [
  {
    title: "Cinderella Gray",
    img: "https://cdn.myanimelist.net/images/manga/3/233332.jpg",
    tags: ["uma musume", "sports", "drama"],
    synopsis: "A story of Tokai Teio’s younger sister.",
    chapters: 45,
    writer: "Cygames",
    status: "Ongoing"
  },
  {
    title: "Starting Gate!",
    img: "https://cdn.myanimelist.net/images/manga/3/197774.jpg",
    tags: ["uma musume", "school", "sports"],
    synopsis: "The daily life of horse girls as idols.",
    chapters: 35,
    writer: "Cygames",
    status: "Finished"
  },
  {
    title: "Umayon",
    img: "https://cdn.myanimelist.net/images/manga/2/224610.jpg",
    tags: ["uma musume", "comedy"],
    synopsis: "4-koma style comedy featuring Uma Musume characters.",
    chapters: 24,
    writer: "Cygames",
    status: "Finished"
  },
  {
    title: "Naruto",
    img: "https://cdn.myanimelist.net/images/manga/3/117681.jpg",
    tags: ["fighting", "ninja"],
    synopsis: "A ninja's dream to become Hokage.",
    chapters: 700,
    writer: "Masashi Kishimoto",
    status: "Finished"
  },
  {
    title: "Bleach",
    img: "https://cdn.myanimelist.net/images/manga/3/52539.jpg",
    tags: ["fighting", "action"],
    synopsis: "Ichigo gains the power of a Soul Reaper.",
    chapters: 686,
    writer: "Tite Kubo",
    status: "Finished"
  }
];

let savedMangas = [];
let filteredManga = [...mangaData];
let currentPage = 1;
const mangaPerPage = 9;

const mangaList = document.getElementById("mangaList");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");
const savedSection = document.getElementById("savedSection");
const detailsSection = document.getElementById("detailsSection");
const similarSection = document.getElementById("similarSection");
const logo = document.getElementById("logo");

function displayMangas(data) {
  mangaList.innerHTML = "";
  const start = (currentPage - 1) * mangaPerPage;
  const end = start + mangaPerPage;
  const pageMangas = data.slice(start, end);
  pageMangas.forEach(manga => mangaList.appendChild(createCard(manga)));
  renderPagination(data);
  renderSaved();
}

function createCard(manga) {
  const card = document.createElement("div");
  card.className = "manga-card";
  const saved = savedMangas.some(m => m.title === manga.title);
  card.innerHTML = `
    <img src="${manga.img}" alt="${manga.title}" />
    <h2>${manga.title}</h2>
    <button class="save-btn">${saved ? 'Unsave' : 'Save'}</button>
  `;
  card.querySelector("button").onclick = (e) => {
    e.stopPropagation();
    toggleSave(manga);
  };
  card.onclick = () => showDetails(manga);
  return card;
}

function toggleSave(manga) {
  const index = savedMangas.findIndex(m => m.title === manga.title);
  if (index >= 0) {
    savedMangas.splice(index, 1);
  } else {
    savedMangas.push(manga);
  }
  displayMangas(filteredManga);
}

function renderSaved() {
  savedSection.innerHTML = "";
  if (savedMangas.length === 0) return;
  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Saved Manga";
  savedSection.appendChild(title);
  const grid = document.createElement("div");
  grid.className = "manga-grid";
  savedMangas.forEach(m => grid.appendChild(createCard(m)));
  savedSection.appendChild(grid);
}

function renderPagination(data) {
  const totalPages = Math.ceil(data.length / mangaPerPage);
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) currentPage--;
    displayMangas(filteredManga);
  };

  const pageLabel = document.createElement("span");
  pageLabel.innerText = `Page ${currentPage} of ${totalPages}`;

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) currentPage++;
    displayMangas(filteredManga);
  };

  pagination.appendChild(prevBtn);
  pagination.appendChild(pageLabel);
  pagination.appendChild(nextBtn);
}

function showDetails(manga) {
  detailsSection.innerHTML = `
    <div class="section-title">Details</div>
    <div class="details-panel">
      <p><strong>Title:</strong> ${manga.title}</p>
      <p><strong>Synopsis:</strong> ${manga.synopsis}</p>
      <p><strong>Chapters:</strong> ${manga.chapters}</p>
      <p><strong>Writer:</strong> ${manga.writer}</p>
      <p><strong>Status:</strong> ${manga.status}</p>
    </div>
  `;
  renderSimilar(manga);
}

function renderSimilar(manga) {
  similarSection.innerHTML = "";
  const similar = mangaData.filter(m =>
    m.title !== manga.title &&
    m.tags.some(tag => manga.tags.includes(tag))
  );
  if (similar.length === 0) return;
  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Similar Manga";
  similarSection.appendChild(title);
  const grid = document.createElement("div");
  grid.className = "manga-grid";
  similar.forEach(m => grid.appendChild(createCard(m)));
  similarSection.appendChild(grid);
}

function filterManga() {
  const query = searchInput.value.toLowerCase();
  filteredManga = mangaData.filter(manga =>
    manga.title.toLowerCase().includes(query) ||
    manga.tags.some(tag => tag.toLowerCase().includes(query))
  );
  currentPage = 1;
  displayMangas(filteredManga);
}

searchInput.addEventListener("input", filterManga);

logo.onclick = () => {
  searchInput.value = "";
  filteredManga = [...mangaData];
  currentPage = 1;
  detailsSection.innerHTML = "";
  similarSection.innerHTML = "";
  displayMangas(filteredManga);
};

displayMangas(filteredManga);
