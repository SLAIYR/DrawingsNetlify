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
            <script type="text/javascript"
	               src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js"></script>
            <script type="text/javascript" src="App.js"></script>
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript" src="jquery_plantuml.js"></script>
            <script src="go-debug.js"></script>
            <script src="logic.js"></script>
            <script src="sequence.js"></script>
            <script src="class.js"></script>
            <script src="simulink.js"></script>
                <Hello />
                <Canvas />
          </React.Fragment>
        
    );
    }
}

export default App;
