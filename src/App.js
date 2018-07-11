import React, { Component } from 'react';
import Image from './components/Image';
import Zoom from './components/Zoom';
import ImageZoom from './module/ImageZoom';

import './App.css';

class App extends Component {
  componentDidMount() {
    new ImageZoom();
  }

  render() {
    return (
      <main className="App">
        <Image image="demo.jpg"/>
        <Zoom />
      </main>
    );
  }
}

export default App;
