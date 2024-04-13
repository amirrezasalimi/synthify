import useProject from "@/modules/project/hooks/project";
import { useLayoutEffect } from "react";
import { useLocalStorage } from "react-use";
import { Viewport, useOnViewportChange, useReactFlow } from "reactflow";
const ViewportSaver = () => {
  const project = useProject();
  const [viewport, setViewport] = useLocalStorage<Viewport | null>(
    `viewport-${project.id}`,
    null
  );

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
    }else{
      setTimeout(() => {
        rfl.fitView({
          maxZoom: 1,
          duration: 500,
        });
      }, 100);
    }
  }, [viewport, rfl]);
  return null;
};

export default ViewportSaver;
