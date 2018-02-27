let regex = new RegExp('(.*?)>(.*?)<(/)?', 'g')

module.exports = body => {
  let str = ''
  let matches
  while (matches = regex.exec(body)) {
    str += matches[2]
  }

  let arr = str.split(/[\s,.|":;'?]+/)

  let uniqueArr = arr.filter((elem, pos) => {
    return arr.indexOf(elem) === pos
  })

  for (let k in uniqueArr) {
    if (uniqueArr[k].length <= 1) {
      delete uniqueArr[k]
    }
  }

  return uniqueArr
}
