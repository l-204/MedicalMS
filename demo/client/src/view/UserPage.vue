<template>
    <div>
        <!-- 调用菜单组件 -->
        <MenuPage>
            <template v-slot:default>
                <!-- 这里是需要显示在 el-main 中的内容 -->
                <div class="Container">
                    <div class="UserContent">
                        <div class="head">
                            <el-button @click="dialogFormVisible = true" size="medium" type=""
                                icon="el-icon-edit">修改信息</el-button>
                        </div>

                        <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
                            <el-form :model="form" :rules="rules" ref="form">
                                <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                                    <el-input v-model="form.username" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                                    <el-radio-group v-model="form.gender">
                                        <el-radio label="男"></el-radio>
                                        <el-radio label="女"></el-radio>
                                        <el-radio label="保密"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                                    <el-input v-model="form.email" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" prop="phone_number" :label-width="formLabelWidth">
                                    <el-input v-model="form.phone_number" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="身份" prop="identity" :label-width="formLabelWidth">
                                    <el-input disabled v-model="form.identity" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="工号" prop="job_number" :label-width="formLabelWidth">
                                    <el-input v-model="form.job_number" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="Update(form)">确 定</el-button>
                            </div>
                        </el-dialog>

                        <div class="table">
                            <el-descriptions :contentStyle="rowCenter" :labelStyle="rowCenter" :column="1" border>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-user"></i> 用户名</template>
                                    {{ userInfo.username }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-male "></i>
                                        <i class="el-icon-female"></i>
                                        性别</template>
                                    {{ userInfo.gender }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-message"></i> 邮箱</template>
                                    {{ userInfo.email }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-mobile"></i> 联系方式</template>
                                    {{ userInfo.phone_number }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-paperclip"></i> 身份</template>
                                    {{ userInfo.identity }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-price-tag"></i> 工号</template>
                                    {{ userInfo.job_number }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-time"></i> 注册时间</template>
                                    {{ userInfo.created_at }}
                                </el-descriptions-item>
                                <el-descriptions-item label>
                                    <template slot="label"><i class="el-icon-time"></i> 上一次登录时间</template>
                                    {{ userInfo.last_login_at }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </div>
                </div>
            </template>
        </MenuPage>
    </div>
</template>

<script>
import MenuPage from '../components/MenuPage.vue'
import moment from 'moment';
export default {
    components: { MenuPage },
    data() {
        return {
            userInfo: {},
            rowCenter: {
                "text-align": "center",
                "padding": "20px 0"
            },
            dialogFormVisible: false,
            formLabelWidth: '120px',
            form: {
                user_id: '',
                username: '',
                gender: '',
                email: '',
                phone_number: '',
                identity: '',
                job_number: ''
            },
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                email: [
                    { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
                ],
                phone_number: [
                    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式有误', trigger: 'blur' }
                ],
                job_number: [
                    { pattern: /^5013\d{4}$/, message: '工号格式：5013+4位编号', trigger: 'blur' },
                ],
            }
        }

    },

    methods: {
        Update() {
            // 规则校验
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 符合校验规则则关闭弹窗
                    this.dialogFormVisible = false
                    // 保存修改信息并发送请求
                    const form = JSON.stringify(this.form)
                    fetch('http://localhost:3000/api/users/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: form
                    }).then(res => {
                        if (res.status === 200) {
                            res.json().then(data => {
                                // 将响应数据返回给data
                                delete data.password;
                                this.userInfo = data;
                                // 将时间格式化
                                this.userInfo.created_at = moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')
                                this.userInfo.last_login_at = moment(data.last_login_at).format('YYYY-MM-DD HH:mm:ss')
                                // 更新localstorage数据
                                const userInfo = JSON.stringify(data)
                                localStorage.setItem('userInfo', userInfo)
                                location.reload();
                            }).catch(err => {
                                console.error(err);
                            });
                        } else {
                            throw new Error('请求失败');
                        }
                    })
                        .catch(err => console.error(err));
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    created() {
        const userInfo = localStorage.getItem('userInfo');
        // 初始化form数据
        this.form = JSON.parse(userInfo)
        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: userInfo
        }).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    // 将响应数据返回给data(用删去密码代替加密)
                    delete data.password;
                    this.userInfo = data;
                    // 将时间格式化
                    this.userInfo.created_at = moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')
                    this.userInfo.last_login_at = moment(data.last_login_at).format('YYYY-MM-DD HH:mm:ss')
                }).catch(err => {
                    console.error(err);
                });
            } else {
                throw new Error('请求失败');
            }
        })
            .catch(err => console.error(err));
    },
}
</script>

<style>
.UserContent .head {
    text-align: right;
    margin-bottom: 30px;
}

.UserContent .el-descriptions__body {
    width: 100%;
    margin: 0 auto;
    font-size: 22px;
}
</style>