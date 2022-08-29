/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import dayjs from 'dayjs'
import { AtAvatar, AtTag } from 'taro-ui'
import TaskListOneItem from '../../components/TaskListOneItem'
import { getWorkflowDetail } from '../../api/dashboard'
import type { IWorkflowDetail, IPageTaskListOneItem } from '../../api/dashboard'
import { ApproveCtrlTab } from '../../components/ApproveCtrlTab'
import FormDataProcessDefinitionKey from '../../components/FormDataProcessDefinitionKey'

import styles from './index.module.scss'

export default function () {
	const [workflowDeatail, setWorkflowDeatail] = useState<IWorkflowDetail>()
	const [pageTaskListOneItem, setPageTaskListOneItem] = useState<IPageTaskListOneItem>()

	useDidShow(() => {
		setPageTaskListOneItem(Taro.getStorageSync('pageTaskListOneItem'))
	})

	useEffect(() => {
		pageTaskListOneItem?.processInstanceId &&
			getWorkflowDetail(pageTaskListOneItem.processInstanceId).then((res) => {
				if (res) {
					setWorkflowDeatail(res.data.content)
				}
			})
	}, [pageTaskListOneItem?.processInstanceId])

	return (
		<View className={styles.ApproveOneDetail}>
			{/* 头部任务信息 */}
			<View className={styles.headInfo}>
				{pageTaskListOneItem && (
					<TaskListOneItem pageTaskListOneItem={pageTaskListOneItem} simple={false} showCtrl={false} />
				)}
			</View>

			{/* 各类审批详情信息 */}
			<View className={styles.allDetail}>
				<FormDataProcessDefinitionKey
					formData={workflowDeatail?.formData || ''}
					processDefinitionKey={workflowDeatail?.processDefinitionKey || ''}
				/>
			</View>

			{/* 底部的审批工作栏 */}
			<View className={styles.workflowCtrlTab}>
				<ApproveCtrlTab withdrawFlag={workflowDeatail?.withdrawFlag} templateId={pageTaskListOneItem?.templateId} />
			</View>
		</View>
	)
}
