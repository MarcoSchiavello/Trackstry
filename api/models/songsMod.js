const {mysql,conn} = require('../config/dataBase');  

module.exports = {
    getAllSongs: artId =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT * FROM songs WHERE fk_artist_id = ?;";
            conn.query(query,[artId],(err,res) =>{
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
                            artistId: ele.fk_artist_id,
                            albumId: ele.fk_album_id
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
            const query = "SELECT * FROM songs WHERE fk_artist_id = ? && song_id = ?;";
            conn.query(query,[artId,songId],(err,res) =>{
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
                            artistId: res[0].fk_artist_id,
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
            const query = "INSERT INTO songs VALUES(null,?,?,?,?,?,null)";
            conn.query(query,[song.songAudio,song.songName,song.songImg,song.songDuration,artId],(err,res) =>{
                console.log(err);
                if(err === null)
                    solved(true);
                else
                    reject(false);
            });
        });
    },
}