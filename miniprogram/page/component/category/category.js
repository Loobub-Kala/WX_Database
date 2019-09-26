// page/component/category/category.js
Page({
  data: {
    category: [{
        name: '果味',
        id: 'guowei',
        banner: '/image/c1.png',
        cate: '果味'
      },
      {
        name: '蔬菜',
        id: 'shucai',
        banner: '/image/c1.png',
        cate: '蔬菜'
      },
      {
        name: '炒货',
        id: 'chaohuo',
        banner: '/image/c1.png',
        cate: '炒货'
      },
      {
        name: '点心',
        id: 'dianxin',
        banner: '/image/c1.png',
        cate: '点心'
      },
      {
        name: '粗茶',
        id: 'cucha',
        banner: '/image/c1.png',
        cate: '粗茶'
      },
      {
        name: '淡饭',
        id: 'danfan',
        banner: '/image/c1.png',
        cate: '淡饭'
      }
    ],
    detail: [],
    curIndex: 0,
    isScroll: false,
    toView: 'guowei',
    name: '果味'
  },

  onShow() {
    var self = this;
    console.log("ShowName:", this.data.name)
    self.onGetData(this.data.name);
  },

  switchTab(e) {
    const self = this
    let name = e.target.dataset.name
    this.setData({
      isScroll: true
    })
    setTimeout(function() {
      self.setData({
        name: e.target.dataset.name,
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    }, 0)
    setTimeout(function() {
      self.setData({
        isScroll: false
      })
    }, 1)
    //name即type
    console.log("Name:", this.data.name)
    console.log("TheName:", name)
    this.onGetData(name);
  },

  onGetData: function(xtype) {
    const db = wx.cloud.database()
    db.collection('SnacksDetail').where({
      type: xtype
    }).get({
      success: res => {
        this.setData({
          detail: res.data
        })
        console.log('DetailResult: ', this.data.detail)
        console.log('[数据库SnacksDetail] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库SnacksDetail] [查询记录] 失败：', err)
      }
    })
  }

})