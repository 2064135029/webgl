<template>
    <div style="text-align: left">
        <van-nav-bar
                title="商品展示"
        />
        <van-card
                num="200"
                tag="新品"
                price="40.00"
                desc="经典磨砂壶"
                title="新品茶壶"
                :thumb="chahu"
                @click="clickThumb"
                origin-price="70.00"
        />
        <van-card
                num="1000"
                price="1400.00"
                desc="商务必选，品牌的信赖"
                title="西装"
                :thumb="xizhuang"
                @click="clickThumb2"
                origin-price="1800.00"
        />
    </div>
</template>

<script>
    export default {
        name: "menu",
        data(){
          return {
              chahu: require('../assets/chahu.jpg'),
              xizhuang: require('../assets/xizhaung.jpg')
          }
        },
        methods: {
            // 点击图片
            clickThumb: function () {
                this.$router.push("detail")
            },
            clickThumb2: function () {
                this.$router.push("model")
            }
        }
    }
</script>

<style scoped>

</style>
