/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import dayjs from 'dayjs'
import classNames from 'classnames'
import Taro from '@tarojs/taro'

import styles from './index.module.scss'
import { IPageTaskListOneItem } from '../../api/dashboard'
import { navigateToGeneralApproveAction } from '../../utils'

interface IProp {
	simple: boolean
	showCtrl?: boolean
	pageTaskListOneItem: IPageTaskListOneItem
}

const TemplateIdNormal = 'normal'

export default function (props: IProp) {
	return (
		<View
			style={props.simple ? { height: 124 } : { height: !props.simple && !props.showCtrl ? 148 : 160 }}
			className={styles.TaskListOneItem}
			onClick={(e) => {
				e.stopPropagation()
				if (!props.simple && !props.showCtrl) {
					return
				}
				Taro.setStorageSync('pageTaskListOneItem', props.pageTaskListOneItem)
				Taro.navigateTo({
					url: '/pages/ApproveOneDetail/index',
				})
			}}
		>
			{/* 任务类型 加急 当前状态 */}
			<View className={styles.one}>
				<View className={styles.type}>
					<Text>{props.pageTaskListOneItem.processDefinitionName}</Text>
					{props.pageTaskListOneItem.urgent && <Text className={styles.urgent}>急</Text>}
				</View>

				<View className={styles.state}>
					<Text
						className={classNames([
							styles.dot,
							props.pageTaskListOneItem.state === '审批中' && styles.shenpizhong,
							props.pageTaskListOneItem.state === '流程结束' && styles.liuchengjieshu,
							props.pageTaskListOneItem.state === '已驳回' && styles.yibohui,
							props.pageTaskListOneItem.state === '已作废' && styles.yizuofei,
						])}
					>
						●
					</Text>
					<Text>{props.pageTaskListOneItem.state}</Text>
					{(props.simple || props.showCtrl) && <AtIcon value="chevron-right" size="24" color="#0079fe"></AtIcon>}
				</View>
			</View>
			{/* 具体任务内容 */}
			<View className={classNames([styles.two, !props.simple && !props.showCtrl && styles.twoNoHidden])}>
				{props.pageTaskListOneItem.processInstanceName}
			</View>

			{/* 客户集团 通知时间 */}
			{!props.simple && !props.showCtrl && (
				<View className={styles.three}>
					<Text>客户集团: {props.pageTaskListOneItem.customerName || '-'}</Text>
					<Text>通知时间: {dayjs(props.pageTaskListOneItem.notifyTime).format('MM-DD HH:mm')}</Text>
				</View>
			)}

			{/* 发起人 发起时间 */}
			<View className={styles.three}>
				<Text>发起人: {props.pageTaskListOneItem.authenticatedUserName}</Text>
				{!props.showCtrl ? (
					<Text>发起时间: {dayjs(props.pageTaskListOneItem.createTime).format('MM-DD HH:mm')}</Text>
				) : (
					<Text>通知时间: {dayjs(props.pageTaskListOneItem.notifyTime).format('MM-DD HH:mm')}</Text>
				)}
			</View>

			{/* 操作栏 同意 否决 */}
			{!props.simple && props.showCtrl && (
				<View className={styles.ctrl}>
					{!props.pageTaskListOneItem.templateId || props.pageTaskListOneItem.templateId === TemplateIdNormal ? (
						<View className={styles.btn}>
							<View
								onClick={(e) => {
									e.stopPropagation()
									Taro.setStorageSync('pageTaskListOneItem', props.pageTaskListOneItem)
									navigateToGeneralApproveAction({
										approval: 'REJECT',
										templateId: 'normal',
									})
								}}
								className={styles.disagree}
							>
								否决
							</View>
							<View
								onClick={(e) => {
									e.stopPropagation()
									Taro.setStorageSync('pageTaskListOneItem', props.pageTaskListOneItem)
									navigateToGeneralApproveAction({
										approval: 'PASS',
										templateId: 'normal',
									})
								}}
								className={styles.agree}
							>
								同意
							</View>
						</View>
					) : (
						<Text>暂不支持移动端操作，请到PC端处理 </Text>
					)}
				</View>
			)}
		</View>
	)
}
