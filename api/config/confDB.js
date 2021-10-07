require('dotenv').config({path:__dirname+'/../.env'});
const mysql = require("mysql");

const conn = mysql.createConnection({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    database: process.env.DB
});

conn.connect(err =>{
    if(err)
        console.log("errore con la connesione al DB");
});

let promises = [];

promises.push(new Promise(solved =>{ 
conn.query(`CREATE TABLE IF NOT EXISTS artists(
	artist_id INT UNSIGNED auto_increment,
    artist_name VARCHAR(50) UNIQUE NOT NULL,
    artist_img VARCHAR(150) NOT NULL DEFAULT "/files/icons/profiles/default/default.png",
    artist_banner VARCHAR(150) NOT NULL DEFAULT "/files/banners/default/default1.png",
    artist_pwd VARCHAR(100) NOT NULL,
	artist_email VARCHAR(60) UNIQUE NOT NULL,
    primary key(artist_id)
) ENGINE=InnoDB;`,() => solved(true))})
)

promises.push(new Promise(solved =>{ 
conn.query(`
CREATE TABLE IF NOT EXISTS albums(
	album_id INT UNSIGNED auto_increment,
    album_name VARCHAR(50) UNIQUE NOT NULL,
    album_img VARCHAR(150) NOT NULL DEFAULT "/files/icons/albums/default/default.png",
    fk_artist_id INT UNSIGNED,
    primary key(album_id),
    foreign key (fk_artist_id) references artists(artist_id)
) ENGINE=InnoDB;`,() => solved(true))})
)

promises.push(new Promise(solved =>{ 
conn.query(`
CREATE TABLE IF NOT EXISTS songs(
	song_id INT UNSIGNED auto_increment,
    song_audio VARCHAR(300) NOT NULL,
    song_name VARCHAR(50) UNIQUE NOT NULL,
    song_img VARCHAR(150) NOT NULL DEFAULT "/files/icons/songs/default/default.png",
    song_duration INT UNSIGNED NOT NULL,
    fk_artist_id INT UNSIGNED,
    fk_album_id INT UNSIGNED NULL default null,
	foreign key (fk_artist_id) references artists(artist_id),
    foreign key (fk_album_id) references albums(album_id),
    primary key(song_id)
) ENGINE=InnoDB;`,() => solved(true))})
)

promises.push(new Promise(solved =>{ 
conn.query(`
CREATE TABLE IF NOT EXISTS favorites(
	favorite_id INT UNSIGNED auto_increment,
    fk_artist_id INT UNSIGNED,
    fk_song_id INT UNSIGNED,
	foreign key (fk_artist_id) references artists(artist_id),
    foreign key (fk_song_id) references songs(song_id),
    primary key(favorite_id)
) ENGINE=InnoDB;`,() => solved(true))})
)

Promise.all(promises)
.then(() => {
    process.exit();
});
