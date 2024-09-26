import Marwan from "./utils/marwan.js";
import Song from "./utils/songs.js";
import Albums from "./utils/Albums.js";
/**
 * MusicPlayer class to handle audio playback functionalities.
 */

class MusicPlayer {
  constructor(Album) {
    this.Album = Album;
    this.audioFiles = Album.songPaths;
    this.currentTrackIndex = 0;
    this.currentAudio = this.audioFiles[this.currentTrackIndex];
    console.log(this.currentAudio);
    this.audio = new Audio(this.currentAudio.src);
    this.isPlaying = false;
    this.state = false;
    this.looping = false;
    // Event listeners for audio updates
    this.addAudioEventListeners();
    this.addControlEventListeners();
    this.addMusicToTheList();
    this.changePlayerInfo();
    this.stop();
  }

  /**
   * Toggles play/pause state of the audio track.
   */
  togglePlayPause() {
    this.isPlaying ? this.pauseTrack() : this.playTrack();
  }

  /**
   * Plays the current track.
   */
  playTrack() {
    if (this.state) {
      this.audio.play();
      this.isPlaying = true;
      document.getElementById("playPauseButtonImg").src = "./Assets/pause.png";
      document.getElementById("cdRotating").style.animation =
        "spin 4s linear infinite";
      document.getElementById("cdRotating").style.animationPlayState =
        "running";
    }
  }

  /**
   * Pauses the current track.
   */
  pauseTrack() {
    this.audio.pause();
    this.isPlaying = false;
    document.getElementById("playPauseButtonImg").src =
      "./Assets/play-button-arrowhead.png";
    document.getElementById("cdRotating").style.animationPlayState = "paused";
  }

  /**
   * Loads and plays the next track in the playlist.
   */
  nextTrack() {
    if (!this.looping) {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.audioFiles.length;
    }
    this.loadTrack();
    this.playTrack();
  }

  /**
   *  @ID
   *  Play spacific song
   */
  playTrackById(from) {
    this.currentTrackIndex = from;
    this.loadTrack();
    this.playTrack();
  }

