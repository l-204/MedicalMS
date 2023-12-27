<template>
    <div>
        <!-- 调用菜单组件 -->
        <MenuPage>
            <template v-slot:default>
                <!-- 这里是需要显示在 el-main 中的内容 -->
                <div class="Container">
                    <div class="SettingContent">
                        <el-row>
                            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                                <div class="rightContent">
                                    <i class="el-icon-key"></i> 权限管理
                                    <el-divider></el-divider><br>
                                    <el-form v-if="identity == '管理员'">
                                        <el-form-item label="选择用户">
                                            <el-select v-model="user" @change=checkRight()>
                                                <el-option v-for="(item, index) in userList" :key="index"
                                                    :value="item.username"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="管理员权限">
                                            <el-switch v-model="isAdmin" @change="confirmRight()"></el-switch>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </template>
        </MenuPage>
    </div>
</template>

<script>
import MenuPage from '../components/MenuPage.vue'
export default {
    components: { MenuPage },
    data() {
        return {
            userList: [],
            user: '',
            id: '',
            username: '',
            identity: '',
            isAdmin: true,
        };
    },
    methods: {
        checkRight() {
            // 根据当前选择的用户来更新isAdmin的状态
            const selectedUser = this.user;
            // 找出当前选择的用户的信息
            const selectedUserInfo = this.userList.find(item => item.username === selectedUser);
            // 获取当前用户id，用于后续更改用户的身份
            this.id = selectedUserInfo.user_id
            // 根据用户身份决定开关状态
            selectedUserInfo.identity == '管理员' ? this.isAdmin = true : this.isAdmin = false
        },
        confirmRight() {
            if (this.isAdmin == false) {
                this.$confirm('确定收回该用户的管理员权限吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.isAdmin = false;
                    this.updateRight()
                    if (this.user == this.username) {
                        this.identity = '普通用户'
                    }
                    this.$message({
                        type: 'success',
                        message: '收回成功!'
                    });
                }).catch(() => {
                    this.isAdmin = true;
                    this.$message({
                        type: 'info',
                        message: '已取消收回'
                    });
                });
            } else {
                this.updateRight()
            }
        },
        updateRight() {
            fetch(`http://localhost:3000/api/setting/${this.id}/${this.isAdmin}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .catch(err => console.error(err));
        }
    },
    created() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.id = userInfo.user_id  //保存当前用户id
        this.user = userInfo.username  //将选择框默认值设为当前用户
        this.username = userInfo.username   //保存当前用户名
        fetch(`http://localhost:3000/api/all/select/${'users'}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                res.json().then(data => {
                    this.userList = data
                    const userData = data.find(item => item.user_id === this.id)
                    // 刷新时重新获取当前用户的身份
                    this.identity = userData.identity
                })
            })
            .catch(err => console.error(err));
    }
}
</script>

<style>
.SettingContent .rightContent {
    background-color: #fff;
    min-height: 200px;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
}
</style>