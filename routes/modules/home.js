// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model
const Restaurant = require('../../models/restaurant')
// 定義首頁路由

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' }) // desc
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/search', (req, res) => {
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
// 匯出路由模組
module.exports = router