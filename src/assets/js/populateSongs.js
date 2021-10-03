let artId = location.href.split("/");
artId = artId[artId.length-1].split("?")[0];
fetch("http://localhost:4000/v1/artists/"+artId,{method: 'GET',credentials: 'include'})
.then(res => res.json())
.then(artist => { //load profile data
        document.querySelector(".img_cover").src = "http://localhost:4000"+artist.artist_banner;
        document.querySelector("#name_artista").innerHTML = artist.artist_name;
        document.querySelector("#img_artista").src = "http://localhost:4000"+artist.artist_img;
        return artist;
})
.then(artist => {
    fetch("http://localhost:4000/v1/artists/"+artist.artist_id+"/songs",{method: 'GET',credentials: 'include'})
    .then(res => res.json())
    .then(res => { // load single song
        const sigleSong = document.querySelector(".single_song");
        res = res.filter(song => song.albumId === null);

        res.forEach(song => {
            const tmpSigleSong = sigleSong.cloneNode(true);
            tmpSigleSong.querySelector("h1").innerHTML = song.songName;
            tmpSigleSong.querySelector("h3").innerHTML = artist.artist_name;
            tmpSigleSong.querySelector("img").src = "http://localhost:4000"+song.songImg;
            tmpSigleSong.querySelector(".duration").innerHTML = getTimeFormat(song.songDuration);
            fetch("http://localhost:4000/v1/auth/isloggedIn",{method: 'GET',credentials: 'include'})
            .then(artistId => artistId.json())
            .then(artistLoggedIn => {
                const element = tmpSigleSong.querySelector(".fav_star");
                fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.artId+"/favorites/"+song.id,{method: 'GET',credentials: 'include'})
                .then(res => res.json())
                .then(favorite => {
                    if(favorite.error !== undefined)// if it find an error it means that the song is not in the favorite
                        element.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
                    else
                        element.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
                })
                tmpSigleSong.querySelector(".fav_star").addEventListener("click",e => {
                        if(element.src.search("piena") !== -1)
                        {
                            fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.artId+"/favorites/"+song.id,{
                                method: 'DELETE',
                                credentials: 'include',
                            })
                            .then(succ =>{
                                element.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
                            })
                        }
                        else
                        {
                            fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.artId+"/favorites",{
                                method: 'POST',
                                credentials: 'include',
                                headers:{'Content-Type': 'application/json'},
                                body:JSON.stringify({songId: song.id})
                            })
                            .then(succ =>{
                                element.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
                            })
                        }
                })       
            });

            tmpSigleSong.onclick = e => {
                if(e.target.className.search("fav_star") === -1)
                    location.href = "/player?artist="+artist.artist_id+"&song="+song.id;
            };


            tmpSigleSong.removeAttribute("style");
            document.querySelector(".song_container").appendChild(tmpSigleSong);
        });
    })

    // load albums
    fetch("http://localhost:4000/v1/artists/"+artist.artist_id+"/albums",{method: 'GET',credentials: 'include'})
    .then(res => res.json())
    .then(res => {
        const albumEle = document.querySelector(".album");

        res.forEach(album => {
            const tmpAlbumEle = albumEle.cloneNode(true);
            tmpAlbumEle.querySelector(".album_header h1").innerHTML = album.albumName;
            tmpAlbumEle.querySelector(".album_header img").src = "http://localhost:4000"+album.albumImg;
            
            // load album's songs
            fetch("http://localhost:4000/v1/artists/"+artist.artist_id+"/albums/"+album.id+"/songs",{method: 'GET',credentials: 'include'})
            .then(res => res.json())
            .then(albumSongs => {
                const albumSongEle = tmpAlbumEle.querySelector(".album_song");
                const albumList = tmpAlbumEle.querySelector(".album_list");
                let i = 1;
                
                albumSongs.forEach(albumSong =>{
                    const tmpAlbumSongEle = albumSongEle.cloneNode(true);
                    tmpAlbumSongEle.querySelector(".n_track").innerHTML += (" "+i);
                    tmpAlbumSongEle.querySelector(".song_name").innerHTML = albumSong.songName;
                    tmpAlbumSongEle.querySelector(".author").innerHTML = artist.artist_name;
                    tmpAlbumSongEle.querySelector(".song_title").innerHTML = album.albumName;
                    tmpAlbumSongEle.querySelector(".duration").innerHTML = getTimeFormat(albumSong.songDuration);
                    fetch("http://localhost:4000/v1/auth/isloggedIn",{method: 'GET',credentials: 'include'})
                    .then(artistId => artistId.json())
                    .then(artistLoggedIn => {
                        const element = tmpAlbumSongEle.querySelector(".fav_star");
                        fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.artId+"/favorites/"+albumSong.id,{method: 'GET',credentials: 'include'})
                        .then(res => res.json())
                        .then(favorite => {
                            if(favorite.error !== undefined)// if it find an error it means that the song is not in the favorite
                                element.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
                            else
                                element.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
                        })
                        tmpAlbumSongEle.querySelector(".fav_star").addEventListener("click",e => {
                            if(element.src.search("piena") !== -1)
                            {
                                fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.artId+"/favorites/"+albumSong.id,{
                                    method: 'DELETE',
                                    credentials: 'include',
                                })
                                .then(succ =>{
                                    element.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
                                })
                            }
                            else
                            {
                                fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.artId+"/favorites",{
                                    method: 'POST',
                                    credentials: 'include',
                                    headers:{'Content-Type': 'application/json'},
                                    body:JSON.stringify({songId: albumSong.id})
                                })
                                .then(succ =>{
                                    element.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
                                })
                            }
                        })       
                    });

                    tmpAlbumSongEle.onclick = e => {
                        if(e.target.className.search("fav_star") === -1)
                            location.href = "/player?artist="+artist.artist_id+"&album="+album.id+"&song="+albumSong.id;
                    };
                    
                    tmpAlbumSongEle.removeAttribute("style");
                    albumList.appendChild(tmpAlbumSongEle);
                    i++;                                
                });
            })
            .then(() =>{
                tmpAlbumEle.removeAttribute("style");
                document.querySelector(".song_container").appendChild(tmpAlbumEle);
            })
        });
    })
})
