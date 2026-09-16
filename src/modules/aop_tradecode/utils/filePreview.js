/**
 * 预览文件
 * @param {*} url 文件路径
 * @return {*}
 */
export function filePreview(url) {
  const orign = process.env.NODE_NEV === "production" ? window.location.origin : "https://dev.finmall.com"
  const lastUrl = url.indexOf('"@fastdfs/"') > -1 ? url.replace('"@fastdfs/"', `${orign}/fastdfs/`) : url
  const typeArr = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']
  const suffix = lastUrl.substring(lastUrl.lastIndexOf(".") + 1)
  if (typeArr.indexOf(suffix) !== -1) {
    window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(lastUrl)}`, "_blank");
  } else {
    window.open(`${lastUrl}`, "_blank");
  }
}
