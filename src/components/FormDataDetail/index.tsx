/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import Table from 'taro3-table'

import { View, Text, Image } from '@tarojs/components'
import dayjs from 'dayjs'
import classNames from 'classnames'
import Taro from '@tarojs/taro'
import { AtDivider, AtTabs, AtTabsPane } from 'taro-ui'
import { getFileType } from '../../utils'

import styles from './index.module.scss'

interface IProp {
	tabs: {
		title: string
		content: {
			label?: string
			columns?: {
				title: string
				dataIndex: string
				render?: any
				fixed?: 'left' | 'right'
			}[]
			value?: any
			type?: 'text' | 'list' | 'file'
			splitText?: string
		}[]
	}[]
}

enum FileType {
	'PDF' = 'pdf',
	'DOC' = 'doc',
	'DOCX' = 'docx',
	'JPG' = 'jpg',
	'JPEG' = 'jpeg',
	'PNG' = 'png',
	'GIF' = 'gif',
	'ZIP' = 'zip',
	'EML' = 'eml',
	'XLS' = 'xls',
	'XLSX' = 'xlsx',
}

export default function (props: IProp) {
	const { tabs } = props

	const [current, setCurrent] = useState(0)

	return (
		<View className={styles.FormDataDetail}>
			<AtTabs swipeable={false} current={current} scroll tabList={tabs} onClick={(tab) => setCurrent(tab)}>
				{tabs?.map((tab, index) => (
					<AtTabsPane key={tab.title} current={current} index={index}>
						{tab?.content?.map((item) => (
							<View key={item.label}>
								{item.splitText && <AtDivider fontSize="12px" fontColor="#666" content={item.splitText} />}
								<View className={styles.item}>
									{item.label && (
										<View className={styles.label}>
											<Text>{item.label}</Text>
										</View>
									)}

									{/* 文本 */}
									{item.type === 'text' && <View className={styles.text}>{item.value || '-'}</View>}

									{/* 列表 */}
									{item.type === 'list' && (
										<View className={styles.list}>
											{/* 只适配了移动端 */}
											<Table
												rowKey=""
												colStyle={{ padding: '0 5px' }}
												columns={item.columns || []}
												dataSource={item.value}
												style={{
													margin: '0 auto',
													width: '100%',
												}}
												scroll={{
													x: '100vw',
													y: 400,
												}}
											/>
										</View>
									)}

									{/* 文件 */}
									{item.type === 'file' && (
										<View className={styles.file}>
											{item.value?.map((file: string) => (
												<Text
													onClick={() => {
														Taro.previewImage({
															current: file,
															urls: item.value?.filter((_: string) =>
																['jpg', 'jpeg', 'png', 'gif']?.includes(getFileType(_)),
															),
															fail(err) {
																Taro.showToast({
																	title: '暂不支持此类文件',
																	icon: 'error',
																})
															},
														})
													}}
													key={file}
													style={{ margin: 5 }}
												>
													查看
												</Text>
											))}
										</View>
									)}
								</View>
							</View>
						))}
					</AtTabsPane>
				))}
			</AtTabs>
		</View>
	)
}
