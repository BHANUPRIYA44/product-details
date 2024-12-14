const ACCESS_KEY = "LZhLS7xQShAUk1actF6WieRA17dVf1HZ5DPFTAY7k8Y";
let firstImage = "";
let thumbnailsArray = [];
let unsplashImages = [];
let firstImageElement = document.getElementById("main-image");

async function fetchUnsplashApiPhotos() {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?count=5&client_id=${ACCESS_KEY}`
    );
    const unsplashPhotosList = await res.json();
    unsplashImages = unsplashPhotosList.map((photo) => photo.urls.regular);
    firstImage = unsplashPhotosList && unsplashPhotosList[0].urls.regular;
    fetchLoremPicsumApiPhotos();
  } catch (err) {
    console.error(err);
  }
}

async function fetchLoremPicsumApiPhotos() {
  try {
    const res = await fetch("https://picsum.photos/v2/list?page=1&limit=5");
    const loremPhotosList = await res.json();
    thumbnailsArray = loremPhotosList.map((photo) => photo.download_url);
    loadCarousel(firstImage, thumbnailsArray);
  } catch (err) {
    console.error(err);
  }
}

function onClickNext() {
  let currentIndex = unsplashImages.indexOf(firstImageElement.src);
  currentIndex =
    currentIndex === unsplashImages.length - 1 ? 0 : currentIndex + 1;
  firstImageElement.src = unsplashImages[currentIndex];
}

function onClickPrev() {
  let currentIndex = unsplashImages.indexOf(firstImageElement.src);
  currentIndex =
    currentIndex === 0 ? unsplashImages.length - 1 : currentIndex - 1;
  firstImageElement.src = unsplashImages[currentIndex];
}

function changeToMainImage(key) {
  firstImageElement.src = unsplashImages[key] || unsplashImages[0];
}

function loadCarousel(main, thumbnailImagesList) {
  firstImageElement.src = main;

  const thumbnailsContainer = document.getElementById("thumbnail-images");
  thumbnailsContainer.innerHtml = "";

  thumbnailImagesList.forEach((img, key) => {
    const thumbnailImage = document.createElement("div");
    thumbnailImage.classList.add("thumbnail");
    thumbnailImage.classList.add("pointer");
    thumbnailImage.id = `thumbnail-img-${key}`;

    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.alt = `thumbnail ${key}`;

    thumbnailImage.onclick = () => changeToMainImage(key);

    thumbnailImage.appendChild(imgElement);

    thumbnailsContainer.appendChild(thumbnailImage);
  });
}

function handleTouchStart(event) {
  startX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  endX = event.touches[0].clientX;
}

function handleTouchEnd() {
  if (startX > endX + 50) {
    onClickNext();
  } else if (startX < endX - 50) {
    onClickPrev();
  }
}

document.getElementById("cart-btn").addEventListener("click", function () {
  const quantity = document.getElementById("quantity").value;
  const flavor = document.getElementById("ice-cream").value;

  if (quantity && flavor) {
    const message = `Successfully added ${quantity} ${flavor} Ice Cream${
      quantity > 1 ? "s" : ""
    } to your cart!`;
    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.textContent = message;
    confirmationMessage.classList.remove("hidden");

    setTimeout(() => {
      confirmationMessage.classList.add("hidden");
    }, 5000);
  }
});

const mainImageContainer = document.getElementById("first-main-image");
mainImageContainer.addEventListener("touchstart", handleTouchStart);
mainImageContainer.addEventListener("touchmove", handleTouchMove);
mainImageContainer.addEventListener("touchend", handleTouchEnd);

fetchUnsplashApiPhotos();
