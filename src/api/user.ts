import Taro from '@tarojs/taro'
import { request } from './base'
import { IPagination } from './index.type'

export type AccessToken = {
	access_token: string
	expires_in: number
	jti: string
	name: string
	plate_code: string
	refresh_token: string
	scope: string
	token_type: string
	user_id: string | number
}

export interface IUserInfo {
	menus: {
		children: {
			children: any[]
			component: string
			icon: string
			id: number
			name: string
			parentId: number
			path: string
			sort: number
			type: number
		}[]
		component: string
		icon: string
		id: number
		name: string
		parentId: number
		path: string
		sort: number
		type: number
	}[]
	organizations: {
		code: string
		id: number
		leaderEmail: string
		leaderId: number
		leaderName: string
		name: string
		parentId: number
		parentName: string
		plateCode: string
		remark: string
		status: boolean
	}[]
	permissions: []
	plate: {
		code: string
		id: number
		name: string
	}
	roles: {
		code: string
		id: number
		isFixedRole: boolean
		name: string
		remark: string
		supra: boolean
	}[]
	test: string
	user: {
		avatar: string
		deleted: boolean
		email: string
		id: number
		name: string
		phone: string
		username: string
	}
}

export type ICC = {
	name: string
	avatar: string
	id: number
}

// 小程序自动登录
export async function login() {
	const res = await Taro.login()

	if (res.code) {
		return request<AccessToken>({
			url: '/auth/oauth/token',
			data: {
				code: res.code,
				grant_type: 'feishu',
				remember: true,
				scope: 'all',
			},
			method: 'POST',
		})
	}
}

// 切换账号
export async function accountLogin(data: { username: string; password: string }) {
	return request<AccessToken>({
		url: '/auth/oauth/token',
		data: {
			...data,
			grant_type: 'password',
			remember: true,
			scope: 'all',
		},
		method: 'POST',
	})
}

// 修改密码
export async function editPassword(data: { oldPassword: string; newPassword: string }) {
	return request({
		url: '/member/user/password/reset',
		data,
		method: 'PUT',
	})
}

// 获取用户信息
export function getUserInfo() {
	return request<IUserInfo>({
		loading: true,
		url: '/member/user/userInfo',
		method: 'GET',
	})
}

// 获取抄送人列表
export function getCCSelectList(keyword?: string) {
	return request<IPagination<ICC[]>>({
		url: '/member/user/list/select_list',
		data: {
			pageNum: 1,
			pageSize: 100,
			keyword,
		},
		method: 'POST',
	})
}
