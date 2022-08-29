export default defineAppConfig({
	pages: [
		'pages/Dashboard/index',
		'pages/ApproveList/index',
		'pages/ApproveOneDetail/index',
		'pages/PersonalCenter/index',
		'pages/WorkflowDetail/index',
		'pages/GeneralApproveAction/index',
	],
	tabBar: {
		color: '#aaa',
		selectedColor: '#6190E8',
		backgroundColor: '#fff',

		list: [
			{
				pagePath: 'pages/Dashboard/index',
				text: '工作台',
				iconPath: './assets/iconPath/gongzuotai.png',
				selectedIconPath: './assets/selectedIconPath/gongzuotai.png',
			},
			{
				pagePath: 'pages/ApproveList/index',
				text: '审批列表',
				iconPath: './assets/iconPath/shenpi.png',
				selectedIconPath: './assets/selectedIconPath/shenpi.png',
			},
			{
				pagePath: 'pages/PersonalCenter/index',
				text: '个人中心',
				iconPath: './assets/iconPath/gerenzhongxin.png',
				selectedIconPath: './assets/selectedIconPath/gerenzhongxin.png',
			},
		],
	},
	window: {
		navigationBarTextStyle: 'black',
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
	},
})
