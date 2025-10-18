import { useEffect, useRef, useState } from "react";
import "./modal.css";

export default function ModalView() {
    const modalRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!dragging) return;
        setPosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y
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
            className="react-extension-modal"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <div className="react-extension-modal-header" onMouseDown={onMouseDown}>
                <strong>ドラッグで移動</strong>
            </div>
            <div className="react-extension-modal-content">
                <p>これはReactモーダルです。下のDOMは操作可能です。</p>
            </div>
        </div>
    );
}