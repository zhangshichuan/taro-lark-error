import { request } from './base'

import type { IPagination } from './index.type'

export interface IApprove {
	ccList: number[]
	approval: 'WITHDRAW' | 'PASS' | 'REJECT'
	approvalComments: string
	taskId: string
	templateId: 'normal' | 'WITHDRAW'
	templateData: string
	processInstanceId: string
}

export interface IPageTaskListOneItem {
	activityName: string
	assignee: string
	authenticatedUser: string
	authenticatedUserName: string
	companyNames: string
	createTime: string
	currentProcessAssignee: string
	currentProcessAssigneeUserName: string
	customerName: string
	endTime: string
	eventNumber: string
	mediaNames: string
	note: string
	originData: string
	plateNames: string
	processDefinitionKey: string
	processDefinitionName: string
	processInstanceId: string
	processInstanceName: string
	state: string
	taskDefinitionKey: string
	taskId: string
	currentTaskIds: string[]
	urgent: boolean
	templateId: string
	notifyTime: string
	companyShortNames: string
}

export interface IWorkflowDetail {
	endFlag: boolean
	formData: string
	id: string
	nodeList: {
		createdDate: string
		nodeName: string
		taskList: IWorkflowDetailTask[]
	}[]
	originData: string
	processDefinitionKey: string
	processDefinitionName: string
	redoFlag: boolean
	todoNode: {
		createdDate: string
		nodeName: string
		taskList: IWorkflowDetailTask[]
	}
	withdrawFlag: boolean
}

export interface IWorkflowDetailTask {
	assignee: string
	assigneeName: string
	assigneeAvatar: string
	ccList: []
	ccListName: []
	commentList: {
		message: string
		time: string
	}[]
	createTime: string
	endTime: string
	state: string
	taskDefinitionKey: string
	taskId: string
	taskName: string
	templateId: string
}

export type TaskStatistical = {
	todayDoneTaskNum: number
	todoTaskNum: number
	withinTimeLimitTaskNum: number
}

// 获取今日待办和已办数量
export function getTaskStatistical() {
	return request<TaskStatistical>({
		url: '/workflow/workflow/task/statistical',
		method: 'POST',
	})
}

// 获取待办事项具体数据列表
export function getTodoList(pageNum: number = 1) {
	return request<IPagination<IPageTaskListOneItem[]>>({
		url: '/workflow/workflow/page_tasks',
		method: 'POST',
		data: {
			pageNum,
			pageSize: 10,
		},
	})
}

// 获取已办事项具体数据列表
export function getDoneList(pageNum: number = 1) {
	return request<IPagination<IPageTaskListOneItem[]>>({
		url: '/workflow/workflow/page_tasks_done',
		method: 'POST',
		data: {
			pageNum,
			pageSize: 10,
		},
	})
}

// 获取抄送我事项具体数据列表
export function getCCList(pageNum: number = 1) {
	return request<IPagination<IPageTaskListOneItem[]>>({
		url: '/workflow/workflow/page_task_cc',
		method: 'POST',
		data: {
			pageNum,
			pageSize: 10,
		},
	})
}

// 获取已发起事项具体数据列表
export function getInitiatedList(pageNum: number = 1) {
	return request<IPagination<IPageTaskListOneItem[]>>({
		url: '/workflow/workflow/page_task_initiated',
		method: 'POST',
		data: {
			pageNum,
			pageSize: 10,
		},
	})
}

// 获取流程详情信息
export function getWorkflowDetail(id: string) {
	return request<IWorkflowDetail>({
		url: '/workflow/workflow/detail',
		method: 'GET',
		data: { id },
		loading: true,
	})
}

// 通用审批
export function generalApprove(data: IApprove) {
	return request({
		url: '/workflow/process/approve',
		method: 'POST',
		data,
		loading: true,
	})
}
