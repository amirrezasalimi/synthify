import { useStore } from "zustand";
import { useProjectStore } from "../stores/project-context";

const useDoc = () => {
    const store = useProjectStore();
    const { ydoc } = useStore(store);
    return ydoc;
}

export default useDoc;