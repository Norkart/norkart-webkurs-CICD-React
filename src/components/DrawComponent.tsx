import { useTerraDrawControl } from "../hooks/useTerraDrawControl";

function DrawComponent() {
  useTerraDrawControl({
    modes: [
      "point",
      "linestring",
      "polygon",
      "rectangle",
      "circle",
      "select",
      "delete-selection",
      "delete",
    ],
    open: true,
    position: "bottom-left",
  });

  // No UI needed - the hook adds controls directly to the map
  return null;
}

export default DrawComponent;
