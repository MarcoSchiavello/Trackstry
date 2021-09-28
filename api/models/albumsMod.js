const {mysql,conn} = require('../config/dataBase');  

module.exports = {
    getAllAlbums: artId =>{
        return new Promise((solved,reject) =>{
            const query = "SELECT * FROM albums WHERE fk_artist_id = ?;";
            conn.query(query,[artId],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    const albums = [];
                    res.forEach(ele => {
                        albums.push({
                            id: ele.album_id,
                            albumName: ele.album_name,
                            albumImg: ele.album_img,
                            artistId: ele.fk_artist_id
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
            const query = "SELECT * FROM albums WHERE fk_artist_id = ? && album_id = ?;";
            conn.query(query,[artId,albumId],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    if(res.length > 0)
                    {
                        const album = {
                            id: res[0].album_id,
                            albumName: res[0].album_name,
                            albumImg: res[0].album_img,
                            artistId: res[0].fk_artist_id
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
            const query = "SELECT * FROM songs WHERE fk_artist_id = ? && fk_album_id = ?;";
            conn.query(query,[artId,albumId],(err,res) =>{
                if(err === null && res !== undefined)
                {
                    const songs = [];
                    res.forEach(ele => {
                        songs.push({
                            id: ele.song_id,
                            songName: ele.song_name,
                            songImg: ele.song_img,
                            songDuration: ele.song_duration,
                            artistId: ele.fk_artist_id,
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

}