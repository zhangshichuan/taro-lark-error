/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'

import TaskListOneItem from '../../components/TaskListOneItem'
import { getCCList, getDoneList, getInitiatedList, getTodoList, IPageTaskListOneItem } from '../../api/dashboard'

import styles from './index.module.scss'

export default function (props: any) {
	const [tabList, setTabList] = useState<IPageTaskListOneItem[]>([])

	const [tabCurrent, setTabCurrent] = useState(0)
	const [pageNum, setPageNum] = useState(1)

	useEffect(() => {
		Taro.setStorageSync('tabCurrent', tabCurrent)
		switch (tabCurrent) {
			case 0:
				getTodoListAsync()
				break
			case 1:
				getDoneListSync()
				break
			case 2:
				getCCListAsync()
				break
			case 3:
				getInitiatedListAsync()
				break
			default:
				break
		}
	}, [pageNum, tabCurrent])

	// 获取待办事项具体数据列表
	function getTodoListAsync() {
		getTodoList(pageNum).then((res) => {
			if (res?.data.content) {
				setTabList(tabList.concat(res.data.content.list || []))
			}
		})
	}
	// 获取已办事项具体数据列表
	function getDoneListSync() {
		getDoneList(pageNum).then((res) => {
			if (res?.data.content) {
				setTabList(tabList.concat(res.data.content.list || []))
			}
		})
	}
	// 获取抄送我事项具体数据列表
	function getCCListAsync() {
		getCCList(pageNum).then((res) => {
			if (res?.data.content) {
				setTabList(tabList.concat(res.data.content.list || []))
			}
		})
	}
	// 获取已发起事项具体数据列表
	function getInitiatedListAsync() {
		getInitiatedList(pageNum).then((res) => {
			if (res?.data.content) {
				setTabList(tabList.concat(res.data.content.list || []))
			}
		})
	}

	return (
		<View className={styles.ApproveList}>
			<AtTabs
				current={tabCurrent}
				tabList={[{ title: '待办' }, { title: '已办' }, { title: '抄送我' }, { title: '已发起' }]}
				onClick={(current) => {
					setTabList([])
					setPageNum(1)
					setTabCurrent(current)
				}}
			></AtTabs>
			<ScrollView
				style={{
					height: 'calc(100vh - 50px)',
				}}
				scrollY
				onScrollToUpper={() => {
					setPageNum(1)
				}}
				onScrollToLower={() => {
					setPageNum(pageNum + 1)
				}}
			>
				{tabList?.map((item, index) => (
					<TaskListOneItem key={index} pageTaskListOneItem={item} simple={tabCurrent === 0 ? false : true} showCtrl />
				))}
				<View style={{ height: 30 }}></View>
			</ScrollView>
		</View>
	)
}
