//------------------puntatore nav-bar---------------------
movePointer(0);
document.addEventListener('mousemove', e =>{
    var on_ele = document.elementFromPoint(e.pageX, e.pageY);
    if(on_ele == null)
        return;
    if( !on_ele.matches("ul") && !on_ele.matches("li") )
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
window.onscroll = function () 
{
    if (document.documentElement.scrollTop >= 200) 
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