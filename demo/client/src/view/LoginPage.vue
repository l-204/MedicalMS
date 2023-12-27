<template>
    <div class="LoginContainer">
        <img class="LoginBackground" src="../assets/Background.jpg">
        <div class="LoginForm">
            <el-form :model="ruleForm" status-icon ref="ruleForm">
                <p class="title">登&emsp;录</p>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"
                        prefix-icon="el-icon-unlock"> </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="Login('ruleForm')">登 录</el-button>
                </el-form-item>
                <p style="text-align: right;margin-right:100px;">还没账号？立即前往<router-link to="/register">注册</router-link></p>
            </el-form>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            ruleForm: {
                username: '',
                password: '',
            },
            message: '',
        }
    },
    methods: {
        Login() {
            const userInfo = JSON.stringify({ username: this.ruleForm.username, password: this.ruleForm.password })
            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: userInfo
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then((data) => {
                            // 将响应数据返回给data(用删去密码代替加密)
                            delete data.userInfo.password
                            const token = data.token;
                            // 更新localstorage数据
                            const userInfo = JSON.stringify(data.userInfo)
                            localStorage.setItem('token', token);
                            localStorage.setItem('userInfo', userInfo);
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'success'
                            });
                            this.$router.push('/home')
                        });
                    } else {
                        res.json().then(data => {
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'error'
                            });
                        });

                    }
                })
                .catch(err => console.error(err));
        },
    },
};
</script>

<style>
.LoginContainer {
    position: fixed;
    display: flex;
    background-color: #fff;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    width: 1000px;
    height: 500px;
    text-align: center;
    left: 18%;
    top: 18%;
}

.LoginBackground {
    display: flex;
    width: 500px;
    height: 500px;
}

.LoginForm {
    display: flex;
    height: 500px;
}

.LoginForm .el-form {
    width: 500px;
    margin-top: 60px;
}

.LoginForm .el-form .title {
    font-size: 26px;
    font-family: 'Microsoft YaHei';
}

.LoginForm .el-form .el-button {
    width: 100%;
    border-radius: 20px;
}

.LoginForm .el-form .el-form-item {
    width: 300px;
    margin: 0 100px;
    padding: 20px 0;
}

/* 设置边框样式 */
.LoginForm .el-form .el-input__inner {
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
    /* 设置底部边框 */
    border-bottom: 1px solid #e6e6e6;
}
</style>
  