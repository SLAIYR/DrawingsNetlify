import React from 'react';
import Canvas from './canvas';
import Hello from './hello'

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
