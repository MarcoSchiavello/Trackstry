
fetch("http://localhost:4000/v1/auth/isLoggedIn",{method: "GET",credentials: 'include'})
.then(res => {
    if(res.status > 399)
        throw new Error(res.status);
    return res.json(); 
})
.then(artist => {
    document.querySelector("#header").innerHTML = `
        <a href="/">
            <img src="../assets/Img/Logo.png" alt="icon" id="logo">
        </a>
        <div style="display: flex; align-items: center;margin: 0 7px;">
            <ul style="display: flex;padding: 0;padding: 10px 20px;">
                <li onmouseover="movePointer(0)" class="voice_nav" ><a href="/">Home</a></li>
                <li onmouseover="movePointer(1)" class="voice_nav" ><a href="/artisti">artisti</a></li>
                <li class="voice_nav" id="nav_user" >
                    <span>Username</span>
                    <div id="user_cont">
                        <ul id="drop_user_cont">
                            <li class="cont_voice"><a href="/mia_musica/${artist.id}">Musica</a></li>
                            <li class="cont_voice" style="border-bottom: none;"><a href="/preferiti/${artist.id}">Preferiti</a></li>
                        </ul>
                    </div>
                </li>       
            </ul>

            <img src="../assets/Img/nav/selector.png" alt="selector" id="selector">
            <hr class="splitbar_nav">
            <div style="display: flex;align-items: center;">
                <img src="#" id="img_user_nav">
                <div id="welcome_user">
                    Ciao, <br>
                </div>
                <span id="three_dot">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </span>
                <div id="three_dot_cont" style="width: 150px;">
                    <ul style="display: flex;padding: 0;flex-direction: column;margin: 0;">
                        <li class="cont_voice"><a href="/profilo/${artist.id}">Modifica profilo</a></li>
                        <li class="cont_voice" style="border-bottom: none;"><a id="logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
        
    document.querySelector("#img_user_nav").src = "http://localhost:4000"+artist.img;
    document.querySelector("#welcome_user").innerHTML += artist.name;
    document.querySelector("#nav_user > span").innerHTML = artist.name;

    //drop menu three dot
    document.querySelector("#three_dot").onclick = ()=>{
        var ele = document.getElementById("three_dot_cont");
        if(ele.style.display == "block")
            ele.style.display = "none";
        else
            ele.style.display = "block";
    };

    document.querySelector("#logout").onclick = e =>{
        fetch("http://localhost:4000/v1/logout",{method: "POST",credentials: 'include'})
        .then(res => {
            location.href = "/login";
        });
    }

    document.querySelector("#nav_user").addEventListener("mouseover",e => {
        movePointer(2);
        document.querySelector("#user_cont").style.display = "block";
    });

    document.querySelector("#nav_user").addEventListener("mouseover",e => movePointer(2));
    
    document.querySelector("#nav_user").addEventListener("mouseleave",e => {
        document.querySelector("#user_cont").style.display = "none";
    });
})
.catch(err =>{
    document.querySelector("#header").innerHTML = `
        <a href="/">
            <img src="../assets/Img/Logo.png" alt="icon" id="logo">
        </a>
        <div style="display: flex; align-items: center;margin: 0 20px;">
            <ul style="display: flex;padding: 0;">
                <li onmouseover="movePointer(0)" class="voice_nav" ><a href="/">Home</a></li>
                <li onmouseover="movePointer(1)" class="voice_nav" ><a href="/artisti">artisti</a></li>
            </ul>
            <img src="../assets/Img/nav/selector.png" alt="selector" id="selector">
            <hr style="transform: rotate(90deg);width: 40px;border:solid black 1px;">
            <div style="display: flex;align-items: center;">
                <a href="/login" id="logIn">
                    Login
                </a>
                <button class="button" onclick="location.href = '/signup'">
                    Sign up
                </button>
            </div>
        </div>`;
})
.finally(() => {
    movePointer(0);
    //------------------puntatore nav-bar---------------------
    document.addEventListener('mousemove', e =>{
        var on_ele = document.elementFromPoint(e.pageX - window.pageXOffset, e.pageY - window.pageYOffset);
        /*
            window.pageYOffset dice di quanto ho "scrollato" avendo questo posso prendere la posizione assoluta del cursore e togliergli 
            di quanto scrollato in modo da avere la posizione del mouse relativa alla mia finestra facendo credere che il mio cursore sia in alto nel documento
            in modo da triggerare l'evento e al coltempo essere nella mia finestra come deve essere
        */
        if(on_ele == null)
            return;
        if( !on_ele.matches("ul") && !on_ele.matches("li")  && !on_ele.matches("a") && !on_ele.matches("span"))
            movePointer(0);
    });

    var header = document.getElementById("header");
    if (document.documentElement.scrollTop >= 150) 
    {
        header.style.background="white";
        header.style.borderBottom="solid black 1px";
    }

    window.onscroll = () => {
        if (document.documentElement.scrollTop >= 10) 
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
 
});

function movePointer(voce)
{
    var voce = document.getElementsByTagName("li")[voce];
    var selector = document.getElementById("selector");
    selector.style.left= (voce.offsetLeft + (voce.offsetWidth/2)-(selector.offsetWidth/2) + "px");
} 
