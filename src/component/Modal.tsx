import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import "./modal.css";

interface ModalType {
  children: ReactNode;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal: FC<ModalType> = (props: any) => {
  const { children, setVisible } = props;

  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={modalRef}
      className="modal"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="modal-header" onMouseDown={onMouseDown}></div>
      <div className="modal-content">
        <button className="close-btn" onClick={() => setVisible(false)}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
