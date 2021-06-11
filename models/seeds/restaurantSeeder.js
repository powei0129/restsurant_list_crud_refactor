const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurants = require('../../restaurant.json')


mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  restaurants.results.forEach(item => {
    // console.log(item.name)
    Restaurant.create({
      name: item.name,
      category: item.category,
      image: item.image,
      location: item.location,
      phone: item.phone,
      google_map: item.google_map,
      rating: item.rating,
      description: item.description,
    })
  })
})