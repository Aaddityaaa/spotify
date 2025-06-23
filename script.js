console.log("Hello!");
let currentSong = new Audio();
let songs;

let getSongs = async () => {
    // Fetch the directory listing HTML
    let a = await fetch("http://127.0.0.1:5500/spotify/assects/songs/");
    let response = await a.text();

    // Inject into a temporary <div> so we can parse it
    let div = document.createElement("div");
    div.innerHTML = response;

    // Get all <a> tags inside this injected HTML
    let links = div.querySelectorAll("a");

    // Convert NodeList to array, filter .mp3 links, and create full URLs
    let baseUrl = "http://127.0.0.1:5500/spotify/assects/songs/";
    let mp3Links = Array.from(links)
        .map(link => link.getAttribute("href"))
        .filter(href => href && href.endsWith(".mp3"))
        .map(href => new URL(href, baseUrl).href.split("/songs/")[1]);
    return mp3Links;
};

function formatTime(seconds) {
    const totalSeconds = Math.round(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}



const playMusic = (track, pause = false) => {
    // let audio = new Audio;
    currentSong.src = ("/spotify/assects/songs/" + track)
    if (!pause) {
        currentSong.play();
        play.src = "assects/pause.svg"
    }
    // let a = document.getElementById("play");

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00: 00"
}

let main = async () => {

    //Get the list of all the songs
    songs = await getSongs();
    // console.log(songs)
    playMusic(songs[0], true);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songs.forEach(song => {
        songUL.innerHTML += `<li>
                                <img class="invert" src="assects/music.svg"
                                    alt="music">
                                <div class="info">
                                    <div class="songname">${song}</div>
                                    <div class="songartist">Harry</div>
                                </div>
                                <img class="invert" src="assects/play.svg" alt="play">
                            </li>`;
    });
    //Play the first song
    // var audio = new Audio(songs[6]);
    // audio.play();

    // audio.addEventListener("loadeddata", () =>{
    //     let duration = audio.duration;
    //      console.log(duration); 
    // })

    //Attach event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })

    })

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
        if(index == 0){
            
        }else{
            playMusic(songs[index-1])
        }
        
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index < (songs.length - 1)){
            playMusic(songs[index+1])
        } 
    })

    //Add an event to volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value)/100
    })
}
main();

