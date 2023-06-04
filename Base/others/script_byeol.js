const categorySelect = document.getElementById("category");
const getButton = document.getElementById("get-button");
const gallery = document.querySelector(".gallery");
const API_URL = "https://api.thecatapi.com";
const API_KEY = "live_JzXRpwM0Yj64uqynI6WhtxF6BSPu0nZ6z4QzEI1pP82PJurax5dcvoJj8Q0B1tpo"; // your API key goes here;
const getFavButton = document.getElementById("get-favourites")

// Add your code here
async function fetchCategory(){
    const response = await fetch(API_URL + "/v1/categories");
    const data = await response.json();
    for(let i=0;i<data.length;i++){
      let optionName = document.createElement("option");
      optionName.value = data[i].id;
      optionName.innerHTML = data[i].name;
      categorySelect.appendChild(optionName);
    }
  }
fetchCategory();

let favourites = []; // need this?
async function displayCatPictures(categorySelect){
  const response = await fetch(API_URL + "/v1/images/search?api_key="+ API_KEY + "&category_ids="+categorySelect.value + "&limit=9");  
  const data = await response.json();
    gallery.innerHTML="";
    for(let i=0; i < data.length; i++ ){
      let catDiv = document.createElement("div");
      catDiv.className = "gallery-item";
      let img = document.createElement("img");
      img.src = data[i].url;
      img.id = data[i].id;
      catDiv.appendChild(img);
      const heart = document.createElement("span");
      heart.classList.add("heart");
      heart.innerHTML = "&#x2764;";
      catDiv.appendChild(heart);
      catDiv.addEventListener("click", addToFavourite);
      gallery.appendChild(catDiv);
    }
}

getButton.addEventListener("click", function(){
  displayCatPictures(categorySelect)
});


async function addToFavourite(e) {
  e.currentTarget.classList.toggle("showheart");
  const imageId = e.currentTarget.querySelector('img').id;
  const rawBody = JSON.stringify({
    "image_id" : imageId, 
    "sub_id" : "byeol"
  });
  await fetch(API_URL + "/v1/favourites", {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'content-Type' : 'application/json'
    },
    body: rawBody
  });
}

async function displayFavourites(){
  const response = await fetch(API_URL + "/v1/favourites?limit=9&sub_id=byeol&order=DESC",{
    headers: {
      'x-api-key': API_KEY
    }
  });
  const data = await response.json();
  gallery.innerHTML = "";
  for(let i=0; i < data.length; i++){
    const image = data[i].image;
    if (image) {
      let catDiv = document.createElement("div");
      catDiv.className = "gallery-item";
      let img = document.createElement("img");
      img.src = data[i].image.url;
      img.id = data[i].image_id;
      catDiv.appendChild(img);
      gallery.appendChild(catDiv);
    }
}}

getFavButton.addEventListener("click", displayFavourites);