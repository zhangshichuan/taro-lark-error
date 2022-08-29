/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent-props */
import Taro, { useDidShow } from '@tarojs/taro'
import React, { useEffect } from 'react'
import 'taro-ui/dist/style/index.scss'
import { getUserInfo, login } from './api/user'
import './app.scss'
import { useUserStore } from './store'

function App(props: any) {
	const { children } = props

	const saveAccessToken = useUserStore((state: any) => state.saveAccessToken)
	const saveUserInfo = useUserStore((state: any) => state.saveUserInfo)
	const accessToken = useUserStore((state: any) => state.accessToken)

	useEffect(() => {
		accessToken
			? getUserInfoAsync()
			: login().then((res) => {
					if (res) {
						saveAccessToken(res.data.content.access_token)
						getUserInfoAsync()
					}
			  })
	}, [accessToken])

	// 获取用户个人信息
	function getUserInfoAsync() {
		getUserInfo().then((res) => {
			saveUserInfo(res?.data.content)
		})
	}

	return <div>{children}</div>
}

export default App
