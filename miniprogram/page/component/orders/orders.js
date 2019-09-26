// page/component/orders/orders.js
Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: []
    //{id:1,title:'新鲜芹菜 半斤',image:'/image/s5.png',num:4,price:0.01},
    //{id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03}

  },

  onReady() {
    this.getTotalPrice();
  },

  onShow: function() {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
    this.onGetOrdersCart();
  },

  onUnload: function() {
    var that = this;
    const orders = this.data.orders;
    for (let i in orders) {
      that.onUpdataSelected(orders[i]._id, false);
    }
  },

  //获取数据库SnacksCart里的数据
  onGetOrdersCart: function() {
    var result = ''
    const db = wx.cloud.database()
    db.collection('SnacksCart').where({
      selected: true
    }).get({
      success: res => {
        result = res.data
        this.setData({
          orders: result
        })
        console.log('Result: ', this.data.orders)
        console.log('[数据库SnacksCart] [查询记录] 成功: ', res)
        this.getTotalPrice();
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

  //修改数据库选中状态
  onUpdataSelected: function(upId, upSelected) {
    const db = wx.cloud.database()
    db.collection('SnacksCart').doc(upId).update({
      data: {
        selected: upSelected
      },
      success: res => {
        //console.log('UpSelected: ', upSelected)
        console.log('Unload: ', this.data.orders)
        this.onGetOrdersCart();
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库SnacksCart] [更新记录] 失败：', err)
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].count * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    const hasAddress = this.data.hasAddress
    if (hasAddress) {
      this.onAddPay();
      wx.showToast({
        title: '支付系统已屏蔽，等待发货',
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
        icon: 'success' //图标，支持"success"、"loading"  
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '未填写地址，是否前往填写？',
        //text: 'center',
        complete() {
          wx.navigateTo({
            url: '../address/address'
          })
        }
      })
    }
  },

  //存入发货等待数据库SnacksWait
  onAddPay: function() {
    const orders = this.data.orders
    const address = this.data.address
    const db = wx.cloud.database()
    //存发货的信息数组
    for (let i in orders) {
      //计算价格money
      let m = orders[i].price * orders[i].count
      //插入数据库新数据
      db.collection('SnacksWait').add({
        data: {
          name: orders[i].name,
          weight: orders[i].parameter,
          image: orders[i].image,
          count: orders[i].count,
          money: m,
          status: '等待发货',
          addressee_name: address.name,
          addressee_phone: address.phone,
          addressee_detail: address.detail
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          console.log('[数据库SnacksWait] [新增记录] 成功，记录 _id: ', res._id)

          //删除已经支付的数据
          db.collection('SnacksCart').doc(orders[i]._id).remove({
            success: res => {
              console.log('[数据库SnacksCart] [删除记录] 成功')
              //删除成功返回上级购物车界面
              wx.navigateBack({
                delta: 1
              })
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库SnacksCart] [删除记录] 失败：', err)
            }
          })
        },
        fail: errr => {
          wx.showToast({
            icon: 'none',
            title: '查询数据库数量失败'
          })
          console.error('[数据库SnacksWait] [查询数量] 失败：', errr)
        }
      })
    }
  }
})