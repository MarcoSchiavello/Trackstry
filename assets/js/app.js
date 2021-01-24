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