async function getCountryData() {
  const data = await fetch("/api/v1/countries/");
  const json = await data.json();

  const dropDownContainer = document.getElementById("dropdown-container");
  const selectEl = document.createElement("select");
  selectEl.classList.add("dropdown");

  let optionalStr = json.data.map((val) => {
    const optionEl = document.createElement("option");
    const valId = document.createAttribute("value");
    valId.value = val.id;
    optionEl.innerText = val.name;
    optionEl.setAttributeNode(valId);
    return optionEl;
  });

  optionalStr.forEach((el) => {
    selectEl.append(el);
  });

  dropDownContainer.append(selectEl);

  const dropDown = document.querySelector(".dropdown");
  let id = dropDown.value;

  async function getDropdownValue(id) {
    const countryData = await fetch("api/v1/countries/" + id);
    let countryJson = await countryData.json();

    const displayData = document.querySelector("#display-container");

    displayData.insertAdjacentHTML(
      "afterbegin",
      `<div id=${id} class="country-div"><h1 >${countryJson?.data?.name}</h1> <img src=${countryJson?.data?.flag} alt="malay img" class="img"/><p class="rank">${countryJson?.data?.rank}</p></div>`
    );
  }

  getDropdownValue(id);

  dropDown.addEventListener("change", (e) => {
    id = dropDown.value;
    getDropdownValue(id);
    const el = document.querySelectorAll(".country-div");

    el.forEach((val) => (val.style.display = "none"));
  });
}

console.log(window.location.href);

getCountryData();

const inputForm = document.querySelector(".input-form");

inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // const countryName = document.querySelector("#country-name").value;
  // const countryFlag = document.querySelector("#country-flag").files[0];
  // const countryRank = document.querySelector("#country-rank").value;
  // console.log(countryName, countryFlag["0"], countryRank);
  // console.log(document.querySelector("#continent").value);

  // to deal with multi-form data
  let form = new FormData();
  form.append("name", document.querySelector("#country-name").value);
  form.append("photo", document.querySelector("#country-flag").files[0]);
  form.append("rank", document.querySelector("#country-rank").value);
  form.append("continent", document.querySelector("#continent").value);

  console.log("form", form.values);

  await fetch("/api/v1/countries/", {
    method: "POST",
    body: form,
  });

  getCountryData();
  // console.log("1");
  document.querySelector("#dropdown-container").innerHTML = "";
  document.querySelector("#display-container").innerHTML = "";
});

const slides = document.querySelectorAll(".slide");

slides.forEach(
  (slide, idx) => (slide.style.transform = `translateX(${idx * 100}%)`)
);

let currSlide = 0;
const nextSlide = document.querySelector(".btn-next");
let maxSlide = slides.length - 1;

nextSlide.addEventListener("click", () => {
  if (currSlide === maxSlide) currSlide = 0;
  currSlide++;
  console.log("clicked", currSlide);
  console.log("slide", slides);

  slides.forEach((slide, idx) => {
    console.log((idx - currSlide) * 100);
    slide.style.transform = `translateX(${(idx - currSlide) * 100}%)`;
  });
});

const prevSlide = document.querySelector(".btn-prev");

prevSlide.addEventListener("click", () => {
  if (currSlide === 0) currSlide = maxSlide;
  currSlide--;

  slides.forEach((slide, idx) => {
    slide.style.transform = `translate(${(idx - currSlide) * 100}%)`;
  });
});

const contentSlides = document.querySelectorAll(".content");
const button = document.querySelector(".slide-menu");

contentSlides.forEach((content, idx) => {
  content.style.transform = `translate(${idx * 100}%)`;
});

button.addEventListener("click", () => {
  const content2 = document.querySelector(".content2");
  content2.style.transform = "translateX(0%)";
});

const card = document.querySelector(".card");
// console.log(card);
card.addEventListener("click", (e) => {
  console.log("card", card.classList.contains("rotate"));
  card.classList.toggle("rotate");
});

document.querySelector(".board").addEventListener("click", function () {
  this.classList.toggle("rotate");
});

const bio = function (city, state) {
  console.log(
    `My name is ${this.name}. I am a ${this.profession}. I am working in ${city} which comes under state ${state}`
  );
};

let obj = {
  name: "Malay Chandan",
  profession: "JavaScript Developer",
};

let obj1 = {
  name: "Suriya Ghosh",
  profession: "Salesforce Developer",
};

bio.call(obj, "Hyderabad", "Telengana");
bio.call(obj1, "Kolkata", "West Bengal");

console.log("================= apply ========================");

bio.apply(obj, ["Hyderabad", "Telengana"]);
bio.apply(obj1, ["Kolkata", "West Bengal"]);

console.log("=========================== bind ===========================");

const getBioObj = bio.bind(obj, "Hyderabad", "Telengana");
const getBioObj1 = bio.bind(obj1, "Kolkata", "West Bengal");
getBioObj();
getBioObj1();
