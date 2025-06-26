// console.log("Hello!");
let currentSong = new Audio();
let songs;
let currFolder;
let mp3Links;

let getSongs = async (folder) => {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/spotify/assects/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.querySelectorAll("a");

    let mp3Links = Array.from(links)
        .map(link => link.getAttribute("href"))
        .filter(href => href && href.endsWith(".mp3"))
        .map(href => href.split('/').pop());

    return mp3Links;
};


function loadSongList(songArray) {
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = ""; // clear previous list

    songArray.forEach(song => {
        songUL.innerHTML += `<li>
            <img class="invert" src="assects/music.svg" alt="music">
            <div class="info">
                <div class="songname">${song}</div>
                <div class="songartist">Devil</div>
            </div>
            <img class="invert" src="assects/play.svg" alt="play">
        </li>`;
    });

    // Attach click event to each song
    Array.from(songUL.getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", () => {
            let track = li.querySelector(".songname").innerText;
            playMusic(track);
        });
    });
    return songs;
}




function formatTime(seconds) {
    const totalSeconds = Math.round(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}



const playMusic = (track, pause = false) => {
    currentSong.src = `/spotify/assects${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "assects/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00: 00";

    // Setup auto-next when song ends
    currentSong.onended = () => {
        let index = songs.indexOf(track);
        if (index !== -1 && index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            // Optionally reset to first song or stop
            console.log("End of playlist.");
        }
    };
};

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/spotify/assects/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[1];
            try {
                let a = await fetch(`http://127.0.0.1:5500/spotify/assects/songs/${folder}/info.json`);
                if (!a.ok) throw new Error("Missing info.json");
                let response = await a.json();

                cardContainer.insertAdjacentHTML("beforeend", `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#1fdf64" stroke="green" stroke-width="1.5" />
                                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                            </svg>
                        </div>
                        <img src="assects/songs/${folder}/cover.jpg" alt="Img">
                        <h3>${response.title}!</h3>
                        <p>${response.description}</p>
                    </div>
                `);
            } catch (err) {
                console.error("Failed to load album:", folder, err);
            }
        }
    }
    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async (e) => {
            let folder = e.currentTarget.dataset.folder;
            songs = await getSongs(`/songs/${folder}`);
            loadSongList(songs);
            playMusic(songs[0]);
            // console.log(currentSong.currentTime,currentSong.duration)
        });
    });


}


let main = async () => {

    //Get the list of all the songs
    songs = await getSongs("/songs/cs");
    // console.log(songs)
    playMusic(songs[0], true);

    //Display all the albums on the page
    displayAlbums();

    //Attach an event listener to previous,play and next.
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assects/pause.svg"
        } else {
            currentSong.pause();
            play.src = "assects/play.svg"
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.duration, currentSong.currentTime)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        // Update seekbar
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listener on hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //Add an event listener on close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //Add an event listener to previous
    prevoius.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index == 0) {

        } else {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index < (songs.length - 1)) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event to volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //Add event listener to mute the volume
    document.querySelector(".volume > img").addEventListener("click", (e) => {
        const img = e.target;
        if (img.src.includes("volume.svg")) {
            // Change to mute
            img.src = img.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            // Change to volume
            img.src = img.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1; // or whatever default you prefer
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });

    // add eventlistener to search
    // document.querySelector(".search").addEventListener("click", () => {
    //     console.log("Search clicked!!")
    //     document.querySelector(".search-txt").style.display = "none"
    //     document.querySelector(".input-search").style.display = "block"
    //     document.querySelector(".search").addEventListener("click", () => {
    //     console.log("Search clicked!!")
    //     document.querySelector(".search-txt").style.display = "block"
    //     document.querySelector(".input-search").style.display = "none"
    //     })  
    // })

}
main();
