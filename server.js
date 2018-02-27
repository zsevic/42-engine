const express = require('express')
const app = express()
const path = require('path')
const request = require('sync-request')
const mongodb = require('mongodb').MongoClient
const dnsChecker = require('./dns-checker')
const words = require('./words')
const indexing = {}

const tld = require('tldjs')

const toCrawl = ['http://google.com']
const crawled = {}
const DNSPassed = []

// let urlRegex = new RegExp(/<a href="(.*?)\/?".*>(.*?)<\/a>/g)

// let domainRegex = new RegExp(/10\.(0-9|[1-9][0-9]|1[1-9][0-9]|2([0-4][0-9]|5[0-5]))/)

const linkscrape = require('linkscrape')

/* mongodb.connect("mongodb://linksuser:linkspass@ds119598.mlab.com:19598/hack_engine", function(err, db) {
  db.collection("wordsee",function(err,col){
    var json=JSON.stringify(indexing);
    json=JSON.parse(json);
    col.insert(json);
  });
});
*/
app.get('/:keyword', (req, res) => {
  let query = req.params.keyword
  mongodb.connect('mongodb://localhost:27017/indexes', (err, db) => {
    db.collection('wordsefe9.4', (err, col) => {
      json = JSON.stringify(indexing)
      json = JSON.parse(json)
      col.insert(json)
      data = col.find().forEach(myDoc => {
        globalRes[query] = myDoc[query]
      })
    })
  })
  setTimeout(() => {
    res.send(JSON.stringify(globalRes))
  }, 100)
})

let Link = function (title, url, text) {
  this.title = title
  this.url = url
  this.text = text
}

let titleRegex = new RegExp('.*?<title>(.*?)</title>.*?')
let bodyRegex = new RegExp('.*?<body>(.*?)</body>.*?')

function crawling (url) {
  console.log(toCrawl.length)
  let brojiteracija = 0
  while (toCrawl.length > 0) {
    let response = request('get', toCrawl[0], {retry: false})
    response = response.getBody()
    let matchess

    let matches
    linkscrape(toCrawl[0], response, (links, $) => {
      let i = 0
      let matc
      if (matc = bodyRegex.exec(response.toString())) {
        console.log(matc[1])
      }

      while (i < links.length) {
        let link = links[i].link

        if (link === null || !tld.isValid(link) || link.indexOf('@') > -1 || link.indexOf('.jpg') > -1) {
          i++
          continue
        }

        let dnsCheckLink = link.substr(7, link.length)
        if (dnsCheckLink.indexOf('/') !== -1) { dnsCheckLink = dnsCheckLink.substr(0, dnsCheckLink.indexOf('/')) }
        if (link.indexOf('https://') === -1) {
          if (!(crawled[link] === true || (toCrawl.indexOf(link) > -1) || link.indexOf('#') !== -1)) {
            if ((DNSPassed.indexOf(dnsCheckLink) === -1)) {
              if (dnsChecker(dnsCheckLink) === true) {
                toCrawl.push(link)
                DNSPassed.push(dnsCheckLink)
              }
            } else {
              toCrawl.push(link)
            }
          }
        }
        i++
      }
    })
// let leftBody = response.toString().indexOf("<body>")
// let rightBody = response.toString().indexOf("</body>")
// if(leftBody < rightBody && leftBody > -1) {
// let bodi = response.toString().substring(leftBody, rightBody)
// }

    let body = response.toString()
// var target;
    if (matchess = titleRegex.exec(body)) {
      matches = matchess[1]
    } else {
      matches = 'Untitled'
    }
    let targetObject = new Link(matches, toCrawl[0], body.substr(0, 100))
    crawled[toCrawl[0]] = true
    brojiteracija++
    let arr = words(response)
// console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== undefined) {
        keyword = arr[i].toLowerCase()
        if (indexing.hasOwnProperty(keyword)) {
          indexing[keyword].push(targetObject)
        } else {
          indexing[keyword] = []
          indexing[keyword].push(targetObject)
        }
      }
    }
    toCrawl.shift()
    console.log(brojiteracija + '*************************')
    console.log(toCrawl)
    console.log(crawled)
    if (brojiteracija === 5) {
      console.log(indexing)
      break
    }
  }
}
// console.log(indexing);
// console.log(brojiteracija);
// console.log(crawled);
crawling(toCrawl[0])

app.use(express.static(path.join(__dirname, 'app')))
app.listen(3030)
