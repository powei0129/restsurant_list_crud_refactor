const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant') // 載入 model

router.get('/new', (req, res) => {
  return res.render('new')
})

// create
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
    .then(() => { res.redirect(`/${id}`) })
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurants => restaurants.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router