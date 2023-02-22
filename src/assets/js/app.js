"use strict";


//add song
function add_songAlbum()
{
    var album = document.getElementById('album_list');
    var node = album.lastElementChild;
    var copy = node.cloneNode(true);//clone the album entry in the list, true in the argument indicates copy deep

    copy.querySelector(".uploadSong").value = "";
    copy.querySelector("input[name='title_song']").value = "";
    copy.querySelector("#uploadSongName").innerHTML = "";
    album.appendChild(copy);

    //increments the track number
    var ult_track = document.getElementsByClassName("n_track");
    ult_track[ult_track.length-1].innerHTML = parseInt(ult_track[ult_track.length-1].innerHTML)+1;

    copy.querySelector(".fakeUploadSong").onclick = e => {
        copy.querySelector(".uploadSong").click();
    }
    
    copy.querySelector(".uploadSong").onchange = e => {

        let fileName = copy.querySelector(".uploadSong").value;
        fileName = fileName.split("/").length > fileName.split("\\").length ? fileName.split("/") : fileName.split("\\");
        fileName = fileName[fileName.length-1];
        copy.querySelector("#uploadSongName").innerHTML = fileName;
    }
}



//recount the track number
function recount()
{
    var songs = document.getElementsByClassName("n_track");
    for(var i = 0; i<songs.length;i++) {
        songs[i].innerHTML = i+1;
    }
}

//given a file taken from input of type audio returns his duration
function getDuration(file)
{
    var audio = new Audio();
    //create an object on the resource want and return his link that can be now access by the site
    audio.src = URL.createObjectURL(file.files[0]);
    return new Promise((solved,reject) => {
        //canplaythrough is an event that indicate if the song can be played, in doing this load the song and we can take the duration
        audio.addEventListener("canplaythrough",e =>{ 
            solved(audio.duration);
        })
    })
}

//given a seconds duration converts it into the time format mm:ss
function getTimeFormat(time)
{
    let min = Math.floor(time / 60);
    let sec = time - (min*60)
    if(sec < 10)
        sec = "0"+sec;
    return min+":"+sec;
}


