let token = undefined;
let expires = undefined;
const clientId = "036e785f7eaf481ab13750e22a86eebd";
const redirectUri = "http://jpjamms.surge.sh/";

const Spotify = {

getAccessToken(){

if (token){
  return token;
}

const urlToken = window.location.href.match(/access_token=([^&]*)/);
const urlExpires = window.location.href.match(/expires_in=([^&]*)/);

if (urlToken && urlExpires)
{
  token = urlToken[1];
  expires = urlExpires[1];
  window.setTimeout(() => token = '', expires * 1000);
  window.history.pushState('Access Token', null, '/');
} else {
  window.location = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;
}

},

search(searchTerm){

return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
  {
    headers : {Authorization: `Bearer ${token}`}
  })
  .then(response => response.json())
  .then(jsonResponse => {
  if(jsonResponse.tracks)
    {
      return jsonResponse.tracks.items.map ( track => {
        return {
         id: track.id,
         name: track.name,
         artist: track.artists[0].name,
         album: track.album.name,
         uri: track.uri
        }
      })
    }
  });
},

savePlaylist(playlistName, uriArray) {

if (!playlistName || !uriArray)
  return;

let accessToken = token;
let headers = {Authorization: `Bearer ${accessToken}`};
let userId = undefined;
let playlistId = undefined;

fetch(`https://api.spotify.com/v1/me`, {headers : headers})
.then(response => response.json())
.then(jsonResponse => userId = jsonResponse.id)
.then( () => {
   fetch (`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method : 'POST',
    headers : headers,
    body : JSON.stringify( {name : playlistName})
  })
  .then(response => response.json())
  .then(jsonResponse => playlistId = jsonResponse.id)
  .then( () => {
        fetch (`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          method : 'POST',
          headers : headers,
          body : JSON.stringify( {uris : uriArray})
      });
    })
  })
}

};

export default Spotify;
