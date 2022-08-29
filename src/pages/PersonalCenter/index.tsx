/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useEffect, useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import {
	AtAvatar,
	AtButton,
	AtModal,
	AtModalContent,
	AtModalHeader,
	AtModalAction,
	AtForm,
	AtInput,
	AtMessage,
} from 'taro-ui'
import Taro, { getStorageSync } from '@tarojs/taro'
import md5 from 'blueimp-md5'

import { accountLogin, editPassword, getUserInfo } from '../../api/user'

import styles from './index.module.scss'

import RsAvatar from '../../assets/rs_avatar.jpg'

export default function (props: any) {
	const [editPassOpen, setEditPassOpen] = useState(false)
	const [accountLoginOpen, setAccountLoginOpen] = useState(false)

	const [state, setState] = useState({
		oldPassword: '',
		newPassword: '',
		username: '',
		password: '',
	})

	const [userInfo, setUserInfo] = useState<any>({})

	useEffect(() => {
		setUserInfo(getStorageSync('userInfo'))
	}, [])

	return (
		<View className={styles.PersonalCenter}>
			<AtMessage />
			{/* 头像栏目 */}
			<View className={styles.bg}>
				<View>
					<AtAvatar circle image={userInfo?.user?.avatar || RsAvatar} />
				</View>
				<View style={{ marginTop: 12 }}>
					<Text style={{ color: '#fff' }}>{userInfo?.user?.name}</Text>
				</View>
				<View style={{ color: '#eee', fontSize: 12 }}>
					{userInfo.roles?.map((role) => (
						<Text key={role.id} style={{ color: '#eee', fontSize: 12 }}>
							&nbsp;{role.name}&nbsp;
						</Text>
					))}
				</View>
				<View>
					<Text style={{ color: '#eee', fontSize: 12 }}>{userInfo?.user?.email}</Text>
				</View>
			</View>

			{/* 修改密码 和 单独登录 */}
			<View style={{ padding: 20, marginTop: 20 }}>
				<AtButton
					onClick={() => {
						setEditPassOpen(true)
					}}
					size="small"
					type="primary"
				>
					修改密码
				</AtButton>

				<View style={{ marginTop: 10 }}>
					<AtButton
						onClick={() => {
							setAccountLoginOpen(true)
						}}
						size="small"
						type="secondary"
					>
						切换账号
					</AtButton>
				</View>
			</View>

			<View>
				{/* 修改密码 */}
				<AtModal closeOnClickOverlay={false} isOpened={editPassOpen}>
					<AtModalHeader>修改密码</AtModalHeader>
					<AtModalContent>
						<AtForm>
							<AtInput
								required
								name="oldPassword"
								title="原密码"
								type="text"
								placeholder="请输入原始密码"
								value={state.oldPassword}
								onChange={(value: string) => {
									setState({
										...state,
										oldPassword: value.trim(),
									})
								}}
							/>
							<AtInput
								required
								name="newPassword"
								title="新密码"
								type="text"
								placeholder="请输入新密码"
								value={state.newPassword}
								onChange={(value: string) => {
									setState({
										...state,
										newPassword: value.trim(),
									})
								}}
							/>
						</AtForm>
					</AtModalContent>
					<AtModalAction>
						<Button
							onClick={() => {
								setEditPassOpen(false)
							}}
						>
							取消
						</Button>
						<Button
							onClick={() => {
								if (state.oldPassword && state.newPassword) {
									editPassword({
										oldPassword: md5(state.oldPassword),
										newPassword: md5(state.newPassword),
									}).then((res) => {
										if (res?.data.content) {
											Taro.atMessage({
												message: '修改成功',
												type: 'success',
											})
											setState({
												...state,
												oldPassword: '',
												newPassword: '',
											})
											setEditPassOpen(false)
										}
									})
								} else {
									Taro.atMessage({
										message: '原密码和新密码必填',
										type: 'error',
									})
								}
							}}
						>
							确定
						</Button>
					</AtModalAction>
				</AtModal>

				{/* 切换账号 */}
				<AtModal closeOnClickOverlay={false} isOpened={accountLoginOpen}>
					<AtModalHeader>切换账号</AtModalHeader>
					<AtModalContent>
						<AtForm>
							<AtInput
								required
								name="username"
								title="用户名"
								type="text"
								placeholder="请输入用户名"
								value={state.username}
								onChange={(value: string) => {
									setState({
										...state,
										username: value.trim(),
									})
								}}
							/>
							<AtInput
								required
								name="password"
								title="密码"
								type="password"
								placeholder="请输入密码"
								value={state.password}
								onChange={(value: string) => {
									setState({
										...state,
										password: value.trim(),
									})
								}}
							/>
						</AtForm>
					</AtModalContent>
					<AtModalAction>
						<Button
							onClick={() => {
								setAccountLoginOpen(false)
							}}
						>
							取消
						</Button>
						<Button
							onClick={() => {
								if (state.username && state.password) {
									Taro.clearStorageSync()
									accountLogin({
										username: state.username,
										password: md5(state.password),
									}).then((res) => {
										if (res?.data.content) {
											Taro.atMessage({
												message: '登录成功',
												type: 'success',
											})
											setState({
												...state,
												username: '',
												password: '',
											})
											Taro.setStorageSync('accessToken', res.data.content.access_token)
											getUserInfo().then((user) => {
												setUserInfo(user?.data.content)
												Taro.setStorageSync('userInfo', user?.data.content)
											})
											setAccountLoginOpen(false)
										}
									})
								} else {
									Taro.atMessage({
										message: '用户名和密码必填',
										type: 'error',
									})
								}
							}}
						>
							确定
						</Button>
					</AtModalAction>
				</AtModal>
			</View>
		</View>
	)
}
