/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Input, Button, Icon } from '@tarojs/components'
import type { ICC } from '../../api/user'
import { generalApprove } from '../../api/dashboard'
import { getCCSelectList } from '../../api/user'
import { AtAvatar, AtButton, AtCheckbox, AtFloatLayout, AtIcon, AtInput, AtSearchBar, AtTextarea } from 'taro-ui'

import styles from './index.module.scss'
import RsAvatar from '../../assets/rs_avatar.jpg'

export default function () {
	const [ccIsOpened, setCcIsOpened] = useState(false)
	const [ccSearchBar, setCcSearchBar] = useState('')
	const [ccList, setCClist] = useState<ICC[]>([])
	const [approvalData, setApprovalData] = useState<{
		ccList: ICC[]
		approvalComments: string
	}>({ ccList, approvalComments: '' })

	useDidShow(() => {
		switch (Taro.getCurrentInstance().router?.params?.approval) {
			case 'PASS':
				Taro.setNavigationBarTitle({
					title: '审批通过',
				})
				break
			case 'REJECT':
				Taro.setNavigationBarTitle({
					title: '审批否决',
				})
				break
			case 'WITHDRAW':
				Taro.setNavigationBarTitle({
					title: '审批撤回',
				})
				break

			default:
				break
		}
	})

	useEffect(() => {
		getCCSelectListAsync()
	}, [ccSearchBar])

	function getCCSelectListAsync() {
		getCCSelectList(ccSearchBar).then((res) => {
			if (res) {
				setCClist(res.data.content.list || [])
			}
		})
	}

	function generalApproveAsync() {
		if (!approvalData?.approvalComments) {
			Taro.showToast({
				title: '审批意见必填!',
				icon: 'error',
			})
			return
		}

		generalApprove({
			approval: Taro.getCurrentInstance().router?.params?.approval as any,
			taskId: Taro.getCurrentInstance().router?.params?.currentTaskIds?.split(',')[0] || '',
			templateId: Taro.getCurrentInstance().router?.params?.templateId as any,
			processInstanceId: Taro.getCurrentInstance().router?.params?.processInstanceId as any,
			ccList: (approvalData?.ccList && approvalData.ccList.map((item) => item.id)) || [],
			approvalComments: (approvalData?.approvalComments && approvalData.approvalComments) || '',
			templateData: (approvalData?.approvalComments && approvalData.approvalComments) || '',
		}).then((res) => {
			if (res?.data.content) {
				Taro.showToast({
					icon: 'success',
					title: '操作成功!',
				})
				Taro.navigateBack({
					delta: Taro.getCurrentPages().length - 1,
				})
			}
		})
	}

	return (
		<View className={styles.GeneralApproveAction}>
			{/* 审批意见 */}
			<View className={styles.approvalComment}>
				<Text>* 审批意见</Text>
				<AtTextarea
					placeholder="请填写审批意见 (必填)"
					value={approvalData?.approvalComments || ''}
					maxLength={50}
					onChange={(value) => {
						approvalData.approvalComments = value
						setApprovalData(approvalData)
					}}
					cursorSpacing={180}
					height={200}
				/>
			</View>

			{/* 抄送人 */}
			<View className={styles.ccList}>
				<Text>抄送人员</Text>
				<View className={styles.list}>
					{approvalData?.ccList?.map((item) => (
						<View
							onClick={(e) => {
								e.stopPropagation()
								approvalData.ccList = approvalData.ccList.filter((_) => _.id !== item.id)
								setApprovalData({ ...approvalData })
							}}
							className={styles.listItem}
							key={item.id}
						>
							<AtAvatar size="small" circle image={item?.avatar || RsAvatar} />
							<Text>{item?.name}</Text>
						</View>
					))}
					<View
						onClick={() => {
							setCcSearchBar('')
							setCcIsOpened(true)
						}}
						className={styles.listItem}
					>
						<AtIcon value="add-circle" size="40" color="#999"></AtIcon>
						<Text>更多</Text>
					</View>
				</View>
				{/* 抄送备注 */}
				<Text style={{ fontSize: '12px', display: 'block' }}>注：单击头像可以快速删除哦</Text>
				<Text style={{ fontSize: '12px' }}>注：审批完成后，将自动通知到所选人员。</Text>
			</View>

			{/* 确认取消 */}
			<View className={styles.action}>
				<View>
					<AtButton
						onClick={() => {
							generalApproveAsync()
						}}
						size="small"
						type="primary"
					>
						{Taro.getCurrentInstance().router?.params?.approval === 'PASS' && '审批通过'}
						{Taro.getCurrentInstance().router?.params?.approval === 'REJECT' && '审批否决'}
						{Taro.getCurrentInstance().router?.params?.approval === 'WITHDRAW' && '审批撤回'}
					</AtButton>
				</View>
				<View>
					<AtButton
						onClick={() => {
							Taro.navigateBack()
						}}
						size="small"
						type="secondary"
					>
						取消
					</AtButton>
				</View>
			</View>

			{/* 抄送人弹窗 */}
			<AtFloatLayout
				isOpened={ccIsOpened}
				title="选择抄送人"
				onClose={() => {
					setCcIsOpened(false)
				}}
			>
				<AtInput
					name="value"
					placeholder="请输入搜索关键字"
					value={ccSearchBar}
					type="text"
					onChange={(value: string) => {
						setCcSearchBar(value)
					}}
				/>
				<View style={{ height: '60vh', overflow: 'auto' }}>
					<AtCheckbox
						options={ccList.map((item) => ({
							value: item.id,
							label: item.name,
						}))}
						selectedList={approvalData?.ccList?.map((item) => item.id) as any[]}
						onChange={(value) => {
							let list: any = value?.map((id) => ccList.find((_) => _.id === id))?.filter(Boolean)
							ccSearchBar ? (approvalData.ccList = approvalData.ccList.concat(list)) : (approvalData.ccList = list)
							setApprovalData({ ...approvalData })
						}}
					/>
				</View>
			</AtFloatLayout>
		</View>
	)
}
