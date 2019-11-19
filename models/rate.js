export class Rate {
    static rateOffImg = `rate_off.png`
    static rateImg1 = `rate1.png`
    static rateImg2 = `rate2.png`
    static rateImg3 = `rate3.png`
    static rateImg4 = `rate4.png`
    static rateImg5 = `rate5.png`

    static rateText1 = `不佳`
    static rateText2 = `一般`
    static rateText3 = `不错`
    static rateText4 = `满意`
    static rateText5 = `很棒`

    static rateColor1 = `#C9C900`
    static rateColor2 = `#FF8B2B`
    static rateColor3 = `#FC4E52`

    static getRateOnInfo(rateVal) {
        let rateInfo = {
            rateImg: "",
            rateText: "",
            rateColor: ""
        }
        switch (rateVal) {
            case 1:
                rateInfo.rateImg = Rate.rateImg1
                rateInfo.rateText = Rate.rateText1
                rateInfo.rateColor = Rate.rateColor1
                break
            case 2:
                rateInfo.rateImg = Rate.rateImg2
                rateInfo.rateText = Rate.rateText2
                rateInfo.rateColor = Rate.rateColor1
                break
            case 3:
                rateInfo.rateImg = Rate.rateImg3
                rateInfo.rateText = Rate.rateText3
                rateInfo.rateColor = Rate.rateColor1
                break
            case 4:
                rateInfo.rateImg = Rate.rateImg4
                rateInfo.rateText = Rate.rateText4
                rateInfo.rateColor = Rate.rateColor2
                break
            case 5:
                rateInfo.rateImg = Rate.rateImg5
                rateInfo.rateText = Rate.rateText5
                rateInfo.rateColor = Rate.rateColor3
                break
        }
        return rateInfo
    }
}