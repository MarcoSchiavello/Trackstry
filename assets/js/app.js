//------------------puntatore nav-bar---------------------
movePointer(0);
document.addEventListener('mousemove', e =>{
    var on_ele = document.elementFromPoint(e.pageX - window.pageXOffset, e.pageY - window.pageYOffset);
    /*
        window.pageYOffset dice di quanto ho "scrollato" avendo questo posso prendere la posizione assoluta del cursore e togliergli 
        di quanto scrollato in modo da avere la posizione del mouse relativa alla mia finestra facendo credere che il mio cursore sia in alto nel documento
        in modo da triggerare l'evento e al coltempo essere nella mia finestra come deve essere
    */
    if(on_ele == null)
        return;
    if( !on_ele.matches("ul") && !on_ele.matches("li")  && !on_ele.matches("a"))
        movePointer(0);
});
function movePointer(voce)
{
    var lista = document.getElementsByTagName("ul")[0];
    var voce = document.getElementsByTagName("li")[voce];
    var selector = document.getElementById("selector");
    selector.style.left= (voce.offsetLeft + (voce.offsetWidth/2)-(selector.offsetWidth/2) + "px");
} 
//-----------------------------------------------------------
var nav = document.getElementById("header");
if (document.documentElement.scrollTop >= 150) 
{
    header.style.background="white";
    header.style.borderBottom="solid black 1px";
}
window.onscroll = function () 
{
    if (document.documentElement.scrollTop >= 150) 
    {
        header.style.background="white";
        header.style.borderBottom="solid black 1px";
    }
    else 
    {
        header.style.background="transparent";
        header.style.borderBottom="";
    }
};

//drop menu three dot
document.getElementById("three_dot").onclick = ()=>{
    var ele = document.getElementById("three_dot_cont");
    if(ele.style.display == "block")
        ele.style.display = "none";
    else
        ele.style.display = "block";
};

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