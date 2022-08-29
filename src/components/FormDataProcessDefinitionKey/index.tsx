/* eslint-disable react/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import dayjs from 'dayjs'
import classNames from 'classnames'
import Taro from '@tarojs/taro'
import { execMoney } from '../../utils'
import styles from './index.module.scss'
import FormDataDetail from '../FormDataDetail'

interface IProp {
	formData: string
	processDefinitionKey: string
}

export default function (props: IProp) {
	const { formData, processDefinitionKey } = props

	const [data, setData] = useState<any>()

	useEffect(() => {
		formData && setData(JSON.parse(formData))
		formData && console.log(JSON.parse(formData), 'formData')
	}, [formData])

	return (
		<View className={styles.FormDataProcessDefinitionKey}>
			{/* 发票管理 */}
			{['invoice_income', 'invoice_outcome', 'invoice_income_update', 'invoice_income_return'].includes(
				processDefinitionKey,
			) && (
				<FormDataDetail
					tabs={[
						{
							title: '申请信息',
							content: [
								{
									label: '税号',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.dutyParagraph,
									type: 'text',
								},
								{
									label: '服务主体',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.serviceUnitName,
									type: 'text',
								},
								{
									label: '往来单位',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.associatedUnitName,
									type: 'text',
								},
								{
									label: '往来单位主体',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.associatedCompanyName,

									type: 'text',
								},
								{
									label: '发票类型',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.invoiceTypeName,

									type: 'text',
								},
								{
									label: '发票内容',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.invoiceContentName,

									type: 'text',
								},
								{
									label: '关联模块',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.associationModule,
									type: 'text',
								},
								{
									label: '关联单号',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.associationUniqueCode,
									type: 'text',
								},
								{
									label: '发票金额',
									value: execMoney(
										{
											...data?.invoice,
											...data?.invoiceIncome,
											...data?.invoiceOutcome,
										}?.invoiceMoney,
									),
									type: 'text',
								},
								{
									label: '申请人',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.operatorUserName,
									type: 'text',
								},
								{
									label: '申请时间',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.operatorTime,
									type: 'text',
								},
								{
									label: '附件',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.invoiceFileUrls?.split(','),
									type: 'file',
								},
								{
									label: '申请说明',
									value: {
										...data?.invoice,
										...data?.invoiceIncome,
										...data?.invoiceOutcome,
									}?.description,
									type: 'text',
								},
							],
						},
					]}
				/>
			)}

			{/* 退票 */}
			{['invoice_income_return'].includes(processDefinitionKey) && ''}

			{/* 媒体资金 */}
			{['media_fund', 'media_fund_income', 'media_fund_income_invoice'].includes(processDefinitionKey) && ''}

			{/* 媒体保证金 */}
			{[
				'media_margin',
				'media_margin_return',
				'media_margin_deduction',
				'media_margin_company_change',
				'customer_margin_return',
				'customer_margin_deduction',
			].includes(processDefinitionKey) && ''}

			{/* 项目和订单 */}
			{['order_process'].includes(processDefinitionKey) && ''}

			{/* 项目确认实结 */}
			{['order_item_real_settlement_confirm'].includes(processDefinitionKey) && (
				<FormDataDetail
					tabs={[
						{
							title: '申请信息',
							content: [
								{
									label: '客户集团',
									value: data?.flowQO?.customerName,
									type: 'text',
								},
								{
									label: '客户主体',
									value: data?.flowQO?.companyName,
									type: 'text',
								},
								{
									label: '项目数',
									value: data?.flowQO?.orderItemTotal,
									type: 'text',
								},
								{
									label: '客户应结总额',
									value: execMoney(data?.flowQO?.customerPlanSettlementMoney),
									type: 'text',
								},
								{
									label: '客户实结金额',
									value: execMoney(data?.flowQO?.customerRealSettlementMoney),
									type: 'text',
								},
								{
									label: '应结实结差额',
									value: execMoney(data?.flowQO?.customerRealPlanDifferenceMoney),
									type: 'text',
								},
								{
									label: '备注',
									value: data?.flowQO?.description,
									type: 'text',
								},
							],
						},
						{
							title: '项目列表',
							content: [
								{
									columns: [
										{
											title: '项目编号',
											dataIndex: 'orderItemCode',
											fixed: 'left',
											render(code: string) {
												return <Text>{code}</Text>
											},
										},
										{
											title: '项目名称',
											dataIndex: 'orderItemName',
										},
										{
											title: '客户集团',
											dataIndex: 'customerName',
										},
										{
											title: '客户主体',
											dataIndex: 'companyName',
										},
										{
											title: '付款方式',
											dataIndex: 'paymentTypeName',
										},
										{
											title: '结算方式',
											dataIndex: 'settlementTypeName',
										},
										{
											title: '结算月份',
											dataIndex: 'settlementMonthString',
										},
										{
											title: '客户实结金额',
											dataIndex: 'customerRealSettlementMoney',
											render(text: any) {
												return <Text>{execMoney(text)}</Text>
											},
										},
										{
											title: '客户应结金额',
											dataIndex: 'customerPlanSettlementMoney',
											render(text: any) {
												return <Text>{execMoney(text)}</Text>
											},
										},
										{
											title: '应结实结差额',
											dataIndex: 'customerRealPlanDifferenceMoney',
											render(text: any) {
												return <Text>{execMoney(text)}</Text>
											},
										},
										{
											title: '项目客户金额',
											dataIndex: 'orderItemCustomerMoney',
											render(text: any) {
												return <Text>{execMoney(text)}</Text>
											},
										},
										{
											title: '项目媒体金额',
											dataIndex: 'orderItemMediaMoney',
											render(text: any) {
												return <Text>{execMoney(text)}</Text>
											},
										},
										{
											title: '执行日期',
											dataIndex: 'executionDate',
										},
										{
											title: '服务主体',
											dataIndex: 'serviceUnitName',
										},
										{
											title: '业务类型',
											dataIndex: 'businessTypeName',
										},
										{
											title: '媒体',
											dataIndex: 'mediaName',
										},
										{
											title: '媒体版块',
											dataIndex: 'mediaPlateName',
										},
										{
											title: '下单时间',
											dataIndex: 'orderTime',
											render(text: any) {
												return text ? <Text>{dayjs(text).format('YY-MM-DD HH:mm:ss')}</Text> : '-'
											},
										},
									],
									value: data?.orderItemList,
									type: 'list',
								},
							],
						},
					]}
				/>
			)}

			{/* 项目拆单 */}
			{['order_item_spilt'].includes(processDefinitionKey) && ''}

			{/* 项目执行和特批下单 */}
			{['order_item_execution', 'order_item_receive_confirm', 'special_permit_order_process'].includes(
				processDefinitionKey,
			) && ''}

			{/* 项目改单 */}
			{['order_item_change'].includes(processDefinitionKey) && ''}

			{/* 项目改单补返 */}
			{['repair_back_order_item'].includes(processDefinitionKey) && ''}

			{/* 客户档案和小审批  */}
			{[
				'customer_body_archive',
				'customer_body_simple_archive',
				'credit_change',
				'add_customer_policy',
				'customer_info_change',
				'payment_change',
				'principal_change',
				'company_info_change',
				'contact_change',
				'temporary_credit',
				'simple_company_info_change',
				'simple_customer_info_change',
				'new_company_info_change',
				'new_simple_company_info_change',
				'simple_contact_change',
				'customer_body_simple_archive_completion',
				'customer_plate_special_permit',
			].includes(processDefinitionKey) && ''}

			{/* 客户账单退单 */}
			{[
				'customer_settlement_return',
				'customer_settlement_supplement',
				'customer_settlement',
				'customer_settlement_invoice',
			].includes(processDefinitionKey) && ''}

			{/* 媒体账单和退单 */}
			{['media_bill', 'media_bill_return'].includes(processDefinitionKey) && ''}

			{/* 客户退款 */}
			{['customer_refund'].includes(processDefinitionKey) && ''}

			{/* 媒体列表，媒体政策，媒体主体，媒体板块 */}
			{['media_archive'].includes(processDefinitionKey) && ''}

			{/* 合同申请 */}
			{['contract_save', 'contract-replace'].includes(processDefinitionKey) && ''}
		</View>
	)
}
