![Static Badge](https://img.shields.io/badge/Version-1.0.0-blue)
![Static Badge](https://img.shields.io/badge/Licence-GPL_3.0-yallow)
![GitHub commit activity (master)](https://img.shields.io/github/commit-activity/t/MarcoSchiavello/Trackstry?color=orange)
![GitLab stars](https://img.shields.io/github/stars/MarcoSchiavello/Trackstry?color=purple)

-  [About](#about)
-  [Tech-stack](#tech-stack)
-  [DB-schema](#db-schema)
-  [Installation](#installation)
-  [API Doc](#api-doc)
    - [Auth](#auth)
    - [Artists](#artists)
    - [Songs](#songs)
    - [Albums](#albums)
    - [Favorites](#favorites)

<h1 align="center" id="about"><img src="https://github.com/MarcoSchiavello/Trackstry/blob/main/src/assets/img/Logo.png" style="width: 50px" /> Trackstry</h1>
Audio Player, Spotify clone with different features such as a favorites list, profile customization, and grouping song by album.
The player has also different functions like the ability to shuffle the song or to loop one song or the entire album.
The application has an API structure, such that anyone can create their own client for Trackstry or a third companion app.

## Tech-stack
- Express.js
- MySQL
- JS vanilla
- HTML
- CSS

## DB schema
<img src="https://github.com/MarcoSchiavello/Trackstry/blob/main/DBschema.PNG" />

## Installation

Requirements: Git, Node.js, and npm.

To install the project do the following steps:
```
git clone https://github.com/marcoschiavello/Trackstry.git
```
go to the main directory of the project and do:
```
npm install 
```
after this do:
```
cp api/.env.sample api/.env
```
fill it with the Database credentials(in the JWT secret you can put Hex junk)
```
DB_USERNAME=root
DB_PWD=
DB_HOST=localhost
DB=trackstry
DB_PORT=3306
JWT_SECRET=7364616464736a6b63646273686a206776756c6e79654c464e432059465953554b464c6a68664b535545204e43594546554c467975696
PORT=4000
```
do the same thing with the front-end configuration file 
```
cp src/config.sample.json src/config.json
```
fill it with the address of the API server
```
{
    "API": "127.0.0.1:4000",
    "prefix": "/v1/", <---- remember to add slashes at the start and end of the prefix
    "port": 3000
}
```
once you fill all the config file do:
run first the DB server
```
npm run confDB 
```

for run the servers, do:
```
npm run all
```
---
# API Doc

## Auth
```
GET /v1/auth/isLoggedIn
```
Check the token sent in the cookie and if it's valid and the user inside the cookie exist return the user object

Cookies params:<br />
+ jwt (required): jwt token that identifies the user in the subsequent api's requests

Response:<br />
+ 401 Unauthorized
```
Unauthorized
```

+ 200 Ok | Type: application/json
```
{
    "id": 0,
    "name": "artistName",
    "img": "artistImgPath",
    "banner": "artistBannerImgPath",
    "email": "artistEmail"
}
```

<br />
<br />

```
POST /v1/auth/login
```

Given user\'s credentials try to log in the user 

Request Body (required) | Type: application/json: <br />
```
{
    "email":"email",
    "password":"password"
}
```

Response:
+ 401 Unauthorized
```
Unauthorized
```

+ 200 Ok | Type: application/json
```
{
    "token": "JWT token"
}
```

<br />
<br />

```
POST /v1/auth/signup
```

Given user\'s data create a new artist

Request Body (required) | Type: application/json: <br />
```
{
    "username": "username",
    "email": "email",
    "password": "password"
}
```

Response:
+ 409 Conflict
```
{
    "error": "username or email are taken"
}
```

+ 200 Ok | Type: application/json
```
{
    "token": "JWT token"
}
```

<br />
<br />

```
POST /v1/auth/logout
```

Remove the token from the Cookies

Response:

+ 200 Ok | Type: application/json
```
{
    "msg": "cookie successfully deleted"
}
```

<br />
<br />

## Artists
```
GET /v1/artists
```
Returns all artists

Response:<br />
+ 200 Ok | Type: application/json
```
[
    {
        "id": 0,
        "name": "artistName",
        "img": "artistImgPath",
        "banner": "artistBannerImgPath",
    },
    {
        "id": 1,
        "name": "artistName",
        "img": "artistImgPath",
        "banner": "artistBannerImgPath",
    },
    ...
]
```

<br />
<br />

```
GET /v1/artists/{artistId}
```
Returns artist by his id

Path params:
+ artistId (required): id of the artist we want

Response:<br />
+ 200 Ok | Type: application/json
```
{
    "id": 0,
    "name": "artistName",
    "img": "artistImgPath",
    "banner": "artistBannerImgPath",
}
```

<br />
<br />

```
PATCH /v1/artists/{artistId}
```
Work in progress ...

<br />
<br />

## Songs
```
GET /v1/artists/{artistId}/songs
```
Returns all songs of the specified artist

Path params:
+ artistId (required): id of the artist we want to get all the songs

Response:<br />
+ 200 Ok | Type: application/json
```
[
   {
        "id": 0,
        "audio": "songAudioPath",
        "name": "songName",
        "img": "songImgPath",
        "duration": 0,
        "artist": {
            "id": 0,
            "name": "artistName"
        },
        "album": {
            "id": null
        }
    },
    {
        "id": 1,
        "audio": "songAudioPath",
        "name": "songName",
        "img": "songImgPath",
        "duration": 0,
        "artist": {
            "id": 0,
            "name": "artistName"
        },
        "album": {
            "id": 1
        }
    },
    ...
]
```

<br />
<br />

```
GET /v1/artists/{artistId}/songs/{songId}
```
Returns song by his id of the specified artist

Path params:
+ artistId (required): id of the artist we want to get the song
+ songId (required): id of the song we want

Response:<br />
+ 404 Not found | Type: application/json
```
{
    error:"song not found"
}
```
+ 200 Ok | Type: application/json
```
{
    "id": 0,
    "audio": "songAudioPath",
    "name": "songName",
    "img": "songImgPath",
    "duration": 0,
    "artist": {
      "id": 0,
      "name": "artistName"
    },
    "album": {
      "id": null
}
```

<br />
<br />

```
POST /v1/artists/{artistId}/songs
```
Adds a new song to the songs of the specified artist

Path params:
+ artistId (required): id of the artist we want to add to the new song

Request Body (required) | Type: multipart/form-data: <br />
+ songName | Type: Text: name of the new song
+ songImg | Type: File: the image file of the song
+ song| Type: File: the song audio file of the song
+ songDuration| Type: Text: the duration of the song
+ albumId (optional) | Type: Text: the id of the album where the song is in

Response:<br />
+ 500 Internal error | Type: application/json
```
{
    error:"error while adding the new song"
}
```
+ 200 Ok | Type: application/json
```
{
    msg:"song was added successfully"
    songId: newSongId
}
```

<br />
<br />

```
DELETE /v1/artists/{artistId}/songs/{songId}
```
Remove the song from the songs of the specified artist 

Path params:
+ artistId (required): id of the artist on which we want to remove the song
+ songId (required): id of the song we want to remove

Response:<br />
+ 500 Internal error | Type: application/json
```
{
    error:"error while removing the new song"
}
```
+ 200 Ok | Type: application/json
```
{
    msg:"song was removed successfully"
}
```

<br />
<br />

## Albums
```
GET /v1/artists/{artistId}/albums
```
Returns all albums of the specified artist 

Path params:
+ artistId (required): id of the artist we want to get all the albums

Response:<br />
+ 200 Ok | Type: application/json
```
[
    {
        "id": 0,
        "name": "albumName",
        "img": "albumImgPath",
        "artist": {
            "id": 0,
            "name": "artistName"
        }
    },
    {
        "id": 1,
        "name": "albumName",
        "img": "albumImgPath",
        "artist": {
            "id": 0,
            "name": "artistName"
        }
    },
    ...
]
```

<br />
<br />

```
GET /v1/artists/{artistId}/albums/{albumId}
```
Returns the album by his id of the specified artist 

Path params:
+ artistId (required): id of the artist we want to get the album
+ albumId (required): id of the album we want to get 

Response:<br />
+ 404 Not found | Type: application/json
```
{
    error:"album not found"
}
```
+ 200 Ok | Type: application/json
```
[
    {
        "id": 0,
        "name": "albumName",
        "img": "albumImgPath",
        "artist": {
            "id": 0,
            "name": "artistName"
        }
    },
    {
        "id": 1,
        "name": "albumName",
        "img": "albumImgPath",
        "artist": {
            "id": 0,
            "name": "artistName"
        }
    },
    ...
]
```

<br />
<br />

```
GET /v1/artists/{artistId}/albums/{albumId}/songs 
```
Returns all the song inside the album specified

Path params:
+ artistId (required): id of the artist we want to get the album\'s songs 
+ albumId (required): id of the album we want to get the songs 

Response:<br />
+ 200 Ok | Type: application/json
```
[
    {
        "id": 0,
        "name": "songName",
        "audio": "songAudioPath",
        "img": "songImgPath",
        "duration": 0,
        "artist": {
            "id": 0,
            "name": "artistName"
        }
    },
    {
        "id": 1,
        "name": "songName",
        "audio": "songAudioPath",
        "img": "songImgPath",
        "duration": 0,
        "artist": {
            "id": 0,
            "name": "artistName"
        }
    },
    ...
]
```

<br />
<br />

```
GET /v1/artists/{artistId}/albums/{albumId}/songs/{songId}
```
Returns the song inside the album specified

Path params:
+ artistId (required): id of the artist we want to get the album\'s song 
+ albumId (required): id of the album we want to get the song
+ songId (required): id of the song to get inside the album

Response:<br />
+ 404 Not found | Type: application/json
```
{
    error:"song not found"
}
```
+ 200 Ok | Type: application/json
```
{
    "id": 0,
    "name": "songName",
    "audio": "songAudioPath",
    "img": "songImgPath",
    "duration": 0,
    "artist": {
        "id": 0,
        "name": "artistName"
    },
    "album": {
        "id": 0
    }
}
```

<br />
<br />

```
POST /v1/artists/{artistId}/albums
```
Create a new album for the artist specified

Path params:
+ artistId (required): id of the artist we want to add a new album

Request Body (required) | Type: multipart/form-data: <br />
+ albumName | Type: Text: name of the new album
+ albumImg | Type: File: the image file of the new album


Response:<br />
+ 500 Not found | Type: application/json
```
{
    error: "error while creating the album"
}
```
+ 200 Ok | Type: application/json
```
{
    msg: "album was created successfully",
    albumId: newAlbumId
}
```

<br />
<br />

```
DELETE /v1/artists/{artistId}/albums/{albumId}
```
Remove the album by his id from the specified artist

Path params:
+ artistId (required): id of the artist on witch we want to remove the album
+ albumId (required): id of the album we want remove

Response:<br />
+ 500 Not found | Type: application/json
```
{
    error: "error while removing the album"
}
```
+ 200 Ok | Type: application/json
```
{
    msg:"album was removed successfully",
    albumId: newAlbumId
}
```

<br />
<br />

## favorites
```
GET /v1/artists/{artistId}/favorites
```
Returns all favorites of the specified artist 

Path params:
+ artistId (required): id of the artist we want to get all the favorites

Response:<br />
+ 200 Ok | Type: application/json
```
[
   {
        "id": 0,
        "song": {
            "id": 0,
            "name": "songName",
            "duration": 0
        },
        "artist": {
            "id": 0,
            "name": "artistName"
        },
        "album": {
            "id": null,
            "name": null
        }
    },
    {
        "id": 0,
        "song": {
            "id": 0,
            "name": "songName",
            "duration": 0
        },
        "artist": {
            "id": 0,
            "name": "artistName"
        },
        "album": {
            "id": 0,
            "name": "albumName"
        }
    },
    ...
]
```

<br />
<br />

```
GET /v1/artists/{artistId}/favorites/{songId}
```
Returns the favorite containing the specified song

Path params:
+ artistId (required): id of the artist we want to get the favorite
+ songId (required): id of the song use to get his associated favorite

Response:<br />
+ 404 Not found | Type: application/json
```
{
    error: "favorite song not found"
}
```
+ 200 Ok | Type: application/json
```
{
    "id": 0,
    "song": {
        "id": 0,
        "name": "songName",
        "duration": 0
    },
    "artist": {
        "id": 0,
        "name": "artistName"
    },
    "album": {
        "id": 0,
        "name": "albumName"
    }
}
```

<br />
<br />

```
POST /v1/artists/{artistId}/favorites
```
Adds a new favorite to the the specified artist

Path params:
+ artistId (required): id of the artist we want to add a new favorite

Request Body (required) | Type: application/json: <br />
```
{
    "songId": 0
}
```

Response:<br />
+ 409 Conflict | Type: application/json
```
{
    error: "favorite already exist" 
}
```
+ 500 Internal error | Type: application/json
```
{
    error: "error while adding the favorite"
}
```
+ 200 Ok | Type: application/json
```
{
    msg:"favorite was added successfully"
}
```

<br />
<br />

```
DELETE /v1/artists/{artistId}/favorites/{songId}
```
Remove favorite from the the specified artist

Path params:
+ artistId (required): id of the artist on wich we want to remove the favorite
+ songId (required): id of the song use to get his associated favorite

Response:<br />
+ 500 Internal error | Type: application/json
```
{
    error: "error while removing the favorite"
}
```
+ 200 Ok | Type: application/json
```
{
    msg:"favorite was removed successfully"
}
```

<br />
<br />
