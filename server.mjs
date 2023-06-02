import herokuSSLRedirect from 'heroku-ssl-redirect'
import path from 'path'
import express from 'express'
import exphbs from 'express-handlebars'
import crawler from './crawler.js'
import MDParser from './MDParser.js'
import fs from 'fs'

const sslRedirect = herokuSSLRedirect.default
const app = express()

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(sslRedirect())

var port = process.env.PORT || 8001

const classesTaken = [
  { code: 'CS 475', date: "Spring 2023"},
  { code: 'CS 331', date: "Spring 2023"},
  { code: 'CS 370', date: "Spring 2023"},
  { code: 'CS 381', date: "Winter 2023"},
  { code: 'CS 271', date: "Winter 2023"},
  { code: 'CS 362', date: "Winter 2023"},
  { code: 'CS 361', date: "Fall 2022"},
  { code: 'CS 344', date: "Fall 2022"},
  { code: 'CS 340', date: "Fall 2022"},
  { code: 'CS 290', date: "Spring 2022" },
  { code: 'CS 271', date: "Winter 2022" },
  { code: 'CS 261', date: "Fall 2021" },
  { code: 'CS 162', date: "Spring 2021" },
  { code: 'CS 161', date: "Winter 2021" },
]

const classData = []
var blogEntries = []

async function getClassData() {
  for (let i = 0; i < classesTaken.length; i++) {
    let data = await crawler.LookForCode(classesTaken[i].code)
    classData.push({
      title: data.title,
      desc: data.desc,
      code: classesTaken[i].code,
      date: classesTaken[i].date
    })
  }

  console.log("Finished loading class data.")
}

getClassData()
MDParser.getBlogEntries(fs, blogEntries)

app.get('/', (req, res) => {
  res.status(200).render('index')
})

app.get('/projects', (req, res) => {
  res.status(200).render('projects')
})

app.get('/experience', (req, res) => {
  res.status(200).render('experience', {
    classes: classData
  })
})

app.get('/blog', (req, res) => {
  res.status(200).render('blog', {
    blogs: blogEntries
  })
})

app.get('/resume', (req, res) => {
  res.status(200).render('resume')
})

app.use(express.static('public'))

app.get('*', function (req, res) {
  //res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, function () {
  console.log("== Server is listening on port", port)
});
