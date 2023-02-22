const {mysql,conn} = require('../config/dataBase');  
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


module.exports = {
    login: (email,pwd) =>{
        return new Promise((solved,reject) => { //reurns a promise to wait the query
            const query = "SELECT artist_pwd,artist_id FROM artists WHERE artist_email = ? ;"; // conn.escape adds already '' around the value
            conn.query(query,[email],(err,res) =>{
                if(err === null && res !== undefined && res.length) 
                {
                    const salt = res[0].artist_pwd.split(".")[1];
                    if(crypto.createHash("SHA256").update(pwd+salt).digest("hex") === res[0].artist_pwd.split(".")[0]) // check if the hash created is equal to the DB stored one 
                    {
                        const token = jwt.sign({userId: res[0].artist_id},process.env.JWT_SECRET);
                        solved(token);
                    }
                    else
                        reject(false);
                }
                else {
                    reject(false);
                }
            });
        });
    },

    signup: (username,email,pwd) =>{
        return new Promise((solved,reject) => { //reurns a promise to wait the query
            const randNum = Math.floor(Math.random() * 3 + 1); //random number for banner img
            const salt = crypto.randomBytes(16).toString("hex");
            const hash = crypto.createHash("SHA256").update(pwd+salt).digest("hex");
            const query = "INSERT INTO artists(artist_id,artist_name,artist_email,artist_pwd,artist_banner) VALUES(null,?,?,?,'/files/banners/default/default?.png');"; // conn.escape adds already '' around the value
            conn.query(query,[username,email,hash+"."+salt,Number(randNum)],(err,res) =>{
                console.log(err);
                if(err === null && res != undefined)
                {
                    const tokenPacket = {};
                    const queryForArtistId = new Promise(succ => {
                        conn.query("SELECT artist_id FROM artists WHERE artist_name = "+conn.escape(username)+";",(err,res) =>{
                            succ(res[0].artist_id);
                        });
                    });
                
                    queryForArtistId.then(artistId => {
                        const token = jwt.sign({userId: artistId},process.env.JWT_SECRET);
                        tokenPacket.artId = artistId;
                        tokenPacket.token = token;
                        solved(tokenPacket);
                    });
                }
                else
                {
                    if(err.errno === 1062)
                    {
                        let dupedEntry = err.sqlMessage;
                        dupedEntry = dupedEntry.split("key")[1].split('\'')[1];
                        if(dupedEntry === "artist_name")
                            reject(0);
                        else if(dupedEntry === "artist_email")
                            reject(1);
                    }
                    reject(false);
                }
            });
        });
    },

    getUserById: (userId,tokenUserId = false) => {
        return new Promise((solved,reject) => {
            const query = 'SELECT artist_id,artist_name,artist_img,artist_banner,artist_email FROM artists WHERE artist_id = '+conn.escape(userId)+';';
            conn.query(query,(err,res) => {
                if(err === null && res !== undefined)
                {
                    if(res.length === 0)
                        reject(false);
                    else
                    { 
                        const user = {
                            id: res[0].artist_id,
                            name: res[0].artist_name,
                            img: res[0].artist_img,
                            banner: res[0].artist_banner,
                            email: res[0].artist_email 
                        };

                        if(tokenUserId === false)
                        {
                            delete user.email;
                        }
                        solved(user);
                    }
                } 
                else 
                    reject(-1);
            });
        });
    },

    getAllUser: () => {
        return new Promise((solved,reject) => {
            const query = 'SELECT artist_id,artist_name,artist_img,artist_banner FROM artists;';
            conn.query(query,(err,res) => {
                if(err === null && res !== undefined)
                {
                    const users = [];
                    
                    res.forEach(ele => {
                        users.push({
                            id: ele.artist_id,
                            name: ele.artist_name,
                            img: ele.artist_img,
                            banner: ele.artist_banner
                        });
                    });
                    solved(users);
                } 
                else 
                    reject(-1);
            });
        });
    },

    changeArtist: (artId, newUserData) => {
        return new Promise((solved,reject) => {
            let fieldToSet = "";

            if(newUserData.newUsername !== undefined)
                fieldToSet = fieldToSet+"artist_name = "+conn.escape(newUserData.newUsername)+",";
            if(newUserData.newImg !== undefined)
                fieldToSet = fieldToSet+"artist_img = "+conn.escape(newUserData.newImg)+",";
            if(newUserData.newBanner !== undefined)
                fieldToSet = fieldToSet+"artist_banner = "+conn.escape(newUserData.newBanner)+",";
            if(newUserData.newPassword !== undefined) {
                const salt = crypto.randomBytes(16).toString("hex");
                const hash = crypto.createHash("SHA256").update(newUserData.newPassword+salt).digest("hex");
                fieldToSet = fieldToSet+"artist_pwd = "+conn.escape(hash+"."+salt)+",";
            }  
            if(newUserData.newEmail !== undefined)
                fieldToSet = fieldToSet+"artist_email = "+conn.escape(newUserData.newEmail);
        
            if(fieldToSet[fieldToSet.length-1] === ",")
                fieldToSet = fieldToSet.substr(0,fieldToSet.length-1);
                
            const query = "UPDATE artists SET "+fieldToSet+" WHERE artist_id = ?;";

            console.log(query, artId);
            conn.query(query,[Number(artId)],(err,res) => {
                if(err === null && res !== undefined){
                    solved(true);
                } else {
                    console.log(err);
                    reject(false);
                }
            });
        });
    },
};