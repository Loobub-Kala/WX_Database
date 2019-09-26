// page/component/search/search.js
let timeId = null;
Page({
  data: {
    hot: ['胡萝卜', '彩虹蛋糕', '糖炒栗子'], //热点推荐
    hosDetail: [],
    result: [], //搜索结果
    history: [],
    showKeywords: false,
    keywords: [], //关键字搜索
    value: '',
    showResult: false,
  },
  cancelSearch() {
    this.setData({
      showResult: false,
      showKeywords: false,
      value: ''
    })
  },
  searchInput(e) {
    const that = this;
    const value = e.detail.value;
    console.log("Input2:" + e.detail.value)
    if (!value) {
      this.setData({
        showKeywords: false
      })
    } else {
      console.log("InputKeywords:" + this.data.showKeywords)
      if (!this.data.showKeywords) {
        timeId && clearTimeout(timeId);
        timeId = setTimeout(() => {
          this.setData({
            showKeywords: true
          })
        }, 1)
      }
      console.log("Input:" + value)
      that.onGetData(value);
    }
  },
  keywordHandle(e) {
    const text = e.target.dataset.text;
    this.setData({
      value: text,
      showKeywords: false,
      showResult: true
    })
    console.log("keyWord：" + text)
    this.onGetData(text);
    this.historyHandle(text);
  },
  historyHandle(value) {
    let history = this.data.history;
    const idx = history.indexOf(value);
    if (idx === -1) {
      // 搜索记录只保留8个
      if (history.length > 7) {
        history.pop();
      }
    } else {
      history.splice(idx, 1);
    }
    history.unshift(value);
    wx.setStorageSync('history', JSON.stringify(history));
    this.setData({
      history
    });
  },
  onLoad() {
    const history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        history: JSON.parse(history)
      })
      console.log(this.data.history);
    }
  },

  onGetData: function(data) {
    console.log("Data " + data)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('SnacksDetail').where(_.or([{
        type: data
      },
      {
        name: data
      }
    ])).get({
      success: res => {
        this.setData({
          result: res.data
        })
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