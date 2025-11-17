import { useState, type FC, type ReactNode } from "react";

import "./modal.css";

interface AccordionProps {
  children: ReactNode;
}

export const Accordion: FC<AccordionProps> = (props) => {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="accordion">
        <button
          className="accordion-header"
          onClick={() => setIsOpen((pev) => !pev)}
        >
          {isOpen ? "−" : "+"}
        </button>

        <div className={`accordion-content ${isOpen ? "open" : ""}`}>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