  /**
   * Loads and plays the previous track in the playlist.
   */
  previousTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.audioFiles.length) %
      this.audioFiles.length;
    this.loadTrack();
    this.playTrack();
  }
  /**
   * Loads the current track into the audio element.
   */
  loadTrack() {
    this.audio.src = this.audioFiles[this.currentTrackIndex].src;
    this.audio.load();
    this.currentAudio = this.audioFiles[this.currentTrackIndex];
    this.changePlayerInfo();
    this.resetProgress(); // Reset progress bar
    console.log(this.currentAudio);
  }

  /**
   * Sets the audio playback progress based on the input value.
   * @param {number} value - Progress value between 0 and 1.
   */
  setProgress(value) {
    this.audio.currentTime = value * this.audio.duration;
  }

  /**
   * Updates the progress bar and time left display.
   */
  updateProgress() {
    const progressRange = document.getElementById("progressRange");
    const timeLeftLabel = document.getElementById("timeLeft");
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;
    if (!isNaN(duration)) {
      document.getElementById("fullTime").textContent =
        this.formatTime(duration);
      progressRange.value = currentTime / duration;
      const timeLeft = duration - currentTime;
      timeLeftLabel.textContent = this.formatTime(timeLeft);
    }
  }

  /**
   * Formats seconds into a mm:ss format.
   * @param {number} seconds - The number of seconds to format.
   * @returns {string} Formatted time string.
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  /**
   * Resets the progress bar and time left display.
   */
  resetProgress() {
    document.getElementById("progressRange").value = 0;
    document.getElementById("timeLeft").textContent = "0:00";
  }

  /**
   * Sets the volume of the audio playback.
   * @param {number} volume - Volume level between 0 and 1.
   */
  setVolume(volume) {
    this.audio.volume = volume;
  }
  /**
   * Seeks forward by 10 seconds.
   */
  seekForward() {
    this.audio.currentTime = Math.min(
      this.audio.currentTime + 10,
      this.audio.duration
    );
  }

  /**
   * Seeks backward by 10 seconds.
   */
  seekBackward() {
    this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
  }
  /**
   * Adds event listeners for audio control buttons.
   */
  addControlEventListeners() {
    document
      .getElementById("playPauseBtn")
      .addEventListener("click", () => this.togglePlayPause());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextTrack());
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.previousTrack());
    document
      .getElementById("repBtn")
      .addEventListener("click", () => (this.looping = !this.looping));
    // // Volume control
    // document.getElementById("volumeRange").addEventListener("input", (e) => {
    //   this.setVolume(e.target.value);
    // });
    // // Seek forward and backward buttons
    // document
    //   .getElementById("seekForwardBtn")
    //   .addEventListener("click", () => this.seekForward());
    // document
    //   .getElementById("seekBackwardBtn")
    //   .addEventListener("click", () => this.seekBackward());
    // // Progress control
    document.getElementById("progressRange").addEventListener("input", (e) => {
      this.setProgress(e.target.value);
    });
  }

  /**
   * Starts the audio playback.
   */
  start() {
    this.playTrack();
    this.state = true;
  }

  /**
   * Stops all playback.
   */
  stop() {
    this.state = false;
    this.pauseTrack(); // Ensure audio is paused
  }

  /**
   * Adds event listeners for audio updates.
   */
  addAudioEventListeners() {
    // Update song progress and time left every second
    this.audio.addEventListener("timeupdate", () => this.updateProgress());

    // Move to the next song when the current one ends
    this.audio.addEventListener("ended", () => this.nextTrack());
  }
  addMusicToTheList() {
    document.querySelector(".unOrderedMusicList").innerHTML = ""; // Clear the list
    this.audioFiles.forEach((song, index) => {
      console.log(index);
      let TheSongDurationCalc = new Audio(song.src);
      TheSongDurationCalc.addEventListener("loadedmetadata", () => {
        const songDuration = TheSongDurationCalc.duration;

        // Create a new list item
        const li = document.createElement("li");
        li.id = `${index}`;
        li.innerHTML = `
          <img src="${song.albumPictureSrc}" alt="Album Cover" />
          <div class="songInfo">
            <h3>${song.songName}</h3>
            <p>${song.artistName}</p>
          </div>
          <div class="songDurationTime">
            <p>${this.formatTime(songDuration)}</p>
          </div>
        `;

        // Append the new list item to the unordered music list
        document.querySelector(".unOrderedMusicList").appendChild(li);

        // Add click event listener to the newly created list item
        li.addEventListener("click", () => {
          console.log(`Song ${index} clicked`);
          this.playTrackById(index); // Play the track by ID
        });

        // Cleanup the temporary audio object
        TheSongDurationCalc = null;
      });
    });
  }

  changePlayerInfo() {
    document.getElementById(
      "PlayedSongImg"
    ).src = `${this.currentAudio.albumPictureSrc}`;
    document.getElementById(
      "AlbumArtistName"
    ).textContent = `${this.currentAudio.artistName}`;
    document.getElementById("songName").textContent =
      this.audioFiles[this.currentTrackIndex].songName;
  }
}

export default MusicPlayer;

/// test
// amr = new MusicPlayer(Song)
// document.getElementById("amr").addEventListener("click", () => {
//   mar.stop();
//   mar.pauseTrack();

//   amr.start();

//   amr.playTrack();
//   amr.playTrackById(2);
// });

// document.getElementById("marwan").addEventListener("click", () => {
//   amr.stop();
//   amr.pauseTrack();

//   mar.start();
//   mar.playTrack();
// });
let playList = document.querySelector(".playList");
document.getElementById("goBack").addEventListener("click", () => {
  playList.style.left = "100%";
});
document.getElementById("songsListbtn").addEventListener("click", () => {
  playList.style.left = "0";
});
let favouriteButton = document.getElementById("favouriteBtn");
favouriteButton.addEventListener("click", () => {
  favouriteButton.src = "./Assets/heart2.png";
});
