import React from 'react';

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
        
    }));
  }

  render() {
    return (
        <button onClick={this.handleClick}>
        </button>   
    );
  }
}

class Canvas extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
    }

    isPainting = false;
    userStrokeStyle = '#FFC0CB';
    line = [];
    prevPos = { offsetX: 0, offsetY: 0 };

    onMouseDown({ nativeEvent }) 
    {
        const { offsetX, offsetY } = nativeEvent;
        this.isPainting = true;
        this.prevPos = { offsetX, offsetY };
    }

    onMouseMove({ nativeEvent }) 
    {
        if (this.isPainting) {
        const { offsetX, offsetY } = nativeEvent;
        const offSetData = { offsetX, offsetY };
        // Set the start and stop position of the paint event.
        const positionData = 
                {
                    start: { ...this.prevPos },
                    stop: { ...offSetData },
                };
        // Add the position to the line array
        this.line = this.line.concat(positionData);
        this.paint(this.prevPos, offSetData, this.userStrokeStyle);
        }
    }

    endPaintEvent() 
    {
        if (this.isPainting) 
        {
          this.isPainting = false;
        }
      }

    paint(prevPos, currPos, strokeStyle) 
    {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeStyle;
        // Move the the prevPosition of the mouse
        this.ctx.moveTo(x, y);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        this.prevPos = { offsetX, offsetY };
    }

    //function called whenever the component mounted
    componentDidMount() 
    {
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
      }

    render() 
    {
        return (
          <canvas
          // We use the ref attribute to get direct access to the canvas element. 
            ref={(ref) => (this.canvas = ref)}
            style={{ background: '#F0F0F0' }}
            onMouseDown={this.onMouseDown}
            onMouseLeave={this.endPaintEvent}
            onMouseUp={this.endPaintEvent}
            onMouseMove={this.onMouseMove}
          />
        );
      }
      
}

export default Canvas;
