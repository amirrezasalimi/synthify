import { FlowData } from "@/modules/project/types/flow-data"

export type BlockSettingKey= keyof FlowData['blocks'][0]['settings']
export type BlockSettingValue= FlowData['blocks'][0]['settings'][keyof FlowData['blocks'][0]['settings']]