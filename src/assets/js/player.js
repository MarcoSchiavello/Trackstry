import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

var audio = document.querySelector('*[field="songFile"]');
document.getElementById("duration").addEventListener('click',chageTime);
audio.volume = 0.50;


const urlParams = new URLSearchParams(location.search);
document.querySelector("#prevPage").onclick = () => window.history.go(-1);

let songCounter = 0, repeatMode = 0, songs = {}, random = false;

if(location.href.search('album') !== -1) {
    Req.APIRequest(`artists/${urlParams.get("artist")}/albums/${urlParams.get("album")}`, 'GET')
    .then(res => res.json())
    .then(album => {
        document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+album.img;
    })

    Req.APIRequest(`artists/${urlParams.get("artist")}/albums/${urlParams.get("album")}/songs`, 'GET')
    .then(res => res.json())
    .then(fetchedSongs => {

        for(let i = 0;i < fetchedSongs.length && songCounter === 0; i++)
            if(fetchedSongs[i].id === Number(urlParams.get("song")))
                songCounter = i;                 

        songs = fetchedSongs;

        fillFiled(songs[songCounter], false);

        audio.addEventListener("ended",e => {
            pause();
            if(songCounter === songs.length-1) {
                if(repeatMode === 1)
                    songCounter = 0;
                else if(repeatMode === 0 && !random)
                    location.href = "/artista/"+urlParams.get("artist");
            }
            else
                if(repeatMode !== 2 && !random)
                    songCounter++;
                else if(random) { //TODO: migliorare shuffle
                    let randPicked = -1;
                    while(randPicked === songCounter || randPicked === -1)
                        randPicked = Math.floor(Math.random() * songs.length);
                    
                    songCounter = randPicked;
                }

            fillFiled(songs[songCounter], false);
            start();
        });

        document.querySelector("#next").addEventListener("click",e => {
            if(songCounter === songs.length-1)
                return;
            pause();
            songCounter++;
            fillFiled(songs[songCounter], false);
            start();
        });

        document.querySelector("#back").addEventListener("click",e => {
            if(songCounter === 0)
                return;
            pause();
            songCounter--;
            fillFiled(songs[songCounter], false);
            start();
        });
        
        updateTime();
    })
} else if(location.href.search('favorite') !== -1) {
    Req.APIRequest(`artists/${urlParams.get("artist")}/favorites`, 'GET')
    .then(res => res.json())
    .then(fetchedSongs => {
        for(let i = 0;i < fetchedSongs.length && songCounter === 0; i++)
            if(fetchedSongs[i].id === Number(urlParams.get("favorite")))
                songCounter = i;                 

        songs = fetchedSongs;

        document.querySelector('*[field="songAuthor"]').innerHTML = songs[songCounter].artist.name;
        fillFiled(songs[songCounter].song, songs[songCounter].album.id === null);
        if(songs[songCounter].album.id !== null) {
            Req.APIRequest(`artists/${urlParams.get("artist")}/albums/${songs[songCounter].album.id}`, 'GET')
            .then(res => res.json())
            .then(album => {
                document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+album.img;
            })
        }

        audio.addEventListener("ended",e => {
            pause();
            if(songCounter === songs.length-1) {
                if(repeatMode === 1)
                    songCounter = 0;
                else if(repeatMode === 0 && !random)
                    location.href = "/preferiti/"+urlParams.get("artist");
            }
            else
                if(repeatMode !== 2 && !random)
                    songCounter++;
                else if(random) { //TODO: migliorare shuffle
                    let randPicked = -1;
                    while(randPicked === songCounter || randPicked === -1)
                        randPicked = Math.floor(Math.random() * songs.length);
                    
                    songCounter = randPicked;
                }

            document.querySelector('*[field="songAuthor"]').innerHTML = songs[songCounter].artist.name;
            fillFiled(songs[songCounter].song, songs[songCounter].album.id === null);
            if(songs[songCounter].album.id !== null) {
                Req.APIRequest(`artists/${urlParams.get("artist")}/albums/${songs[songCounter].album.id}`, 'GET')
                .then(res => res.json())
                .then(album => {
                    document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+album.img;
                })
            }

            start();
        });

        document.querySelector("#next").addEventListener("click",e => {
            if(songCounter === songs.length-1)
                return;
            pause();
            songCounter++;
            document.querySelector('*[field="songAuthor"]').innerHTML = songs[songCounter].artist.name;
            fillFiled(songs[songCounter].song, songs[songCounter].album.id === null);
            if(songs[songCounter].album.id !== null) {
                Req.APIRequest(`artists/${urlParams.get("artist")}/albums/${songs[songCounter].album.id}`, 'GET')
                .then(res => res.json())
                .then(album => {
                    document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+album.img;
                })
            }
            start();
        });

        document.querySelector("#back").addEventListener("click",e => {
            if(songCounter === 0)
                return;
            pause();
            songCounter--;
            document.querySelector('*[field="songAuthor"]').innerHTML = songs[songCounter].artist.name;
            fillFiled(songs[songCounter].song, songs[songCounter].album.id === null);
            if(songs[songCounter].album.id !== null) {
                Req.APIRequest(`artists/${urlParams.get("artist")}/albums/${songs[songCounter].album.id}`, 'GET')
                .then(res => res.json())
                .then(album => {
                    document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+album.img;
                })
            }
            start();
        });
        
        updateTime();
    })
} else {
    document.querySelector("#next").style.display = "none";
    document.querySelector("#back").style.display = "none";
    document.querySelector("#random").style.opacity = 0;

    Req.APIRequest(`artists/${urlParams.get("artist")}/songs/${urlParams.get("song")}`, 'GET')
    .then(res => res.json())
    .then(song => {
        document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+song.img;
        audio.src = `http://${Config.API}`+song.audio; 
        document.querySelector('*[field="songName"]').innerHTML = song.name;
        document.querySelector('*[field="songAuthor"]').innerHTML = song.artist.name;

        audio.addEventListener("ended",e => {
            pause();
            if(Number(repeatMode) !== 0)
            audio.currentTime = 0;
            else
                location.href = "/artista/"+urlParams.get("artist");
            start();
        });

        updateTime();
    })
} 

