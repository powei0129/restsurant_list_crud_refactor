const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurants = require('../../restaurant.json')
const db = require('../../config/mongoose')

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