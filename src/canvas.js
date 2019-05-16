import React from 'react';



class Canvas extends React.Component 
{
    isPainting = false;
    layerNo = 0;

    //contains all single strokes layers drawn until now
    layerTab = [];
    
    userStrokeStyle = '#FFC0CB';
    line = [];
    prevPos = { offsetX: 0, offsetY: 0 };

    

    constructor(props) 
    {
        super(props);
        
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        
        this.state = {drawingMode: "shape"};
        
    }
    
    setModeText()
    {
        this.setState({drawingMode: "text"});
    }

    setModeShape()
    {
        this.setState({drawingMode: "shape"});
    }

          
    erase() 
    {
        //clear the complete drawing canvas
        var destinationCanvas = document.getElementById("completeDrawingLayer")
        var destCtx = destinationCanvas.getContext('2d'); 
        destCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        //clear the single stroke canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }
    
    export() 
    {
        //export complete drawing
        var completeDrawing = document.getElementById("completeDrawingLayer")
        var image = completeDrawing.toDataURL("image/png").replace("image/png", "image/octet-stream");

        //new element a which is a link (href) to the image : permits download
        var link = document.createElement('a');
        link.download = "image.png";
        link.href = image;
        link.click();
    }
    
    
    newSingleStroke() 
    {
        //increase number of layer
        this.layerNo = this.layerNo + 1;

        //draw on complete drawing canvas
        var destinationCanvas = document.getElementById("completeDrawingLayer")
        var destCtx = destinationCanvas.getContext('2d');
        destCtx.drawImage(this.canvas, 0, 0);

        //new image of single stroke
        var canvasStroke = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        var img = document.createElement('img');
        img.src = canvasStroke;
        img.style.width="300px";
        img.style.height="150px";
        
        //attribute 'mode=shape' or 'mode=text'
        img.setAttribute('mode', this.state.drawingMode);
        
        var drawingMode = document.createElement('mode');
        drawingMode.innerHTML = img.getAttribute('mode');
        
        //new div containing image and infos, buttons...
        var divThumbnail = document.createElement('div');
        divThumbnail.setAttribute('id', this.layerNo)
        divThumbnail.appendChild(img);
        divThumbnail.appendChild(drawingMode);
        
    
        //add to container the new image created
        document.getElementById('container').appendChild(img);
        document.getElementById('container').appendChild(drawingMode);

        this.layerTab.push(img);
    }
    
    onMouseDown({ nativeEvent }) 
    {
        //clear the single stroke canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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
            this.newSingleStroke();
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

    componentDidMount() 
    {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
    }

    exportModel()
    {
        var xhr = new XMLHttpRequest();
        var url = "exportModel";
        xhr.onreadystatechange = function() 
        {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) // 200 quand on sera en NETWORK
            {		
                var json=xhr.responseText;
                //prompt("Copy to clipboard: Ctrl+C, Enter",json);

                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
                element.setAttribute('download', "model.json");

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }
        }
    
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        var canvasList = this.layerTab;
        var shapeCanvasList = new Array();
        var textCanvasList = new Array();
        for(var i=0;i<canvasList.length;i++){
            if(canvasList[i].getAttribute("layerType")=="shape"){
                shapeCanvasList.push(canvasList[i]);
            }
            if(canvasList[i].getAttribute("layerType")=="text"){
                textCanvasList.push(canvasList[i]);
            }
        }
        /*var request = "engineModel="+whichEngineModelToUse;
        request += "&shapeLayersSize="+shapeCanvasList.length;
        request += "&textLayersSize="+textCanvasList.length;
        var sizeShapeCanvasList = shapeCanvasList.length;
        for(var i=0;i<sizeShapeCanvasList;i++){
            var uri = saveCanvas(shapeCanvasList[i]);
            var bbox = getBoundingBox(shapeCanvasList[i]);
            request+="&uri"+i+"="+uri+"&x"+i+"="+bbox[0]+"&y"+i+"="+bbox[1]+"&w"+i+"="+bbox[2]+"&h"+i+"="+bbox[3];
        }
        for(var i=0;i<textCanvasList.length;i++){
            var uri = saveCanvas(textCanvasList[i]);
            var bbox = getBoundingBox(textCanvasList[i]);
            request+="&uri"+(i+sizeShapeCanvasList)+"="+uri+"&x"+(i+sizeShapeCanvasList)+"="+bbox[0]+"&y"+(i+sizeShapeCanvasList)+"="+bbox[1]+"&w"+(i+sizeShapeCanvasList)+"="+bbox[2]+"&h"+(i+sizeShapeCanvasList)+"="+bbox[3];
        }*/
    
        //xhr.send(request);
    }

    render() 
    {
        return (
            
        <React.Fragment>

            Mode : <b>{this.state.drawingMode}</b>
            <br/>
            <br/>
            
            <button onClick={() => this.setModeText()} > Text</button>
            <button onClick={() => this.setModeShape()} > Shapes</button>
            <br/>

            <div id = "canvases">
                 <canvas
                     id = "completeDrawingLayer"
                     style={{zIndex:'0'}, {left:'0'}, {top:'0'}, {background: '#E4F4FB'}}
                     height ="500" width = "1000"
                />
                            
                <canvas
                    id = "singleStrokeLayer"
                    ref={(ref) => (this.canvas = ref)}
                    style={{zIndex:'1'}, {left:'0'}, {top:'0'}, {background: 'transparent'}}
                    onMouseDown={this.onMouseDown}
                    onMouseLeave={this.endPaintEvent}
                    onMouseUp={this.endPaintEvent}
                    onMouseMove={this.onMouseMove}
                />
                        
                <div id="buttons">
                    <button onClick={() => this.export()} > Export</button>   
                    <button onClick={() => this.erase()} > Clear all </button>
                </div>
                <div id="container">

                </div>
            </div>

        </React.Fragment>
        );
      }
      
}

export default Canvas;
