import { useState, type FC, type ReactNode } from "react";
import "./modal.css";

interface AccordionProps {
  children: ReactNode;
}

export const Accordion: FC<AccordionProps> = (props) => {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      {/* 境界線としての役割を持つヘッダー */}
      <div
        className={`accordion-header-container ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="accordion-title">詳細設定</span>
        <span className="accordion-icon">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* この container の grid-template-rows で開閉を制御します */}
      <div className={`accordion-container ${isOpen ? "open" : ""}`}>
        <div className="accordion-content">
          <div className="accordion-inner">{children}</div>
        </div>
      </div>
    </div>
  );
};
