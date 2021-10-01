"use strict";

//swap star
function swap_star(ele)
{
    if(ele.src.search("piena") !== -1)
        ele.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
    else
        ele.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
}

//aggiungi canzone
function add_songAlbum()
{
    var album = document.getElementById('album_list');
    var node = album.lastElementChild;
    var copy = node.cloneNode(true);
    copy.querySelector(".uploadSong").value = "";
    copy.querySelector("input[name='title_song']").value = "";
    copy.querySelector("#uploadSongName").innerHTML = "";
    album.appendChild(copy);
    //incremento numero traccia
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

//rimuovi canzone lista 
function remove_songAlbum(ele)
{
    if(!document.getElementsByClassName("n_track")[1])
        return;
    ele.parentElement.remove();

    recount();
}

//ri assegna il numero della traccia
function recount()
{
    var songs = document.getElementsByClassName("n_track");
    for(var i = 0; i<songs.length;i++)
    {
        songs[i].innerHTML = i+1;
    }
}

//slider
function slideNext()
{
    const slider = document.getElementById("img_container_slider");
    if(slider.childElementCount-1 == offset)
    {
        slider.style.transition = "unset";
        slider.style.left = "0%";
        offset = 0;
    }
    else
    {
        slider.style.transition = "2s ease";
        slider.style.left = "-"+offset+"00%";
    }
    offset++;
}

function getDuration(file)
{
    var audio = new Audio();
    audio.src = URL.createObjectURL(file.files[0]);
    return new Promise((solved,reject) => {
        audio.addEventListener("canplaythrough",e =>{
            solved(audio.duration);
        })
    })
}

function getTimeFormat(time)
{
    let min = Math.floor(time / 60);
    let sec = time - (min*60)
    if(sec < 10)
        sec = "0"+sec;
    return min+":"+sec;
}
