const categorySelect = document.getElementById("category");
const getButton = document.getElementById("get-button");
const favButton = document.getElementById("get-favourites");
const gallery = document.querySelector(".gallery");
const API_URL = "https://api.thecatapi.com/"
const API_KEY = "live_KUZdDBfNsBeF47zqNpFyUuwplD6TMGgpwAMYPDVEi4awpvGqn9LKK2QKUOJCUJyb";
const API_CatCategory = "v1/categories";
const get9RandomImages = "v1/images/search?limit=9";
const API_Favourites = "v1/favourites";
const numOfImagesMaximum = 9;
const sub_id = "301255702";

async function getCategory(){
  try{
    const response = await fetch(API_URL + API_CatCategory);
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      let option = document.createElement("option");
      option.value = data[i].id;
      option.textContent = data[i].name;
      categorySelect.appendChild(option)
    }
  }
  catch(error){
    gallery.textContent = error;
  }
}
getCategory();

async function getCatImage(){
  gallery.innerHTML = "";
  try{
    let selectedCategory = `&category_ids=`+ categorySelect.value;
    const response = await fetch(API_URL + get9RandomImages + selectedCategory + "&api_key="+ API_KEY);
    const data = await response.json();
    for (let i = 0 ; i < data.length; i++) {
      let galleryItemDiv = document.createElement("div");
      galleryItemDiv.className = "gallery-item";
      let img = document.createElement("img");
      img.src = data[i].url;
      img.id = data[i].id;
      galleryItemDiv.appendChild(img);
      gallery.appendChild(galleryItemDiv);
      galleryItemDiv.addEventListener("click", addToFavourite);
    }
  }
  catch(error){
    gallery.textContent = error;
  }
}

getButton.addEventListener("click", getCatImage);
favButton.addEventListener("click", displayFavourite);

async function addToFavourite(e) {
  e.currentTarget.classList.toggle("showheart");
  const heart = document.createElement("span");
  heart.classList.add("heart");
  heart.innerHTML = "&#x2764;";
   e.currentTarget.appendChild(heart);
   var postData = JSON.stringify({
    "image_id": e.currentTarget.firstChild.id,
    "sub_id": sub_id
   });
   try {
   const response = await fetch(API_URL + API_Favourites, 
        {
            method: "POST",
            headers: { 
              "content-type": "application/json",
              "x-api-key": API_KEY},
            body: postData
        });
      }
      catch(error){
        gallery.textContent = error;
      }
    }

async function displayFavourite(){
  gallery.innerHTML = "";
  try{
    const repsonse = await fetch(
      API_URL + API_Favourites + '?limit=9&sub_id=301255702&order=DESC',{
        headers:{
          "content-type":"application/json",
          "x-api-key": API_KEY
      }
      });
      const favourites = await repsonse.json();
      for (let i = 0; i < numOfImagesMaximum; i++){
        let galleryItemDiv = document.createElement("div");
        galleryItemDiv.className = "gallery-item";
        let img = document.createElement("img");
        img.src = favourites[i].image.url;
        img.id = favourites[i].image.id;
        galleryItemDiv.appendChild(img);
        gallery.appendChild(galleryItemDiv);
        galleryItemDiv.addEventListener("click", addToFavourite);
      }
  }
  catch(error){
    gallery.textContent = error;
  }
}

