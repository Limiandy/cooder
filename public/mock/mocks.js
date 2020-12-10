/*
 * @Descripttion:
 * @version:
 * @Author: Andy
 * @Date: 2020-04-05 19:33:18
 * @LastEditors: Andy
 * @LastEditTime: 2020-04-16 11:04:40
 */

const Random = Mock.Random;
const articles = []

for (let i = 0; i < 100; i++) {
  let article = Mock.mock({
      'id': i + 1,
      'title': '@ctitle',
      'body': '@cparagraph(15)',
      'ceatgory|1': ['js', 'vue', 'ES6', 'nodejs'],
      'label|1': ['express','vuex','vueRouter','ajax','set'],
      'see|3-300': 1,
      'heart|1-300': 1,
      'meary|0-15': 0,
      'img': '@image',
      'baseurl': '@url("http", "sbfbi.xyz")',
      'url': '/article/@title'
  })
  articles.push(article)
}


Mock.mock('/cooderi/article/list', 'get', function(options) {
  return articles
})

Mock.mock(RegExp(/\/cooderi\/article\/detailed\?id=\d+/), 'get', function(options) {
  let params = options.url.slice(options.url.indexOf('?') + 1, options.url.length)
  let id = params.split('=')[1]
  let article = articles.find(element => {
    return element.id == id
  })
  return article
})

Mock.mock(RegExp(/\/cooderi\/article\/ceatgory\?ceatgory=js/), 'get', (options) => {
  let params = options.url.slice(options.url.indexOf('?') + 1, options.url.length)
  let ceatgory = params.split('=')[1]
  let article = []
  articles.find(element => {
    if (element.ceatgory == ceatgory) {
      article.push(element)
    }
  })
  return article
})

