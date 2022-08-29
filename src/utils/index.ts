import Taro from '@tarojs/taro'
import { isNumber } from 'lodash'

//  导航到通用审批页面
export function navigateToGeneralApproveAction(data: {
	approval: 'WITHDRAW' | 'PASS' | 'REJECT'
	templateId: 'normal' | 'WITHDRAW'
}) {
	Taro.navigateTo({
		url: `/pages/GeneralApproveAction/index?approval=${data.approval}&currentTaskIds=${
			Taro.getStorageSync('pageTaskListOneItem')?.currentTaskIds
		}&templateId=${data.templateId}&processInstanceId=${Taro.getStorageSync('pageTaskListOneItem')?.processInstanceId}`,
	})
}

// 钱千分位, 保留两位小数等
export function execMoney(money: number) {
	if (money === undefined || money === null) {
		return '无'
	}

	const oldMoney = money
	money = +money
	return isNumber(money)
		? '¥' +
				money
					?.toFixed(2)
					?.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		: oldMoney || '-'
}

// 获取文件的后缀
export function getFileType(fileUrl: string): string {
	let type = ''
	if (fileUrl?.length) {
		type = fileUrl.split('.')[fileUrl.split('.').length - 1].toString()
	}
	return type
}
