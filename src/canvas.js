import React from 'react';



class Canvas extends React.Component 
{
    
    constructor(props) 
    {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.layerNumber = 0;
        
        /*this.state = {
          isReset: props.value
        };*/
        
    }
    
          
    erase() 
    {
        var destinationCanvas = document.getElementById("userLayer")
        var destCtx = destinationCanvas.getContext('2d'); 
        
        destCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    export() 
    {
        var destinationCanvas = document.getElementById("userLayer")
        var destCtx = destinationCanvas.getContext('2d'); 
        
        var image = destinationCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        var link = document.createElement('a');
        link.download = "image.png";
        link.href = image;
        link.click();
    }
    
    
    newStroke() 
    {
            var image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            var link = document.createElement('a');
            link.download = "image.png";
            link.href = image;
            //alert(image)
        
            var img = document.createElement('img');
            img.src = image;

            var destinationCanvas = document.getElementById("userLayer")
            var destCtx = destinationCanvas.getContext('2d');
            destCtx.drawImage(this.canvas, 0, 0);
        
            //document.getElementById('container').appendChild(img);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            link.click();
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
        if (this.isPainting) 
        {
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
            
            this.newStroke();
            
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
        this.canvas.width = 1100;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;

    }

    render() 
    {
        return (
            
        <React.Fragment>
            <button onClick={() => this.export()} > Exporter</button>   
            <button onClick={() => this.erase()} > Tout effacer </button>
            <br/>
            
            <div id ="canvasesdiv" class="relative">
                <div id = "canvases" class="absolute">
                    <canvas
                        id = "userLayer"
                        style={{zIndex:'0'},{position:'absolute'}, {left:'0'}, {top:'0'}, {background: '#E4F4FB'}}
                        height ="500" width = "1100"
                    />
                            
                    <canvas
                        id = "cleanLayer"
                        ref={(ref) => (this.canvas = ref)}
                        style={{zIndex:'1'},{position:'absolute'}, {left:'0'}, {top:'0'}, {background: 'transparent'}}
                        onMouseDown={this.onMouseDown}
                        onMouseLeave={this.endPaintEvent}
                        onMouseUp={this.endPaintEvent}
                        onMouseMove={this.onMouseMove}
                    />
                </div>
                    
            </div>

            

        </React.Fragment>
        );
      }
      
}

export default Canvas;
