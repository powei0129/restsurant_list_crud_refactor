const mongoose = require('mongoose') // 載入 mongoose

// mongoose connect
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
// connecting error
db.on('error', () => {
  console.log('mongodb error!')
})
// connecting success
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db