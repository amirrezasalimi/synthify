import { pb } from "@/libs/pb";
import presets from "@/data/presets.json";
const importPresets = async () => {
  try{
    presets.forEach(async (preset) => {
      const oldPresets = await pb.collection("presets").getFullList();
      const exists = oldPresets.find(
        (oldPreset) =>
          oldPreset.title === preset.title &&
          oldPreset.category === preset.category
      );
      if (!exists) {
        await pb.collection("presets").create(preset);
        console.log(`Preset Imported : ${preset.title}`);
      } 
    });
  } catch (e) {
    console.error(e);
  }
};

export default importPresets;
