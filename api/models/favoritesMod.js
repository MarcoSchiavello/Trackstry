const {mysql,conn} = require('../config/dataBase');  

module.exports = {
    getAllFavorites: artId =>{
        return new Promise((solved,reject) =>{
            const query = `SELECT favorite_id,song_id,song_name,song_img,song_duration,songs.fk_artist_id,artist_name,fk_album_id,album_name
            FROM songs
            INNER JOIN favorites ON fk_song_id = song_id
            INNER JOIN artists ON songs.fk_artist_id = artist_id
            LEFT JOIN albums ON fk_album_id = album_id
            WHERE favorites.fk_artist_id = ?;`;

            conn.query(query,[Number(artId)],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    const favSongs = [];
                    res.forEach(ele => {
                        favSongs.push({
                            id: ele.favorite_id,
                            song: {
                               id: ele.song_id,
                               name: ele.song_name,
                               duration: ele.song_duration,
                            },
                            artist: {
                                id: ele.fk_artist_id, 
                                name: ele.artist_name
                            },
                            album: {
                                id: ele.fk_album_id,
                                name: ele.album_name,
                            },

                        });
                    });
                    solved(favSongs);
                }
                else
                {
                    reject(-1);
                }
            });
        });
    },

    getFavoriteById: (artId,songId) =>{
        return new Promise((solved,reject) =>{
            const query = `SELECT favorite_id,song_id,song_name,song_img,song_duration,songs.fk_artist_id,artist_name,fk_album_id,album_name
            FROM songs
            INNER JOIN favorites ON fk_song_id = song_id
            INNER JOIN artists ON songs.fk_artist_id = artist_id
            LEFT JOIN albums ON fk_album_id = album_id
            WHERE favorites.fk_artist_id = ? && fk_song_id = ?;`;
            conn.query(query,[Number(artId),Number(songId)],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    if(res.length > 0)
                    {
                        const favorite = {
                            id: res[0].song_id,
                            song: {
                                id: res[0].song_id,
                                name: res[0].song_name,
                                duration: res[0].song_duration,
                            },
                            artist: {
                                id: res[0].fk_artist_id, 
                                name: res[0].artist_name
                            },
                            album: {
                                id: res[0].fk_album_id,
                                name: res[0].album_name,
                            },

                        };
                        solved(favorite);
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

    addFavorite: (artId,songId) =>{
        return new Promise((solved,reject) =>{
            const query = `INSERT INTO favorites VALUES(null,?,?)`;
            conn.query(query,[Number(artId),Number(songId)],(err,res) =>{
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

    remFavorite: (artId,songId) =>{
        return new Promise((solved,reject) =>{
            const query = `DELETE FROM favorites WHERE fk_artist_id = ? && fk_song_id = ?;`;
            conn.query(query,[Number(artId),Number(songId)],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    solved(true);
                }
                else
                {
                    reject(false);
                }
            });
        });
    },

    alreadyExistFav: (artId,songId) =>{
        return new Promise((solved,reject) =>{
            const query = `SELECT fk_artist_id FROM favorites WHERE fk_artist_id = ? && fk_song_id = ?`;
            conn.query(query,[Number(artId),Number(songId)],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    if(res.length !== 0)
                        solved(true);
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
}