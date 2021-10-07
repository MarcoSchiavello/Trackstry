# Trackstry
Audio player Spotify-like

---
# Installation

Requirements: Git, Node.js and npm.

To install the project do the following steps:
```
git clone https://github.com/naturald/Trackstry.git
```
go to the main directory of the project and do:
```
npm i nodemon <-- if not installed yet
npm install 
```
after this go to api/ and do:
```
cp .env.sample .env
```
fill it with the Database credentials(in the JWT secret you can put Hex junk)
```
DB_USERNAME=
DB_PWD=
DB_HOST=localhost
DB=
JWT_SECRET=
```
once you put the credentials and the JWT secret in the .env file, do:
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
Check the token send in the cookie and if it's valid and the user inside the cookie exist returns the user object

Cookie params:<br />
+ jwt (required): jwt token that identify the user in the subsequent apis requests

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

Given user\'s credential try to log in the user 

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

Remove the token from the cookie

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
+ artistId (required): id of the artist we want to add the new song

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