import MusicPlayer from "./script.js";
import Albums from "./utils/Albums.js";

let BestAlbumsParent = document.querySelector(".albums");
let thePLayingAlbum;

// Loop over each album and create album elements dynamically
Albums.forEach((album, index) => {
  // Create a div for the album
  let albumDiv = document.createElement("div");
  albumDiv.classList.add("album");
  albumDiv.id = `album-${index}`; // Assign a unique ID using the index

  // Create an img element for the album cover
  let albumImg = document.createElement("img");
  albumImg.src = album.albumPictureSrc;
  albumImg.alt = `${album.albumName} cover`;

  // Create an h3 element for the album name
  let albumName = document.createElement("h3");
  albumName.textContent = album.albumName;

  // Create a p element for the artist name
  let artistName = document.createElement("p");
  artistName.textContent = album.artistName;

  // Append the img, h3, and p elements to the album div
  albumDiv.appendChild(albumImg);
  albumDiv.appendChild(albumName);
  albumDiv.appendChild(artistName);

  // Append the album div to the parent container
  BestAlbumsParent.appendChild(albumDiv);

  // Add click event listener to each album div
  albumDiv.addEventListener("click", () => {
    if (thePLayingAlbum) {
      thePLayingAlbum.stop(); // Stop the currently playing album if there is one
      thePLayingAlbum = undefined;
    }

    // Initialize the music player for the selected album
    thePLayingAlbum = new MusicPlayer(Albums[index]);

    // Start playing the selected album
    thePLayingAlbum.start();
  });
});
