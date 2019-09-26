// page/component/details/details.js
const app = getApp()
Page({
  data: {
    snakeDetail: {
      //id, name, price, imagel,inventory, detail, parameter, guarantee
      id: null,
      name: '',
      price: null,
      image: '',
      inventory: null, //存货量
      detail: '', //商品详情x z
      parameter: '', //产品参数
      guarantee: '' //售后保障
    },
    /*snackCart: {
      name: '',
      weight: null,
      price: '',
      image: '',
      count: null,
      _openid: '',
      selected: false
    },*/
    addId: null,
    num: 1, //选择购买的数量
    totalNum: 0,
    hasCarts: false,
    curIndex: 0, //详情，参数，售后
    show: false,
    scaleCart: false
  },

  onLoad: function(options) {
    var that = this
    //console.log('Option：', options.name)
    that.onQuery(options.name);
    //this.onQueryCartNumber();
    //that.addToCart();
  },

  //查询购物车数据数量
  onQueryCartNumber: function() {
    const db = wx.cloud.database()
    db.collection('SnacksCart').count({
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          totalNum: res.total
        })
        console.log('StartTotalNum：', this.data.totalNum)
        /*wx.showToast({
          title: '查询数据库数量成功',
        })*/
        console.log('[数据库SnacksCart] [查询数量] 成功，记录 count：' + res.total)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询数据库数量失败'
        })
        console.error('[数据库SnacksCart] [查询数量] 失败：', err)
      }
    })
  },

  //按名字查询数据
  onQuery: function(xname) {
    var that = this
    console.log('Xname：', xname)
    const db = wx.cloud.database()
    // 查询当前用户名字为name的SnacksDetail数据库
    db.collection('SnacksDetail').where({
      name: xname
    }).get({
      success: res => {
        console.log('Xname count：', res.data)
        that.setData({
          snakeDetail: {
            //id, name, price, imagel,inventory, detail, parameter, guarantee
            id: res.data[0]._id,
            name: res.data[0].name,
            price: res.data[0].price,
            image: res.data[0].image,
            inventory: res.data[0].inventory, //存货量
            detail: res.data[0].detail, //商品详情x z
            parameter: res.data[0].parameter, //产品参数
            guarantee: res.data[0].guarantee, //售后保障
          }
        })
        console.log('[数据库SnacksDetail] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库SnacksDetail] [查询记录] 失败：', err)
      }
    })
  },

  //添加数据到购物车
  onAdd: function() {
    const that = this
    const db = wx.cloud.database()
    db.collection('SnacksCart').where({
      name: this.data.snakeDetail.name
    }).get({
      success: res => {
        //如果数据不存在
        if (res.data.length == 0) {
          //const result = db.collection("SnacksCart").count()
          //let n = result.total;
          //console.log(num);
          //插入数据库新数据
          //console.log('111add：', n)
          db.collection('SnacksCart').add({
            data: {
              name: this.data.snakeDetail.name,
              weight: this.data.snakeDetail.parameter,
              price: this.data.snakeDetail.price,
              image: this.data.snakeDetail.image,
              count: this.data.num,
              selected: false
            },
            success: ress => {
              // 在返回结果中会包含新创建的记录的 _id
              that.setData({
                addId: ress._id
              })
              wx.showToast({
                title: '添加购物车成功',
                duration: 2000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: 'success' //图标，支持"success"、"loading"  
              })
              console.log('[数据库SnacksCart] [新增记录] 成功，记录 _id: ', ress._id)
              that.onQueryCartNumber();
            },
            fail: errr => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库SnacksCart] [新增记录] 失败：', errr)
            }
          })
        } else {
          //已存在，获取id
          db.collection('SnacksCart').where({
            name: this.data.snakeDetail.name
          }).get({
            success: ress => {
              that.setData({
                addId: ress.data[0]._id
              })
              console.log('AddID: ', ress.data[0]._id)
              //更新数据库
              console.log('Update：' + this.data.addId + '  xxx:' + this.data.num)
              var num = this.data.num
              num = num + ress.data[0].count
              db.collection('SnacksCart').doc(this.data.addId).update({
                data: {
                  count: num
                },
                success: result => {
                  wx.showToast({
                    title: '添加购物车成功',
                    duration: 2000, //显示时长
                    mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                    icon: 'success' //图标，支持"success"、"loading"  
                  })
                  //console.log('update：', result.updated)
                  that.onQueryCartNumber();
                },
                fail: error => {
                  icon: 'none',
                  console.error('[数据库SnacksCart] [更新记录] 失败：', error)
                }
              })
            },
            fail: errr => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })
              console.error('[数据库SnacksCart] [查询记录] 失败：', errr)
            }
          })
        }
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

  decCount() {
    let num = this.data.num;
    if (num > 0)
      num--;
    this.setData({
      num: num
    })
  },

  addCount() {
    let num = this.data.num;
    if (num < this.data.snakeDetail.inventory)
      num++;
    this.setData({
      num: num
    })
  },

  addToCart: function() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout(function() {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function() {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          //totalNum: num + total
        })
        console.log('CartTotalNum：', self.data.totalNum)
        self.onAdd();
        //self.onQueryCartNumber();
      }, 200)
    }, 300)


  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }

})