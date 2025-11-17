import { type FC } from "react";

import "./modal.css";

interface SliderProps {
  min: string;
  max: string;
  step: string;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export const Slider: FC<SliderProps> = (props) => {
  const { min, max, step, value, setValue } = props;

  return (
    <div className="volume-container">
      <div className="volume-label">Volume: {value}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="volume-slider"
      />
    </div>
  );
};
