<template>
    <div class="content">

        <p style="margin-top: 20px">登录</p>
        <van-cell-group class="login-content">
            <van-field
                    v-model="username"
                    required
                    clearable
                    label="用户名"
                    placeholder="请输入用户名"
            />

            <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    required
            />

        </van-cell-group>

        <van-button type="info" size="small" class="login-button" @click="login"
                    :loading="loginLoading">登录
        </van-button>
    </div>
</template>

<script>
    // import {login} from "../api/nc/api";
    import {Dialog} from 'vant';

    export default {
        name: 'login',
        component: {},
        data: function () {
            return {
                username: 'admin',
                password: '',
                loginLoading: false
            };
        },
        components: {},
        created: function () {
        },
        methods: {
            login: function () {
                if (this.username === 'admin' && this.password === 'admin123') {
                    this.$router.push("menu")
                } else {
                    Dialog({message: '用户名或密码错误'});
                }

            }
        }
    }
</script>
<style scoped>
    .content {
        background: white;
    }

    .login-content {
        margin-top: 25%;
    }

    .login-button {
        width: 30%;
        margin-top: 30px;
        background: #007AFF;
        vertical-align: middle;
        color: white;
        margin-bottom: 20px;
    }

    .setBtn {
        vertical-align: middle;
        font-size: 15px;
    }

    .button-content {
        margin-top: 10%;
        margin-bottom: 20px;
    }
</style>
