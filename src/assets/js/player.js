var audio = document.getElementById("player");
document.getElementById("duration").addEventListener('click',chageTime);
audio.volume = 0.50;


const urlParams = new URLSearchParams(location.search);
document.querySelector("#prevPage").href = "/artista/"+urlParams.get("artist");

let songCounter = 0, repeatMode = 0, songs = {}, random = false;

if(urlParams.get("album") === null)
{
    document.querySelector("#next").style.display = "none";
    document.querySelector("#back").style.display = "none";
    document.querySelector("#random").style.opacity = 0;

    fetch("http://localhost:4000/v1/artists/"+urlParams.get("artist")+"/songs/"+urlParams.get("song"),{method:"GET",credentials:"include"})
    .then(res => res.json())
    .then(song => {
        document.querySelector("#img_player").src = "http://localhost:4000"+song.img;
        document.querySelector("#player").src = "http://localhost:4000"+song.audio; 
        document.querySelector(".songInfo > h1").innerHTML = song.name;
        document.querySelector(".songInfo > h5").innerHTML = song.artist.name;

        document.querySelector("#player").addEventListener("ended",e => {
            pause();
            if(Number(repeatMode) !== 0)
                document.querySelector("#player").currentTime = 0;
            else
                location.href = "/artista/"+urlParams.get("artist");
            start();
        });

        updateTime();
    })
}
else
{
    fetch("http://localhost:4000/v1/artists/"+urlParams.get("artist")+"/albums/"+urlParams.get("album"),{method:"GET",credentials:"include"})
    .then(res => res.json())
    .then(album => {
        document.querySelector("#img_player").src = "http://localhost:4000"+album.img;
    })

    fetch("http://localhost:4000/v1/artists/"+urlParams.get("artist")+"/albums/"+urlParams.get("album")+"/songs",{method:"GET",credentials:"include"})
    .then(res => res.json())
    .then(fetchedSongs => {

        for(let i = 0;i < fetchedSongs.length && songCounter === 0; i++)
            if(fetchedSongs[i].id === Number(urlParams.get("song")))
                songCounter = i;                 

        songs = fetchedSongs;

        fillFiled(songs[songCounter]);

        document.querySelector("#player").addEventListener("ended",e => {
            pause();
            if(songCounter === songs.length-1)
            {
                if(repeatMode === 1)
                    songCounter = 0;
                else if(repeatMode === 0 && !random)
                    location.href = "/artista/"+urlParams.get("artist");
            }
            else
                if(repeatMode !== 2 && !random)
                    songCounter++;
                else if(random)
                {
                    let randPicked = -1;
                    while(randPicked === -1)
                        randPicked = Math.floor(Math.random()*songs.length);
                    
                    songCounter = randPicked;
                }

            fillFiled(songs[songCounter]);
            start();
        });

        document.querySelector("#next").addEventListener("click",e => {
            if(songCounter === songs.length-1)
                return;
            pause();
            songCounter++;
            fillFiled(songs[songCounter]);
            start();
        });

        document.querySelector("#back").addEventListener("click",e => {
            if(songCounter === 0)
                return;
            pause();
            songCounter--;
            fillFiled(songs[songCounter]);
            start();
        });
        
        updateTime();
    })
}

document.querySelector("#reDo").addEventListener("click",e => {
    const reDo = document.querySelector("#reDo");
    const rand = document.querySelector("#random");
    if(reDo.style.color === "orange")
    {
        repeatMode = 2;
        reDo.style.color = "red";
    }
    else if(reDo.style.color === "red" )
    {
        repeatMode = 0;
        reDo.style.color = "black";
    }
    else 
    {
        random = false;
        rand.style.color = "black";
        repeatMode = 1;
        reDo.style.color = "orange";  
    }
});

document.querySelector("#random").addEventListener("click",e => {
    const rand = document.querySelector("#random");
    if(rand.style.color === "red")
    {
        random = false;
        rand.style.color = "black";
    }
    else
    {
        repeatMode = 0;
        document.querySelector("#reDo").style.color = "black";
        random = true;
        rand.style.color = "red";
    }
});

function start()
{
    if(document.getElementById("pause-icon").style.display == "block")
        pause();
    else
    {
        audio.play();
        document.getElementById("play-icon").style.display = "none";
        document.getElementById("pause-icon").style.display = "block";
    }
}
function pause()
{
    audio.pause();
    document.getElementById("play-icon").style.display = "block";
    document.getElementById("pause-icon").style.display = "none";
} 
function chageAudio(time)
{
    audio.volume = time /100;
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

function fillFiled(songAlbumObj)
{
    document.querySelector("#player").src = "http://localhost:4000"+songAlbumObj.audio; 
    document.querySelector(".songInfo > h1").innerHTML = songAlbumObj.name;
    document.querySelector(".songInfo > h5").innerHTML = songAlbumObj.artist.name;
}