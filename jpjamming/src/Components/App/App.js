import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

Spotify.getAccessToken();

class App extends Component {

constructor (props){
  super(props);

  this.state = {  searchResults : [],
                  playlistName : 'New playlist',
                  playlistTracks : [],
                  isRemoval : true,
                  onSave : true
  };

  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);

}

search(searchTerm)
{
  Spotify.search(searchTerm)
  .then(searchResults => {
    this.setState({searchResults : searchResults});
  })
}

savePlaylist()
{
  const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
  Spotify.savePlaylist(this.state.playlistName, trackUris);

  this.setState({
    playlistTracks: [],
    playlistName : this.updatePlaylistName('New playlist')
  });

}

updatePlaylistName(name)
{
  this.setState({
      playlistName : name
    })
}

addTrack(track)
{
  if (this.state.playlistTracks.find(currentSong => currentSong.id === track.id))
    return;

  this.state.playlistTracks.push(track);

  this.setState ({
    playlistTracks :   this.state.playlistTracks
  })

};

removeTrack(track)
{
  if (this.state.playlistTracks.find(currentSong => currentSong.id === track.id))
  {
    this.state.playlistTracks.splice(this.state.playlistTracks.indexOf(track),1);
    //  console.log(track.name);

    this.setState ({
      playlistTracks : this.state.playlistTracks
  })
//  console.log(this.state.playlistTracks);
}
}

render() {
  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
      <SearchBar onSearch = {this.search}/>
        <div className="App-playlist">
          <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack} />
          <Playlist name = {this.state.playlistName} playlistTracks = {this.state.playlistTracks} onRemove = {this.removeTrack} isRemoval = {this.state.isRemoval}
          onNameChange = {this.updatePlaylistName} onSave= {this.savePlaylist}/>
        </div>
      </div>
    </div>
  );
}
}

export default App;
