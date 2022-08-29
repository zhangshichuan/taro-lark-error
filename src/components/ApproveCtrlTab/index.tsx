/* eslint-disable react/jsx-indent-props */
import React from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'

import workflowImg from '../../assets/approve/gongzuoliuchengtu.png'
import WithdrawImg from '../../assets/approve/chehui.png'
import RejectImg from '../../assets/approve/cuowuguanbiquxiao.png'
import PassImg from '../../assets/approve/tongguo.png'
import { navigateToGeneralApproveAction } from '../../utils'

function ApproveCtrlTab(props: { withdrawFlag?: boolean; templateId?: 'nomal' | string }) {
	return (
		<View className={styles.ApproveCtrlTab}>
			<View
				onClick={() => {
					Taro.navigateTo({
						url: '/pages/WorkflowDetail/index',
					})
				}}
				className={styles.ctrlItem}
			>
				<Image mode="widthFix" src={workflowImg} />
				<Text>流程</Text>
			</View>
			{props?.withdrawFlag ? (
				<View
					onClick={() => {
						navigateToGeneralApproveAction({
							approval: 'WITHDRAW',
							templateId: 'WITHDRAW',
						})
					}}
					className={styles.ctrlItem}
				>
					<Image mode="widthFix" src={WithdrawImg} />
					<Text>撤回</Text>
				</View>
			) : (
				<View className={styles.ctrlItem} />
			)}
			{!Taro.getStorageSync('tabCurrent') && (
				<>
					{(!props.templateId || props.templateId === 'normal') && !props.withdrawFlag ? (
						<>
							<View
								onClick={() => {
									navigateToGeneralApproveAction({
										approval: 'REJECT',
										templateId: 'normal',
									})
								}}
								className={styles.ctrlItem}
							>
								<Image mode="widthFix" src={RejectImg} />
								<Text>审批否决</Text>
							</View>
							<View
								onClick={() => {
									navigateToGeneralApproveAction({
										approval: 'PASS',
										templateId: 'normal',
									})
								}}
								className={styles.ctrlItem}
							>
								<Image mode="widthFix" src={PassImg} />
								<Text>审批通过</Text>
							</View>
						</>
					) : (
						<>
							{!props?.withdrawFlag && (
								<View className={styles.noAction}>
									<Text>请到PC端处理 </Text>
								</View>
							)}
						</>
					)}
				</>
			)}
		</View>
	)
}

export { ApproveCtrlTab }
