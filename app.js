// app.js
// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
// const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose') // 載入 mongoose
const bodyParser = require('body-parser')// 引用 body-parser
const Restaurant = require('./models/restaurant') // 載入 model
const methodOverride = require('method-override')



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

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// create
app.post('/restaurants', (req, res) => {
  const addItem = req.body
  return Restaurant.create({
    name: addItem.name,
    category: addItem.category,
    image: addItem.image,
    location: addItem.location,
    phone: addItem.phone,
    google_map: addItem.google_map,
    rating: addItem.rating,
    description: addItem.description,
  })
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

// read
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const editItem = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = editItem.name,
        restaurant.category = editItem.category,
        restaurant.image = editItem.image,
        restaurant.location = editItem.location,
        restaurant.phone = editItem.phone,
        restaurant.google_map = editItem.google_map,
        restaurant.rating = editItem.rating,
        restaurant.description = editItem.description,
        restaurant.save()
    })
    .then(() => { res.redirect(`/restaurants/${id}`) })
    .catch(error => console.log(error))
})

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurants => restaurants.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()

  const noResultNotice = `你搜尋的${keyword}沒有符合的餐廳`
  const emptySearchNotice = '請輸入想搜尋的餐廳或分類'

  if (keyword.length === 0) {
    res.render('index', { notice: emptySearchNotice })
    return
  }

  return Restaurant.find({
    $or: [
      { name: { $regex: `${keyword}`, $options: 'i' } },
      { name_en: { $regex: `${keyword}`, $options: 'i' } },
      { category: { $regex: `${keyword}`, $options: 'i' } }
    ]
  })
    .lean()
    .then(restaurants => {
      if (restaurants.length === 0) {
        res.render('index', { keyword: keyword, notice: noResultNotice })
      } else {
        res.render('index', { restaurants: restaurants, keyword: keyword })
      }
    })
    .catch(error => console.log(error))

})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})