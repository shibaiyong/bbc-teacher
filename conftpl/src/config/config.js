/** 
 * @Desc: 全局敞亮配置，发版动态配置
 */

let NODE_ENV = process.env.NODE_ENV
let baseURL = ''
let FeVersion = "@BUILD.REVISION@"
let versionMessage = "@BUILD.REVISION.MESSAGE@" 

// 生产环境
if (NODE_ENV === 'production') {
  baseURL = '@PROD.BASEURL@'
}

// 开发环境
if (NODE_ENV === 'development') {
  baseURL = '@DEV.BASEURL@'
}

// auth验证
const auth = {
  username: 'viewshare',
  password: 'emp'
}

// 播放器文件名
const playerFileName = '@PLAYER.FILENAME@'

export {
  baseURL,
  auth,
  playerFileName,
  FeVersion,
  versionMessage
}