import { Rate } from "../../models/rate";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        rating: {
            type: Number,
            value: 5
        },
        max: {
            type: Number,
            value: 5
        },
        disabled: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        rateOffImg: Rate.rateOffImg,
        rateOnImg: Rate.rateImg5,
        rateText: Rate.rateText5
    },
  //监听数据变化
  observers: {
    'rating': function (value) {
      const rateInfo = Rate.getRateOnInfo(value)
      this.setData({
        rateOnImg: rateInfo.rateImg,
        rateText: rateInfo.rateText
      })
    }
  },

    /**
     * 组件的方法列表
     */
    methods: {
        _handleTap: function(e) {
            if (this.data.disabled) return;
            const { max } = this.data;
            const { num } = e.currentTarget.dataset;
            this.setData({
                rating: max / 5 * num
            })
            const rateVal = this.data.rating
            const rateInfo = Rate.getRateOnInfo(rateVal)
            this.setData({
                rateOnImg: rateInfo.rateImg,
                rateText: rateInfo.rateText
            })
            this.triggerEvent('change', { value: max / 5 * num }, e);
        }
    }
})