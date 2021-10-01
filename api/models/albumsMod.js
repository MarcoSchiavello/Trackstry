const {mysql,conn} = require('../config/dataBase');  

module.exports = {
    getAllAlbums: artId =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT albums.*,artist_name FROM albums INNER JOIN artists ON fk_artist_id = artist_id WHERE fk_artist_id = ?;";
            conn.query(query,[artId],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    const albums = [];
                    res.forEach(ele => {
                        albums.push({
                            id: ele.album_id,
                            albumName: ele.album_name,
                            albumImg: ele.album_img,
                            artist: {
                                id: ele.fk_artist_id,
                                name: ele.artist_name,
                            }
                        });
                    });
                    solved(albums);
                }
                else
                {
                    reject(-1);
                }
            });
        });
    },

    getAlbumById: (artId,albumId) =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT albums.*,artist_name FROM albums INNER JOIN artists ON fk_artist_id = artist_id WHERE fk_artist_id = ? && album_id = ?;";
            conn.query(query,[artId,albumId],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    if(res.length > 0)
                    {
                        const album = {
                            id: res[0].album_id,
                            albumName: res[0].album_name,
                            albumImg: res[0].album_img,
                            artist: {
                                id: res[0].fk_artist_id,
                                name: res[0].artist_name,
                            }
                        };
                        solved(album);
                    }
                    else
                        reject(false);   
                }
                else
                {
                    reject(-1);
                }
            });
        });
    },

    getAllSongsFromAlbum: (artId,albumId) =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT songs.*,artist_name FROM songs INNER JOIN artists ON fk_artist_id = artist_id WHERE fk_artist_id = ? && fk_album_id = ?;";
            conn.query(query,[artId,albumId],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    const songs = [];
                    res.forEach(ele => {
                        songs.push({
                            id: ele.song_id,
                            songName: ele.song_name,
                            songAudio: ele.song_audio,
                            songImg: ele.song_img,
                            songDuration: ele.song_duration,
                            artist: {
                                id: ele.fk_artist_id,
                                name: ele.artist_name,
                            }
                        });
                    });
                    solved(songs);
                }
                else
                {
                    reject(-1);
                }
            });
        });
    },

    addAlbum: (artId,album) =>{
        return new Promise((solved,reject) =>{
            const query = "INSERT INTO albums VALUES(null,?,?,?);";
            conn.query(query,[album.albumName,album.albumImg,artId],(err,res) =>{
                console.log(err);
                if(err === null && res !== undefined)
                {
                    conn.query("SELECT LAST_INSERT_ID();",(err,res) =>{
                        if(err === null)
                            solved(res[0]["LAST_INSERT_ID()"]);
                        else
                            reject(false);
                    });  
                }
                else
                {
                   
                    reject(false);
                }
            });
        });
    },
}