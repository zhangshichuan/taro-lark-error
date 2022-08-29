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

import styles from './index.module.scss'
import RsAvatar from '../../assets/rs_avatar.jpg'

const taskState = {
	REJECT: '驳回',
	PASS: '通过',
	TODO: '待办',
	WITHDRAW: '撤回',
	RETURN: '退回',
}

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
		<View className={styles.WorkflowDetail}>
			{/* 头部任务信息 */}
			<View className={styles.headInfo}>
				{pageTaskListOneItem && (
					<TaskListOneItem pageTaskListOneItem={pageTaskListOneItem} simple={false} showCtrl={false} />
				)}
			</View>

			{/* 审批节点 */}
			<View className={styles.approveNode}>
				{workflowDeatail?.nodeList.map((item, index) => (
					<View className={styles.oneItem} key={index}>
						<View className={styles.nodeName}>
							<Text>○</Text>
							<Text>{item.nodeName}</Text>
						</View>
						{item.taskList.map((task) => (
							<View className={styles.assigneeName} key={task.taskId}>
								<AtAvatar circle className={styles.avatar} image={task.assigneeAvatar || RsAvatar} />
								<View className={styles.name}>
									<Text>{task.assigneeName}</Text>
									<AtTag
										className={classnames([
											task.state === 'PASS' && styles.pass,
											task.state === 'REJECT' && styles.reject,
											task.state === 'TODO' && styles.todo,
											task.state === 'WITHDRAW' && styles.withdraw,
										])}
										size="small"
									>
										{taskState[task.state] || '自动'}
									</AtTag>
								</View>
								<Text className={styles.time}>{dayjs(task.createTime).format('YYYY-MM-DD HH:mm')}</Text>

								{/* 抄送人 */}
								<View className={styles.ccListName}>
									<Text>抄送人: </Text>
									{task.ccListName?.map((name) => <Text key={name}>{name} </Text>) || '无'}
								</View>
								{/* 审批意见 */}
								<View className={styles.commentList}>
									<Text>意见: </Text>
									{task.commentList?.map((comment, num) => <Text key={num}>{comment.message} </Text>) || '无'}
								</View>
							</View>
						))}
					</View>
				))}
			</View>
		</View>
	)
}
