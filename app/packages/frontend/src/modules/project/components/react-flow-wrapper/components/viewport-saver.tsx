import { useLayoutEffect } from "react";
import { useLocalStorage } from "react-use";
import { Viewport, useOnViewportChange, useReactFlow } from "reactflow";
const ViewportSaver = () => {
  const [viewport, setViewport] = useLocalStorage<Viewport | null>("viewport");

  useOnViewportChange({
    onEnd: (viewport: Viewport) => {
      setViewport(viewport);
    },
  });

  const rfl = useReactFlow();
  useLayoutEffect(() => {
    if (viewport) {
      rfl.setViewport({
        x: viewport.x,
        y: viewport.y,
        zoom: viewport.zoom,
      });
    }
  }, [viewport, rfl]);
  return null;
};

export default ViewportSaver;
