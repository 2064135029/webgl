<template>
    <div>
        <van-nav-bar
                title="商品展示"
        />
        <van-card
                num="2"
                tag="新品"
                price="2.00"
                desc="描述信息"
                title="商品标题"
                thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
                @click-thumb="clickThumb"
                origin-price="10.00"
        />
    </div>
</template>

<script>
    export default {
        name: "menu",
        methods: {
            // 点击图片
            clickThumb: function () {
                this.$router.push("detail")
            }
        }
    }
</script>

<style scoped>

</style>
