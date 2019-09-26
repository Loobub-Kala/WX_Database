// page/component/index/index.js
Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    news: [], // 购物车列表
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    snacksNew:{
    }
  },

  onShow(){
    this.onGetNew();
  },

  //获取数据库SnacksCart里的数据
  onGetNew: function () {
    const db = wx.cloud.database()
    db.collection('SnacksNew').get({
      success: res => {
        this.setData({
          news: res.data
        })
        console.log('Result: ', this.data.news)
        console.log('[数据库SnacksCart] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库SnacksCart] [查询记录] 失败：', err)
      }
    })
  },
})