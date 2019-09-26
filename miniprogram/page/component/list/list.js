// page/component/list/list.js
Page({
  data:{
    list:[],
  },
  
  onShow:function(){
    // 页面显示
    this.onGetData();
  },
  
  onGetData: function () {
    const db = wx.cloud.database()
    db.collection('SnacksDetail').where({
      type: '果味'
    }).get({
      success: res => {
        this.setData({
          list: res.data
        })
        console.log('DetailResult: ', this.data.list)
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