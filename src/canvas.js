import React from 'react';
import GojsDiagram from 'react-gojs';
import ReactJson from 'react-json-view';
import ClassBanner from './resources/class.png';

import go from 'gojs';
const goObj = go.GraphObject.make;

class Canvas extends React.Component 
{
    isPainting = false;
    layerNo = 0;

    //contains all single strokes layers drawn until now
    canvasList = [];

    shapeCanvasList = [];
    textCanvasList = [];
    
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
        var textbutton = document.getElementById('text-button');
        textbutton.style.backgroundColor = "#E5DFFF";
        
        var shapebutton = document.getElementById('shape-button');
        shapebutton.style.backgroundColor = "transparent ";
    }

    setModeShape()
    {
        this.setState({drawingMode: "shape"});
        var shapebutton = document.getElementById('shape-button');
        shapebutton.style.backgroundColor = "#E5DFFF";
        
        var textbutton = document.getElementById('text-button');
        textbutton.style.backgroundColor = "transparent";
    }

          
    erase() 
    {
        //clear the complete drawing canvas
        var destinationCanvas = document.getElementById("completeDrawingLayer")
        var destCtx = destinationCanvas.getContext('2d'); 
        destCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        //clear the single stroke canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for(var i = 1; i <= this.canvasList.length; i++)
        {
            var node = document.getElementById("thumbnail"+i);
            document.getElementById('historique').removeChild(node);
        }
        
        this.layerNo = 0;
        this.canvasList = [];
        this.shapeCanvasList = [];
        this.textCanvasList = [];
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
        divThumbnail.setAttribute('id', 'thumbnail'+this.layerNo);
        divThumbnail.setAttribute('class', 'divThumbnail');
        divThumbnail.appendChild(img);
        divThumbnail.appendChild(drawingMode);

        document.getElementById('historique').appendChild(divThumbnail);
        
        //create new canvas on canvasList
        var tempcanvas = document.createElement('canvas');
        tempcanvas.setAttribute('id', "canvas"+this.layerNo);
        tempcanvas.setAttribute('width', this.canvas.width);
        tempcanvas.setAttribute('height', this.canvas.height);
        tempcanvas.setAttribute("layerType", this.state.drawingMode);
        tempcanvas.setAttribute("modelType", "class");
        
        if (this.state.drawingMode === 'shape')
        {
            this.shapeCanvasList.push(tempcanvas);
        }
        else if (this.state.drawingMode === 'text')
        {
            this.textCanvasList.push(tempcanvas);
        }
        
        this.canvasList.push(tempcanvas);
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
        
        this.setModeShape();
    }

    postPictureEngineV2()
    {
        var xhr = new XMLHttpRequest();
        var url = "localhost:8888/postPictureEngineV2";
        xhr.onreadystatechange = function() 
        {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) // 200 quand on sera en NETWORK
            {		
                var engineDiv = document.getElementById("engineDiv");
                var paraph = document.createElement("p");
                var response = xhr.responseText.split("%split%");
                paraph.innerHTML=response[0];
                var shouldILoop=0;
                var diagramDiv = document.getElementById("myDiagramDiv");

                if(go.Diagram.fromDiv(diagramDiv)!=null)
                {
                    go.Diagram.fromDiv(diagramDiv).div = null;
                }

                ReactJson.initClass(response[1]);		// the loadFromJSON is made in initClass
                    //loadFromJSONClass(response[1]);
            }
                //engineDiv.appendChild(paraph);
                engineDiv.insertBefore(paraph,engineDiv.firstChild);
		}
	

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        /*var canvasList = this.layerTab;
        var shapeCanvasList = new Array();
        var textCanvasList = new Array();
        for(var i=0;i<canvasList.length;i++)
        {
            if(canvasList[i].getAttribute("layerType")=="shape")
            {
                shapeCanvasList.push(canvasList[i]);
            }
            if(canvasList[i].getAttribute("layerType")=="text")
            {
                textCanvasList.push(canvasList[i]);
            }
        }
        
        var request = "engineModel=class";
        request += "&shapeLayersSize="+shapeCanvasList.length;
        request += "&textLayersSize="+textCanvasList.length;
        var sizeShapeCanvasList = shapeCanvasList.length;
        for(var i=0;i<sizeShapeCanvasList;i++)
        {
            var uri = saveCanvas(shapeCanvasList[i]);
            var bbox = getBoundingBox(shapeCanvasList[i]);
            request+="&uri"+i+"="+uri+"&x"+i+"="+bbox[0]+"&y"+i+"="+bbox[1]+"&w"+i+"="+bbox[2]+"&h"+i+"="+bbox[3];
        }
        
        for(var i=0;i<textCanvasList.length;i++)
        {
            var uri = saveCanvas(textCanvasList[i]);
            var bbox = getBoundingBox(textCanvasList[i]);
            request+="&uri"+(i+sizeShapeCanvasList)+"="+uri+"&x"+(i+sizeShapeCanvasList)+"="+bbox[0]+"&y"+(i+sizeShapeCanvasList)+"="+bbox[1]+"&w"+(i+sizeShapeCanvasList)+"="+bbox[2]+"&h"+(i+sizeShapeCanvasList)+"="+bbox[3];
        }*/
    
        //xhr.send(request);
    }

    saveCanvas(tempcanvas)
    {
        return tempcanvas.toDataURL("image/jpeg");
    }

    render() 
    {
        return (
            
        <React.Fragment>

            <div id="bannerModel">
		          <img id="banner" src={ClassBanner} alt="bannière de classe"/>
	       </div>
            
            <div id="buttonsdiv">
            
                <div id = "actions" class = "actions">
                    <div class="inner">
                        <button onClick={() => this.export()}  class="button"> Export</button>
                    </div>   
                    <div class="inner">
                        <button onClick={() => this.erase()}  class="button"> Clear all </button>
                    </div>
                </div>

                <div id = "modes" class = "modes">
                    <div class="inner">
                        <button onClick={() => this.setModeText()} id = "text-button" class="button"> Text</button>
                    </div>
                    <div class="inner">
                        <button onClick={() => this.setModeShape()} id = "shape-button" class="button"> Shape</button>
                    </div>
                </div>

            </div>

            <div id = "mainDiv">
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
                        
                <div id="analyseDiv">
                    <div id="myDiagramDiv"></div>
                    <div id="engineDiv"></div>
                </div>
                        
                <div id ="historique" class="container">
                </div>

            </div>
        </React.Fragment>
        );
      }
      
}

export default Canvas;
