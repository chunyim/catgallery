const categorySelect = document.getElementById("category");
const getButton = document.getElementById("get-button");
const gallery = document.querySelector(".gallery");
const favourites = document.getElementById("get-favourites");
const API_URL = "https://api.thecatapi.com";
const API_KEY = "live_J8ANE3qoUFs5FOl3yxU71MPqMQIFJBrJLyaj2VC31GdrIT6He6I2brC6psMZhQ6s"; // your API key goes here;

// Add your code here

const targetCategoryId = [1, 2, 4, 5, 7, 14, 15];

async function fetchCategories() {
  try {
    const response = await fetch(
      `${API_URL}/v1/categories`,
      { headers: { 'x-api-key': API_KEY } });
    const data = await response.json();

    const filterData = data.filter(category => targetCategoryId.includes(category.id));
    createHTML(filterData);

  } catch (error) {
    console.error(error);
  }
}

function createHTML(options) {
  for (const key in options) {
    const htmlElement = document.createElement("option");
    htmlElement.value = options[key].id;
    htmlElement.text = options[key].name;
    categorySelect.appendChild(htmlElement);
  }
}

async function fetchCat() {
  try {
    const response = await fetch(
      `${API_URL}/v1/images/search?category_ids=${categorySelect.value}&limit=9`,
      { headers: { 'x-api-key': API_KEY } })
    const data = await response.json();
    showImages(data);
  } catch (error) {
    console.error(error);
  }
};

function showImages(images) {
  gallery.innerHTML = "";
  let sub_id = 1;
  for (const key in images) {
    let htmlElement = document.createElement("img");
    const div = document.createElement("div");
    div.classList.add("gallery-item");

    htmlElement.src = images[key].url;
    htmlElement.alt = images[key].id;
    htmlElement.id = sub_id++;
    div.appendChild(htmlElement);
    gallery.appendChild(div);
    div.addEventListener("click", addToFavourite);
  }
}


fetchCategories()
getButton.addEventListener("click", fetchCat);

/* Bonus */

/* 
You'll need to append the heart and add an eventlistener to each image parent (div) when you create it. Here is the code to do that. You might have to modify it a bit differently if you used a different variable name.

   
*/

/* Uncomment below for the bonus, this is the function that will be called when you click each image. I've used e.currentTarget instead of e.target because it's more reliable. I would encourage you to google it and read about it to understand the differences. */

async function addToFavourite(e) {
  let favToggle = e.currentTarget.classList.toggle("showheart");
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerHTML = "&#x2764;";
    e.currentTarget.appendChild(heart);
    console.log(e.currentTarget);
  // Add your code here
  try {
    const response = await fetch(
      `${API_URL}/v1/favourites`,
       { method: 'POST',
        headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json', },
        body: JSON.stringify({ "image_id": e.currentTarget.alt, "sub_id": "shingchit"})} //current target? //sub_id is like your user id, for the server to identify your fav
    );
    const data = await response.json();
    console.log(`sub_id: ${e.target.id}`);
    console.log(data)
  } catch (error) {
    console.error(error);
  }
}

async function fetchFavourites() {
  updatedArray =[];
  try {
    const response = await fetch(
      `${API_URL}/v1/favourites?limit=9&sub_id=shingchit&order=DESC`,  //${gallery.firstElementChild.firstElementChild.id}`, //sub_id=shingchit
      { headers: { 'x-api-key': API_KEY }}
    );
    const data = await response.json();
    console.log(data);
    showFavouriteImages(data);
  } catch (error) {
    console.error(error);
  }
}

function showFavouriteImages(favourites) {
  gallery.innerHTML = "";
  for (const key in favourites) {
    let htmlElement = document.createElement("img");
    htmlElement.src = favourites[key].image.url;
    gallery.appendChild(htmlElement);
  }
}


favourites.addEventListener("click", fetchFavourites);




