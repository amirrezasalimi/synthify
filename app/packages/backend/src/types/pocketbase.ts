/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	AiUsages = "ai_usages",
	Config = "config",
	Datas = "datas",
	ExternalUsers = "external_users",
	Presets = "presets",
	Projects = "projects",
	TaskLogs = "task_logs",
	Tasks = "tasks",
	UserAi = "user_ai",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AiUsagesRecord<Tusages = unknown> = {
	ai_service?: RecordIdString
	cost?: number
	entity_id?: string
	entity_type?: string
	model_id?: string
	project?: RecordIdString
	service_name?: string
	usages?: null | Tusages
	user?: RecordIdString
}

export type ConfigRecord = {
	key?: string
	value?: string
}

export enum DatasStatusOptions {
	"done" = "done",
	"in-progress" = "in-progress",
	"error" = "error",
}
export type DatasRecord<Tdata = unknown, Tmeta = unknown> = {
	data?: null | Tdata
	error?: string
	meta?: null | Tmeta
	status?: DatasStatusOptions
	task?: RecordIdString
	user?: RecordIdString
}

export type ExternalUsersRecord = {
	external_user_id?: string
	pass_key?: string
	referral?: string
	user?: RecordIdString
}

export enum PresetsCategoryOptions {
	"Question Answer" = "Question Answer",
	"Function Calling" = "Function Calling",
}
export type PresetsRecord<Tdata = unknown> = {
	category?: PresetsCategoryOptions
	data?: null | Tdata
	title?: string
}

export type ProjectsRecord<Tjson_data = unknown> = {
	data?: string
	json_data?: null | Tjson_data
	title?: string
	user?: RecordIdString
}

export type TaskLogsRecord<Tmeta = unknown> = {
	message?: string
	meta?: null | Tmeta
	task_id?: RecordIdString
	type?: string
}

export enum TasksStatusOptions {
	"in-progress" = "in-progress",
	"done" = "done",
	"error" = "error",
}
export type TasksRecord<Tflows = unknown, Tmeta = unknown> = {
	count?: number
	flows?: null | Tflows
	meta?: null | Tmeta
	project?: RecordIdString
	status?: TasksStatusOptions
	title?: string
	user?: RecordIdString
}

export enum UserAiAddByOptions {
	"system" = "system",
	"user" = "user",
}
export type UserAiRecord<Tmodels = unknown> = {
	add_by?: UserAiAddByOptions
	api_key?: string
	endpoint?: string
	models?: null | Tmodels
	oai_schema?: boolean
	title?: string
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	external?: boolean
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AiUsagesResponse<Tusages = unknown, Texpand = unknown> = Required<AiUsagesRecord<Tusages>> & BaseSystemFields<Texpand>
export type ConfigResponse<Texpand = unknown> = Required<ConfigRecord> & BaseSystemFields<Texpand>
export type DatasResponse<Tdata = unknown, Tmeta = unknown, Texpand = unknown> = Required<DatasRecord<Tdata, Tmeta>> & BaseSystemFields<Texpand>
export type ExternalUsersResponse<Texpand = unknown> = Required<ExternalUsersRecord> & BaseSystemFields<Texpand>
export type PresetsResponse<Tdata = unknown, Texpand = unknown> = Required<PresetsRecord<Tdata>> & BaseSystemFields<Texpand>
export type ProjectsResponse<Tjson_data = unknown, Texpand = unknown> = Required<ProjectsRecord<Tjson_data>> & BaseSystemFields<Texpand>
export type TaskLogsResponse<Tmeta = unknown, Texpand = unknown> = Required<TaskLogsRecord<Tmeta>> & BaseSystemFields<Texpand>
export type TasksResponse<Tflows = unknown, Tmeta = unknown, Texpand = unknown> = Required<TasksRecord<Tflows, Tmeta>> & BaseSystemFields<Texpand>
export type UserAiResponse<Tmodels = unknown, Texpand = unknown> = Required<UserAiRecord<Tmodels>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	ai_usages: AiUsagesRecord
	config: ConfigRecord
	datas: DatasRecord
	external_users: ExternalUsersRecord
	presets: PresetsRecord
	projects: ProjectsRecord
	task_logs: TaskLogsRecord
	tasks: TasksRecord
	user_ai: UserAiRecord
	users: UsersRecord
}

export type CollectionResponses = {
	ai_usages: AiUsagesResponse
	config: ConfigResponse
	datas: DatasResponse
	external_users: ExternalUsersResponse
	presets: PresetsResponse
	projects: ProjectsResponse
	task_logs: TaskLogsResponse
	tasks: TasksResponse
	user_ai: UserAiResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'ai_usages'): RecordService<AiUsagesResponse>
	collection(idOrName: 'config'): RecordService<ConfigResponse>
	collection(idOrName: 'datas'): RecordService<DatasResponse>
	collection(idOrName: 'external_users'): RecordService<ExternalUsersResponse>
	collection(idOrName: 'presets'): RecordService<PresetsResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
	collection(idOrName: 'task_logs'): RecordService<TaskLogsResponse>
	collection(idOrName: 'tasks'): RecordService<TasksResponse>
	collection(idOrName: 'user_ai'): RecordService<UserAiResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
