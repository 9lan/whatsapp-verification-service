const express = require('express')
const morgan = require('morgan')

const { client } = require('./configs/wa-client')
const { UserRoutes } = require('./routes')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/user', UserRoutes)

app.listen(4000, async () => {
  await client.initialize().then(() => {
    console.log('app is running...')
  }).catch(err => {
    console.log('app crash', err.message)
  })
})
