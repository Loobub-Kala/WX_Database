// page/component/user/user.js
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{}
  },
  onLoad(){
    this.onGetData();
  },
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })

    this.onGetData();
  },
  /**
   * 发起支付请求
   */
  payOrders(){
    //
  },

  onGetData: function () {
    const db = wx.cloud.database()
    db.collection('SnacksWait').get({
      success: res => {
        this.setData({
          orders: res.data
        })
        console.log('DetailResult: ', this.data.orders)
        console.log('[数据库SnacksWait] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库SnacksWait] [查询记录] 失败：', err)
      }
    })
  }
})