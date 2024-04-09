/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Datas = "datas",
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
	user?: RecordIdString
}

export type TasksRecord<Tflows = unknown, Tmeta = unknown> = {
	count?: number
	flows?: null | Tflows
	meta?: null | Tmeta
	status?: string
	user?: RecordIdString
}

export type UserAiRecord<Tmodels = unknown> = {
	api_key?: string
	endpoint?: string
	models?: null | Tmodels
	oai_schema?: boolean
	title?: string
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type DatasResponse<Tdata = unknown, Tmeta = unknown, Texpand = unknown> = Required<DatasRecord<Tdata, Tmeta>> & BaseSystemFields<Texpand>
export type TasksResponse<Tflows = unknown, Tmeta = unknown, Texpand = unknown> = Required<TasksRecord<Tflows, Tmeta>> & BaseSystemFields<Texpand>
export type UserAiResponse<Tmodels = unknown, Texpand = unknown> = Required<UserAiRecord<Tmodels>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	datas: DatasRecord
	tasks: TasksRecord
	user_ai: UserAiRecord
	users: UsersRecord
}

export type CollectionResponses = {
	datas: DatasResponse
	tasks: TasksResponse
	user_ai: UserAiResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'datas'): RecordService<DatasResponse>
	collection(idOrName: 'tasks'): RecordService<TasksResponse>
	collection(idOrName: 'user_ai'): RecordService<UserAiResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
