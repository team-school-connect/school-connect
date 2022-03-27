import { Box, Toolbar, Button, Slider, Typography } from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import ColorPicker from "./ColorPicker/ColorPicker";
import "./SocketWhiteboard.css";

const SocketWhiteboard = forwardRef(({ onStroke, onClear }, ref) => {
  const [strokeColor, setStrokeColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(5);

  useEffect(() => {}, []);

  return (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <ColorPicker
          onColorChange={(hexColor) => {
            setStrokeColor(hexColor);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            ref.current.eraseMode(false);
          }}
        >
          Draw
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            ref.current.eraseMode(true);
          }}
        >
          Erase
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            ref.current.clearCanvas();
            onClear();
          }}
        >
          Clear
        </Button>
        <Box sx={{ width: "15em" }}>
          <Typography sx={{ color: "white" }}>Pen Size</Typography>
          <Slider
            aria-label="Pen Size"
            valueLabelDisplay="auto"
            defaultValue={5}
            min={1}
            max={100}
            onChange={(e, size) => {
              setStrokeWidth(size);
            }}
          />
        </Box>
        <Box sx={{ width: "15em" }}>
          <Typography sx={{ color: "white" }}>Eraser Size</Typography>
          <Slider
            aria-label="Eraser Size"
            valueLabelDisplay="auto"
            defaultValue={5}
            min={1}
            max={100}
            onChange={(e, size) => {
              setEraserWidth(size);
            }}
          />
        </Box>
      </Toolbar>
      <ReactSketchCanvas
        ref={ref}
        className="whiteboard"
        width="70em"
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
        onStroke={(path, isEraser) => {
          onStroke(path);
        }}
      />
    </Box>
  );
});

export default SocketWhiteboard;
