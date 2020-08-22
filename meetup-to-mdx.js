const fs = require('fs')
const slugify = require('slugify')

const outputTalksDir = 'talks'

if (!fs.existsSync(outputTalksDir)) {
  fs.mkdirSync(outputTalksDir)
}

if (process.argv.length <= 2) {
  console.log('Missing argument: use node meetup-to-mdx.js <path-to-talks.json>')
  return
}

const rawTalks = fs.readFileSync(process.argv[2])
const talks = JSON.parse(rawTalks)

const getTalkContent = (talk) => {
  const title = talk.title.replace(/"/g, '\\"')
  return `---
edition: ${talk.edition}
meetupLink: '${talk.meetupLink}'
title: "${title}"
---

${talk.content}`
}

for (const talk of talks) {
  const title = slugify(talk.title, {
    lower: true,
    strict: true
  })

  fs.writeFile(`${outputTalksDir}/${talk.date}_${title}.mdx`, getTalkContent(talk), (err) => {
    if (err) return console.log(err)
  })
}
