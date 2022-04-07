import { Popover, Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ onColorChange }) => {
  const [anchorElement, setAnchorElement] = useState(null);
  const [color, setColor] = useState("black");

  useEffect(() => {
  }, [color]);

  return (
    <div>
      <Button
        aria-label="Choose Colour"
        variant="contained"
        onClick={(event) => {
          setAnchorElement(anchorElement ? null : event.currentTarget);
        }}
        endIcon={<CircleIcon sx={{ color: color }} />}
      >
        Colour
      </Button>

      <Popover
        onClose={() => {
          setAnchorElement(null);
        }}
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <SketchPicker
          color={color ? color : "black"}
          onChange={(newColor) => {
            onColorChange(newColor.hex);
            setColor(newColor.hex);
          }}
        />
      </Popover>
    </div>
  );
};

export default ColorPicker;
