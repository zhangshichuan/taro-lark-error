/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-quotes */
import React, { useEffect, useState } from 'react'
import { useDidShow } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { getTaskStatistical, getTodoList, IPageTaskListOneItem } from '../../../src/api/dashboard'
import type { IPageTask, TaskStatistical } from '../../../src/api/dashboard'
import Taro from '@tarojs/taro'

import TaskListOneItem from '../../components/TaskListOneItem'

import styles from './index.module.scss'

import todoIconNice from '../../assets/approve/icon.png'
import todoIconBad from '../../assets/approve/jingshi.png'

import doneIconNice from '../../assets/approve/taiyang.png'
import doneIconBad from '../../assets/approve/yueliang.png'

export default function () {
	const [taskStatistical, setTaskStatistical] = useState<TaskStatistical>({
		todoTaskNum: 0,
		todayDoneTaskNum: 0,
		withinTimeLimitTaskNum: 0,
	})

	const [todoList, setTodoList] = useState<IPageTaskListOneItem[]>([])

	useDidShow(() => {
		getTaskStatisticalAsync()
		getTodoListAsync()
	})

	// 获取今日待办和已办数量
	function getTaskStatisticalAsync() {
		getTaskStatistical().then((res) => {
			if (res?.data.content) {
				setTaskStatistical(res.data.content)
			}
		})
	}

	// 获取待办事项具体数据列表
	function getTodoListAsync() {
		getTodoList().then((res) => {
			if (res?.data.content) {
				Taro.setStorageSync('tabCurrent', 0)
				setTodoList(res.data.content.list)
			}
		})
	}

	return (
		<View className={styles.Dashboard}>
			{/* 全屏 banner */}
			<View className={styles.bg}></View>

			{/* 待办数量 & 已办数量 */}
			<View className={styles.todoDone}>
				<View className={styles.todo}>
					<Text className={styles.num}>{taskStatistical?.todoTaskNum}</Text>
					<Text className={styles.title}>待办事项</Text>

					{taskStatistical.todoTaskNum > 0 ? (
						<Image mode="widthFix" className={styles.icon} src={todoIconBad} />
					) : (
						<Image mode="widthFix" className={styles.icon} src={todoIconNice} />
					)}
				</View>
				<View className={styles.done}>
					<Text className={styles.num}>{taskStatistical?.todayDoneTaskNum}</Text>
					<Text className={styles.title}>已办事项</Text>

					{taskStatistical.todayDoneTaskNum > 0 ? (
						<Image mode="widthFix" className={styles.icon} src={doneIconNice} />
					) : (
						<Image mode="widthFix" className={styles.icon} src={doneIconBad} />
					)}
				</View>
			</View>

			{/* 默认的 10 条待办数据 */}
			<View className={styles.todoList}>
				<ScrollView
					style={{
						height: 'calc(100vh - 200px)',
					}}
					scrollY
					onScrollToUpper={(e) => {
						console.log(e)
					}}
					onScrollToLower={(e) => {
						console.log(e)
					}}
				>
					{todoList?.map((item, index) => (
						<TaskListOneItem key={index} pageTaskListOneItem={item} simple />
					))}
					<View style={{ height: 30 }}></View>
				</ScrollView>
			</View>
		</View>
	)
}
