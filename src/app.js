import React from 'react';
import Canvas from './canvas';
import Hello from './hello'
import './canvas.css'

class App extends React.Component 
{
    render() 
    {
        return (
          <React.Fragment>
                <Hello />
                <Canvas />
          </React.Fragment>
        
    );
    }
}

export default App;
