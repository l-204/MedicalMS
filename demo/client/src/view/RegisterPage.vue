<template>
    <div class="RegisterContainer">
        <img class="RegisterBackground" src="../assets/Background.jpg">
        <div class="RegisterForm">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
                <p class="title">注&emsp;册</p>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"
                        prefix-icon="el-icon-unlock"> </el-input>
                </el-form-item>
                <el-form-item prop="checkpassword">
                    <el-input type="password" v-model="ruleForm.checkpassword" autocomplete="off" placeholder="确认密码"
                        prefix-icon="el-icon-unlock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Register('ruleForm')">注 册</el-button>
                </el-form-item>
                <p style="text-align: right;margin-right:100px">已有账号？立即前往<router-link to="/login">登录</router-link></p>
            </el-form>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        let validateUsername = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空'));
            } else {
                callback();
            }
        };
        let validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkpassword !== '') {
                    this.$refs.ruleForm.validateField('checkpassword');
                }
                callback();
            }
        };
        let validatePassword2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: '',
                password: '',
                checkpassword: '',
            },
            message: '',
            rules: {
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                checkpassword: [
                    { validator: validatePassword2, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        Register(formName) {
            const userInfo = JSON.stringify({ username: this.ruleForm.username, password: this.ruleForm.password, })
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    fetch('http://localhost:3000/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: userInfo
                    })
                        .then(res => {
                            if (res.status === 200) {
                                this.message = '注册成功';
                                this.$message({
                                    showClose: true,
                                    message: this.message,
                                    type: 'success'
                                });
                                this.$router.push('/login')
                            } else {
                                res.json().then(data => {
                                    this.message = data.message
                                    this.$message({
                                        showClose: true,
                                        message: this.message,
                                        type: 'error'
                                    });
                                });
                            }
                        })
                        .catch(err => console.error(err));
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style>
.RegisterContainer {
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

.RegisterBackground {
    display: flex;
    width: 500px;
    height: 500px;
}

.RegisterForm {
    display: flex;
    height: 500px;
}

.RegisterForm .el-form {
    width: 500px;
    margin-top: 30px;
}

.RegisterForm .el-form .title {
    font-size: 26px;
    font-family: 'Microsoft YaHei';
}

.RegisterForm .el-form .el-button {
    width: 100%;
    border-radius: 20px;
}

.RegisterForm .el-form .el-form-item {
    width: 300px;
    margin: 0 100px;
    padding: 20px 0;
}

/* 设置边框样式 */
.RegisterForm .el-form .el-input__inner {
    border-top: none;
    border-right: none;
    border-left: none;
    border-radius: 0;
    /* 设置底部边框 */
    border-bottom: 1px solid #e6e6e6;
}
</style>
  