import { type FC } from "react";

import "./modal.css";

interface SliderProps {
  min: string;
  max: string;
  step: number;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  label?: string;
}

export const Slider: FC<SliderProps> = (props) => {
  const { min, max, step, value, setValue, label } = props;

  return (
    <div className="slider-main">
      <div className="slider-container">
        <div className="slider-label">
          {label}: {value / 10}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="slider"
        />
        <div className="slider-btn-group">
          <button
            className="slider-btn"
            onClick={() => setValue((v) => Math.max(v - step, 0))}
          >
            {"<"}
          </button>
          <button
            className="slider-btn"
            onClick={() => setValue((v) => Math.min(v + step, 100))}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};
