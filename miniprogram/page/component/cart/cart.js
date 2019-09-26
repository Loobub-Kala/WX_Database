// page/component/cart/cart.js
Page({
  data: {
    carts: [], // 购物车列表
    sel: [], //选择状态
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认不全选
    /*snackCart: {
      id: null,
      name: '',
      weight: null,
      price: '',
      image: '',
      count: null,
      selected: null
    }*/
  },
  //?name={{snakeDetail.name}}&weight={{snakeDetail.parameter}}&price={{snakeDetail.price}}&image={{snakeDetail.image}}&count={{num}}&selected=false
  onReady() {
    this.onGetCart();
    this.getTotalPrice();
  },

  onShow() {
    this.onGetCart();
    this.getTotalPrice();

    //默认全不选
    const sel = this.data.sel;
    const carts = this.data.carts;
    console.log('ShowSel: ', this.data.sel)
    for (let i in sel) {
      if (sel[i]) {
        this.onUpdataSelected(carts[i]._id, false);
      }
    }
  },

  //获取数据库SnacksCart里的数据
  onGetCart: function() {
    var result = ''
    const db = wx.cloud.database()
    db.collection('SnacksCart').get({
      success: res => {
        result = res.data
        //var nArr = []
        var s = []
        for (let i in result) {
          //nArr.push(result[i]);
          s.push(false);
        }
        this.onHasList();
        this.setData({
          carts: result,
          sel: s
        })
        console.log('onGetCart_Sel: ', this.data.sel)
        console.log('Result: ', this.data.carts)
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

  //得到数据库的数据数目
  onHasList: function() {
    const sel = this.data.sel
    let hasList = this.data.hasList
    if (sel.length == 0)
      hasList = false
    else
      hasList = true

    this.setData({
      hasList: hasList
    })
    console.log('onHasList：' + this.data.hasList + '  sel:' + sel.length)
    /*let hasList = null
    const db = wx.cloud.database()
    db.collection('SnacksCart').count({
      success: res => {
        //数据库是否有数据
        if (res.total == 0)
          hasList = false
        else
          hasList = true
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          totalNum: res.total,
          hasList: hasList
        })
        console.log('[数据库SnacksCart] [查询数量] 成功，记录 count：' + res.total)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询数据库数量失败'
        })
        console.error('[数据库SnacksCart] [查询数量] 失败：', err)
      }
    })*/
  },

  //修改数据库数量
  onUpdataCount: function(upId, upCount) {
    const db = wx.cloud.database()
    db.collection('SnacksCart').doc(upId).update({
      data: {
        count: upCount
      },
      success: res => {
        console.log('UpCount: ', upCount)
        this.onGetCart();
        this.getTotalPrice();
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库SnacksCart] [更新记录] 失败：', err)
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
        console.log('UpSelected: ', upSelected)
        this.onGetCart();
        this.getTotalPrice();
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库SnacksCart] [更新记录] 失败：', err)
      }
    })
  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let sel = this.data.sel;
    let selectAllStatus = this.data.selectAllStatus;
    const selected = sel[index];
    sel[index] = !selected;
    this.setData({
      sel: sel
    })
    //全选状态下点击取消
    if (selectAllStatus && selected) {
      this.setData({
        selectAllStatus: false
      })
    }

    //非全选状态下变成全选
    if (!selectAllStatus) {
      for (let i in sel) {
        selectAllStatus = sel[i]
        if (!sel[i]) {
          break;
        }
      }
      this.setData({
        selectAllStatus: selectAllStatus
      })
    }

    this.getTotalPrice();
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let sel = this.data.sel;
    //console.log('Sell: ', sel)
    for (let i in sel) {
      sel[i] = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      sel: sel
    });
    console.log('SelectAllStatus: ', selectAllStatus)
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    const xid = e.currentTarget.dataset.id;
    const sel = this.data.sel;
    //this.onGetCart();
    const db = wx.cloud.database()
    db.collection('SnacksCart').doc(xid).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        sel.splice(index, 1);
        this.setData({
          sel: sel
        })
        console.log('[数据库SnacksCart] [删除记录] 成功，记录sel：', sel)

        this.onGetCart();
        this.getTotalPrice();
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

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let upCount = carts[index].count;
    let upId = carts[index]._id;
    upCount = upCount + 1;
    //不判断库存
    //if(upCount>=carts[index])
    this.onUpdataCount(upId, upCount);
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let upCount = carts[index].count;
    let upId = carts[index]._id;
    if (upCount <= 1) {
      return false;
    }
    upCount = upCount - 1;
    this.onUpdataCount(upId, upCount);
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let sel = this.data.sel;
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (sel[i] == true) { // 判断选中才会计算价格
        total += carts[i].count * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  skipOrders: function() {
    var that = this;
    const sel = this.data.sel;
    const carts = this.data.carts;
    var number = 0;
    for (let i in sel) {
      if (sel[i]) {
        number++;
        that.onUpdataSelected(carts[i]._id, true);
      }
    }
    if (number > 0) {
      wx.navigateTo({
        url: '../orders/orders',
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '无支付项'
      })
      console.error('[支付] [待支付项] 失败')
    }
  }
})