document.querySelector("#reDo").addEventListener("click",e => {
    const reDo = document.querySelector("#reDo path");
    const rand = document.querySelector("#random path");
    if(reDo.style.fill === "orange") {
        repeatMode = 2;
        reDo.style.fill = "red";
    }
    else if(reDo.style.fill === "red" )
    {
        repeatMode = 0;
        reDo.style.fill = "black";
    }
    else 
    {
        random = false;
        rand.style.fill = "black";
        repeatMode = 1;
        reDo.style.fill = "orange";  
    }
});

document.querySelector("#random").addEventListener("click",e => {
    const rand = document.querySelector("#random path");
    if(rand.style.fill === "red")
    {
        random = false;
        rand.style.fill = "black";
    }
    else
    {
        repeatMode = 0;
        document.querySelector("#reDo").style.fill = "black";
        random = true;
        rand.style.fill = "red";
    }
});

document.querySelector('#button-play').addEventListener('click', start);
audio.addEventListener('timeupdate', updateTime);
document.querySelector('#seek').addEventListener('change', chageAudio);

function start()
{
    if(!document.getElementById("pause-icon").classList.contains('hidden'))
        pause();
    else
    {
        audio.play();
        document.getElementById("play-icon").classList.add('hidden');
        document.getElementById("pause-icon").classList.remove('hidden');
    }
}
function pause()
{
    audio.pause();
    document.getElementById("play-icon").classList.remove('hidden');
    document.getElementById("pause-icon").classList.add('hidden');
} 
function chageAudio(e)
{
    audio.volume = e.target.value /100;
}
function chageTime()
{
    var time = document.getElementById("duration");
    audio.currentTime = (time.value * audio.duration)/10000;
}
function updateTime()
{
    var durationBar = document.getElementById("duration");
    if(!audio.duration)
    {
        durationBar.value = 0;
        return;
    }
    durationBar.value = Math.floor((audio.currentTime * 10000 ) / audio.duration);
}

function fillFiled(songAlbumObj, img = true) {
    if (img)
        document.querySelector('*[field="songImg"]').src = `http://${Config.API}`+songAlbumObj.img;

    audio.src = `http://${Config.API}`+songAlbumObj.audio; 
    document.querySelector('*[field="songName"]').innerHTML = songAlbumObj.name;
    
    if (songAlbumObj.artist !== undefined)
        document.querySelector('*[field="songAuthor"]').innerHTML = songAlbumObj.artist.name;
}