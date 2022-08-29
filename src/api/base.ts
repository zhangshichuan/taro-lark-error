/* eslint-disable @typescript-eslint/no-unused-vars */
import Taro from '@tarojs/taro'
import { login } from './user'

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://xxx' : 'http://xxx'

interface ICodeMessage {
	[key: number]: string
}
const codeMessage: ICodeMessage = {
	400: '发出的请求有错误, 服务器没有进行新建或修改数据的操作',
	401: '用户没有权限 (令牌 / 用户名 / 密码错误)',
	403: '用户得到授权, 但是访问是被禁止的',
	404: '发出的请求针对的是不存在的记录, 服务器没有进行操作',
	406: '请求的格式不可得',
	410: '请求的资源被永久删除, 且不会再得到的',
	422: '当创建一个对象时, 发生一个验证错误',
	500: '服务器发生错误, 请检查服务器',
	502: '网关错误',
	503: '服务不可用, 服务器暂时过载或维护',
	504: '网关超时',
}

export interface IRequestParams {
	url: string
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	header?: {
		[key: string]: string
	}
	data?: any
	loading?: boolean
}

export interface IResponseData<T = any> {
	header: {
		hasContent: boolean
		receiveTime: string
		receiveTimeString: string
		responseTime: string
		responseTimeString: string
		returnCode: number
		transactionNo: string
	}
	error: {
		code: number
		message: string
	}
	content: T
	error_description?: string
}

async function request<T>(config: IRequestParams) {
	config?.loading &&
		Taro.showLoading({
			title: '正在处理',
			mask: true,
		})

	return await Taro.request<IResponseData<T>>({
		header: {
			'api-version': '1.0',
			Authorization: Taro.getStorageSync('accessToken')
				? `Bearer ${Taro.getStorageSync('accessToken')}`
				: 'Basic d2ViLWNsaWVudDpUVFNTT0RtQUJwRVNCTUZSYXpPb0ZwdEhFa2FsV3loVw==',
			path:
				config.url?.split('/')[1] === 'workflow'
					? '/Dashboard'
					: config.url?.split('/')[1] === 'member'
					? '/PersonalCenter/Settings'
					: '',
			...config.header,
		},
		...{
			...config,
			url: `${baseUrl}${config.url}`,
		},
	})
		.then((res) => {
			config?.loading && Taro.hideLoading()
			return res
		})
		.then((res) => {
			const code = res.data?.header?.returnCode
			if (res.data.header && 0 === code) {
				return res
			} else if (code === 9999) {
				Taro.showLoading({
					title: '重新登录中',
					mask: true,
				})
				Taro.removeStorageSync('accessToken')
				return login().then((loginRes) => {
					if (loginRes) {
						Taro.hideLoading()
						Taro.setStorageSync('accessToken', loginRes.data.content.access_token)
						return request(config)
					}
				})
			} else {
				Taro.showToast({
					title:
						res.statusCode === 200 ? res.data?.error?.message : `${res.statusCode}: ${codeMessage[res.statusCode]}`,
					duration: 5000,
					icon: 'error',
				})
			}
		})
		.catch((reason) => {
			Taro.showToast({
				title: reason?.errMsg,
				duration: 10000,
				icon: 'error',
			})
		})
}

export { request }
