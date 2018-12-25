/**
 * @Desc: 在班学生相关api
 */
import requester from 'config/requester'
import store from 'store'

/**
 * 获取班级学生
 */
export function requestGetStudents() {
	const url = `/api/v2/class/student`
	return requester.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

// (学生修改)
export function requestPatchStudent(param) {
	const method = 'patch'
	const url = '/api/v2/student'
	const params = {
		stuId: param.id,
		stuName: param.name,
		stuHead: param.avatar,
		birthday: param.birthday,
		gender: param.gender
	}
	return requester.request({ method, url, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch( err => {
			return Promise.reject(err)
		})
}
