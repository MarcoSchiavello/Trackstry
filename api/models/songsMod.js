const {mysql,conn} = require('../config/dataBase');  

module.exports = {
    getAllSongs: artId =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT songs.*,artist_name FROM songs INNER JOIN artists ON fk_artist_id = artist_id WHERE fk_artist_id = ?;";
            conn.query(query,[Number(artId)],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    const songs = [];
                    
                    res.forEach(ele => {
                        songs.push({
                            id: ele.song_id,
                            songAudio: ele.song_audio,
                            songName: ele.song_name,
                            songImg: ele.song_img,
                            songDuration: ele.song_duration,
                            artist: {
                                id: ele.fk_artist_id,
                                name: ele.artist_name,
                            },
                            albumId: ele.fk_album_id,
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

    getSongById: (artId,songId) =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT songs.*,artist_name FROM songs INNER JOIN artists ON fk_artist_id = artist_id WHERE fk_artist_id = ? && song_id = ?;";
            conn.query(query,[Number(artId),Number(songId)],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    if(res.length > 0)
                    {
                        const song = {
                            id: res[0].song_id,
                            songAudio: res[0].song_audio,
                            songName: res[0].song_name,
                            songImg: res[0].song_img,
                            songDuration: res[0].song_duration,
                            artist: {
                                id: res[0].fk_artist_id,
                                name: res[0].artist_name,
                            },
                            albumId: res[0].fk_album_id
                        };
                        solved(song);
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

    addSong: (artId,song) =>{
        return new Promise((solved,reject) =>{
            let albumId = null;
            if(song.albumId !== undefined)
                albumId = Number(song.albumId);
                
            const query = "INSERT INTO songs VALUES(null,?,?,?,?,?,?);";
            conn.query(query,[song.songAudio,song.songName,song.songImg,song.songDuration,Number(artId),albumId],(err,res) =>{
                console.log(err);
                if(err === null)
                {
                    conn.query("SELECT LAST_INSERT_ID();",(err,res) =>{
                        if(err === null)
                            solved(res[0]["LAST_INSERT_ID()"]);
                        else
                            reject(false);
                    });  
                }
                else
                    reject(false);
            });
        });
    },

    remSong: (artId,songId) =>{
        return new Promise((solved,reject) =>{
            const query = "DELETE FROM favorites WHERE fk_song_id = ?;";
            conn.query(query,[Number(songId)],(err,res) =>{
                if(err === null)
                {
                    const query = "DELETE FROM songs WHERE fk_artist_id = ? && song_id = ?;";
                    conn.query(query,[Number(artId),Number(songId)],(err,res) =>{
                        if(err === null)
                            solved(true);
                        else
                            reject(false);
                    });
                }
                else
                    reject(false);
            });
        });
    },
}