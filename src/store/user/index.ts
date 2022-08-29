import Taro from '@tarojs/taro'
import create from 'zustand'

const useUserStore = create((set) => ({
	accessToken: Taro.getStorageSync('accessToken') || '',
	userInfo: Taro.getStorageSync('userInfo') || null,

	// 保存用户的 token
	saveAccessToken: (accessToken: string) =>
		set(() => {
			Taro.setStorageSync('accessToken', accessToken)
			return { accessToken }
		}),

	// 保存用户的个人信息
	saveUserInfo: (userInfo: any) =>
		set(() => {
			Taro.setStorageSync('userInfo', userInfo)
			return { userInfo }
		}),
}))

export { useUserStore }
