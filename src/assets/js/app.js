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
    album.appendChild(copy);
    //incremento numero traccia
    var ult_track = document.getElementsByClassName("n_track");
    ult_track[ult_track.length-1].innerHTML = parseInt(ult_track[ult_track.length-1].innerHTML)+1;
    console.log(ult_track.innerHTML);
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

/*UTILE 
document.getElementById("fake_file").onclick=function()
{
    document.getElementById("file").click();
}
$("#file").change(function() 
{
    document.getElementById("sele").style.display="none";
    pre_img(this); 
});

function pre_img(input) 
{
    
    if (input.files && input.files[0]) 
    {
    
        
        var reader = new FileReader();
    
        reader.onload = function(e) 
        {
        $('#pre_img').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }

}
*/
