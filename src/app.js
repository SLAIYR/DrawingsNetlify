import React from 'react';
import Canvas from './canvas';

class App extends React.Component 
{
    render() 
    {
    return (
      <React.Fragment>
        <h1>Draw me something!</h1>
          <Canvas />
      </React.Fragment>
    );
    }
}

export default App;
