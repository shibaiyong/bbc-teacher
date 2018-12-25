const regular = {
  // 文件类型
  video: /(mp4|mov|avi|mpg|flv|rm|rmvb|wmv|3gp|mkv|swf)/i,
  png: /(png|jpg|jpeg|gif|bmp)/i,
  music: /(mp3|wav|wma)/i,
  txt: /(txt)/i,
  doc: /(doc|docx)/i,
  ppt: /(ppt|pptx)/i,
  xls: /(xls|xlsx)/i,
  pdf: /(pdf)/i,
  zip: /(zip|rar)/i,
  unknow: /(mp4|mov|avi|mpg|flv|rm|rmvb|wmv|3gp|mkv|swf|png|jpg|jpeg|gif|bmp|mp3|wav|wma|txt|doc|docx|ppt|pptx|xls|xlsx|pdf|zip|rar)/i,

  // 特殊字符
  specialCharacter: /(\?|\*|\\|\/|\<|\>|\:|\"|\/)/i
}

