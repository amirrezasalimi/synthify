import toast from "react-hot-toast";
import { flowColors } from "../data/colors";
import { FlowBlock, FlowData } from "../types/flow-data";
import useDoc from "./doc";
import useSyncedState from "./synced-state";

const useDataImporter = () => {
  const state = useSyncedState();
  const doc = useDoc();
  const importData = async (schema: string) => {
    try {
      // Clean the schema string: remove markdown fences if present.
      let cleaned = schema.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "");
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(cleaned);

      // Support both an object with "flows" or an array of flows.
      let flows: Record<string, any>;
      if (Array.isArray(parsed)) {
        flows = {};
        parsed.forEach((flow) => {
          if (flow.name) flows[flow.name] = flow;
        });
      } else if (parsed.flows) {
        flows = parsed.flows;
      } else {
        flows = parsed;
      }

      doc.transact(() => {
        // Remove old nodes.
        Object.keys(state.nodes).forEach((key) => delete state.nodes[key]);
        let x = 100,
          y = 100;
        for (const key in flows) {
          const flow = flows[key] as {
            blocks: FlowBlock[];
          };
          state.nodes[key] = {
            id: key,
            type: "flow",
            data: {
              name: key,
              id: key,
              blocks: flow.blocks,
              color: flowColors[Math.floor(Math.random() * flowColors.length)],
            } as FlowData,
            position: { x, y },
          };
          x = 500;
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Invalid JSON");
    }
  };

  return {
    importData,
  };
};

export default useDataImporter;
