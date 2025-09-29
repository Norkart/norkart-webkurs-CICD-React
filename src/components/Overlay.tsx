import type { PropsWithChildren, CSSProperties } from "react";

export function Overlay({
  children,
  style,
}: PropsWithChildren & { style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "20px",
        width: "fit-content",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
