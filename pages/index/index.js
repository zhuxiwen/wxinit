import auth from '../../doAuth'
import store from '../../doStore'
import create from '../../utils/create'
import config from '../../config'
import WXP from '../../utils/wxp'
const {
  regeneratorRuntime
} = global

const app = getApp()

create(store, {

  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  data: {
    motto: null,
    userInfo: null,
    hasUserInfo: null,
    canIUse: null,
    b: {
      arr: []
    },
    firstName: null,
    lastName: null,
    pureProp: null,
    location:{}
  },

  onShow() {
    this.getLocation()
    this.update()
  },

  async onLoad() {

    // 测试WXP , 使用 await 可以优雅的处理的业务逻辑
    await this.WxpAsyncAwait()
    // 等待 WxpAsyncAwait 执行完毕后 , 再执行WxpThenCatch
    this.WxpThenCatch()
    

    if (app.globalData.userInfo) {
      this.update({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {

      app.userInfoReadyCallback = res => {
        this.store.data.userInfo = res.userInfo
        this.store.data.hasUserInfo = true
        this.update()
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.data.userInfo = res.userInfo
          this.store.data.hasUserInfo = true
          this.update()
        }
      })
    }

    setTimeout(() => {
      // this.store.data.motto = 'Hello Store222'
      // this.store.data.b.arr.push({ name: 'ccc' })
      this.update({
        motto: 'Hello Westore',
        [`b.arr[${this.store.data.b.arr.length}]`]: {
          name: '数组项2(将被删除)'
        }
      })

    }, 4000)

    setTimeout(() => {

      this.store.data.b.arr.splice(1, 1)
      this.update()

    }, 6000)

    setTimeout(() => {
      //测试函数属性
      this.store.data.firstName = 'DNT'
      this.update()

    }, 8000)

    setTimeout(() => {
      this.store.data.fullName = function () {
        return '成功修改 fullName 函数'
      }
      //测试函数属性
      this.update({
        firstName: 'lei',
      })
    }, 10000)

    setTimeout(() => {
      this.store.data.pureProp = '成功修改 Pure Component prop'
      this.update()
    }, 12000)
  },

  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.store.data.userInfo = e.detail.userInfo
    this.store.data.hasUserInfo = true
    this.update()
  },
  onRandom(evt) {
    this.store.data.pureProp = evt.detail.rd
    this.update()
  },
  async getLocation(e) {
    auth('getLocation',{});
    try {
      let resp = await WXP.getLocation()
      this.store.data.location = resp;
      this.update();
      console.log(this.store.data.location)
    } catch (errorMesg) {
      console.log('fail信息:', errorMesg)
    }
  },
  WxpThenCatch() {
    WXP.request({
      url: config.url.bd
    }).then(resp => {
      console.log('再执行WxpThenCatch:', resp)
    }).catch(errorMesg => {
      console.log('fail信息:', errorMesg)
    })
  },
  async WxpAsyncAwait() {
    try {
      let resp = await WXP.request({
        url: config.url.bd
      })
      console.log('先执行WxpAsyncAwait:', resp)
    } catch (errorMesg) {
      console.log('fail信息:', errorMesg)
    } finally {
      console.log('complete一定会执行')
    }
  }
})