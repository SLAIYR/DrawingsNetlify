import React from 'react';
import Canvas from './canvas';

class App extends React.Component 
{
    render() 
    {
    return (
      <React.Fragment>
        <h1>Draw</h1>
          <Canvas />
      </React.Fragment>
    );
    }
}

export default App;