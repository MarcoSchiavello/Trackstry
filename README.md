# Trackstry
Audio player Spotify-like

---
# Installation

requirements: Node.js & npm

to install do the following steps:
```
npm i nodemon <-- if not installed yet
npm install 
```
after this go to api/ and do:
```
cp .env.sample .env
```
and fill it with the Database credentials(in the JWt secret you can put Hex junk)
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