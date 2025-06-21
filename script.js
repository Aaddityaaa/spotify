console.log("Hello!");

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
        .map(href => new URL(href, baseUrl).href);
    return mp3Links;

};

let main = async () => {
    //Get the list of all the songs
    let songs = await getSongs();
    songs.forEach(song => {
        console.log("🎵 Song:", song);
    });

    //Play the first song
    var audio = new Audio(songs[6]);
    audio.play();

    audio.addEventListener("loadeddata", () =>{
        let duration = audio.duration;
         console.log(duration); 
    })
}
main();

