/**
 * @Desc: 备课云盘相关api
 */
import requester from 'config/requester'

/**
 * 获取文件列表
 * @param  {number} folderId：文件夹id，根目录传0
 * @param  {number} orderType：排序类别
 */
export function requestGetFileList(folderId, orderType) {
	const url = `/api/v2/storage/${folderId}`
	const params = {
		orderType: orderType
	}
	return requester.request({ url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch( err => {
			return Promise.reject(err)
		})
}

/**
 * 新建文件夹
 * @param  {string} folderName：新建文件夹名，不传后台生成
 */
export function requestCreateFolder(folderName) {
	const method = 'post'
	const url =  '/api/v2/storage'
	const params = { folderName	}
	return requester.request({ method, url,	params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 上传文件（可多个）
 * @param  {number} folderId：上传文件所在文件夹id，根目录传0
 * @param  {formData} data：上传的文件
 * @param  {number} uploadId：此次上传的id，用于进度处理
 * @param  {function} progressCb：进度回调函数
 */
export function requestUploadFile(folderId, data, uploadId, progressCb) {
	const method = 'post'
	const url = `/api/v2/storage/${folderId}`
	return requester.request({ method, url, data, 
		onUploadProgress: function(progressEvent) {
			progressEvent.uploadId = uploadId
			progressCb && progressCb(progressEvent)
		}
	})
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 删除文件（可多个）
 * @param  {string} fileIds：文件id，可多个，逗号分隔
 */
export function requestDeleteFile(fileIds) {
	const method = 'delete'
	const url = '/api/v2/storage/delete'
	const params = { fileIds }
	return requester.request({ method, url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 文件重命名
 * @param  {string} fileName：文件新名字
 * @param  {number} fileId：文件id
 */
export function requestRenameFile(fileName, fileId) {
	const method = 'patch'
	const url = `/api/v2/storage/${fileId}`
	const params = { fileName }
	return requester.request({ method, url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 移动文件到某个文件夹（可多个）
 * @param  {number} folderId：目标文件夹id，根目录传0
 * @param  {string} fileIds：文件id，可多个，逗号分隔
 */
export function requestMoveFile(folderId, fileIds) {
	const method = 'put'
	const url = '/api/v2/storage/move'
	const params = { folderId, fileIds }
	return requester.request({ method, url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 复制文件到某个文件夹（可多个）
 * @param  {number} folderId：目标文件夹id，根目录传0
 * @param  {string} fileIds：文件id，可多个，逗号分隔
 */
export function requestCopyFile(folderId, fileIds) {
	const method = 'put'
	const url = '/api/v2/storage/copy'
	const params = { folderId, fileIds }
	return requester.request({ method, url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 复制文件到某个文件夹（可多个）
 * @param  {number} folderId：目标文件夹id，根目录传0
 * @param  {string} fileIds：文件id，可多个，逗号分隔
 */
export function requestLoadFile(folderId, fileIds) {
	const url = '/api/v2/storage/copy'
	const params = { folderId, fileIds }
	return requester.request({ method, url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/** 
 * 下载文件
 * @param  {string} fileIds：文件id，可多个，逗号分隔
*/
export function requestDownLoadFile(fileIds) {
  const url = '/api/v2/storage/down'
  const method = 'post'
  const params = { fileIds }
  const headers = { 'Content-Type' : 'application/x-www-form-urlencoded'}
  const responseType = 'blob'
  return requester.request({ method, url, params, headers, responseType })
		.then(res => {
      const content = res.data
      const blob = new Blob([content])
      const fileName = '下载文件.zip'
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

