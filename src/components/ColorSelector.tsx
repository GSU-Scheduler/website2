import React, { useCallback } from "react";
import { useColor } from "./ColorContext";
import debounce from "lodash/debounce";

const presetColors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#E67E22"]; // Example preset colors

const ColorSelector: React.FC = () => {
  const { color, setColor } = useColor();

  // Create a debounced version of the color change handler
  const debouncedSetColor = useCallback(
    debounce((color: string) => setColor(color), 300), // Adjust the delay (300ms) as needed
    [setColor]
  );

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    debouncedSetColor(newColor);
  };

  const handlePresetColorClick = (presetColor: string) => {
    setColor(presetColor);
  };

  return (
    <div className="flex items-center space-x-4 justify-center">
      {/* Color Wheel */}
      <div className="relative w-8 h-8 cursor-pointer rounded border-2 border-gray-300">
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="w-full h-full" style={{ backgroundColor: color }} />
      </div>

      {/* Preset Colors */}
      <div className="flex flex-wrap space-x-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            style={{ backgroundColor: presetColor }}
            className="w-8 h-8 rounded-full border border-gray-400"
            onClick={() => handlePresetColorClick(presetColor)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
