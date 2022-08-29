export interface IPagination<T = any> {
	endRow: number
	list: T
	pageNum: number
	pageSize: number
	pages: number
	size: number
	startRow: number
	total: number
}
