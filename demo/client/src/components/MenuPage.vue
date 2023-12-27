<template>
    <div>
        <el-container style="border: 1px solid #eee">
            <el-aside :width="isCollapse ? '64px' : '260px'">
                <!-- 垂直导航栏 -->
                <el-menu class="el-menu-vertical-demo" :unique-opened="true" :router="true">
                    <!-- 顶部标题 -->
                    <div class="top">
                        <img class="logo" src="../assets/logo.jpg">
                        <div v-if="!isCollapse" class="title">医疗管理系统</div>
                    </div>
                    <!-- 导航栏主体 -->
                    <template v-for="child1 in menuList">
                        <el-menu-item :index="child1.url" :key="child1.id">
                            <i :class="child1.icon"></i><span slot="title" v-if="!isCollapse">{{
                                child1.name }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>

            <el-container>
                <el-header>
                    <!-- 水平导航栏 -->
                    <div class="horizontal-menu">
                        <!-- 导航栏左侧 -->
                        <div class="left">
                            <!-- 折叠按钮 -->
                            <el-button @click="isCollapse = !isCollapse" type="text"
                                style="font-size: 30px; margin: 0; padding: 0;" icon="el-icon-s-fold"
                                :class="isCollapse ? 'fold' : 'unfold'">
                            </el-button>
                            <!-- 面包屑（目录） -->
                            <el-breadcrumb class="title" separator-class="el-icon-d-arrow-right">
                                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                                <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
                                    <router-link :to="crumb.to">{{ crumb.label }}</router-link>
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <!-- 导航栏右侧 -->
                        <div class="right">
                            <!-- 图标 -->
                            <div class="icon">
                                <!-- 通知 -->
                                <el-popover placement="top-start" title="通知" width="200" trigger="hover"
                                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                                    <el-button slot="reference" size="small" icon="el-icon-message-solid" circle
                                        class="shake"></el-button>
                                </el-popover>
                                <!-- 帮助 -->
                                <el-button size="small" icon="el-icon-question" @click="help" circle></el-button>
                            </div>
                            <!-- 头像 -->
                            <img class="avatar" src="../assets/man.png" v-if="gender == '男'">
                            <img class="avatar" src="../assets/woman.png" v-if="gender == '女'">
                            <img class="avatar" src="../assets/default.png" v-if="gender == '' || gender == '保密'">
                            <!-- 选项 -->
                            <div class="dropdown">
                                <!-- 下拉菜单 -->
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
                                    </span>
                                    <!-- 下拉选项 -->
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item icon="el-icon-refresh-right"
                                            @click.native="logout">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                    </div>
                </el-header>

                <el-main>
                    <slot></slot>
                </el-main>
            </el-container>
        </el-container>

        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        // 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        return {
            gender: userInfo.gender,

            isCollapse: true,
            menuList: [
                {
                    "name": "首页",
                    "id": 1,
                    "url": "/home",
                    "icon": "el-icon-s-home",
                },
                {
                    "name": "个人中心",
                    "id": 2,
                    "url": "/user",
                    "icon": "el-icon-user-solid",
                },
                {
                    "name": "信息管理",
                    "id": 3,
                    "url": "/information",
                    "icon": "el-icon-s-order",
                },
                {
                    "name": "统计分析",
                    "id": 4,
                    "url": "/analysis",
                    "icon": "el-icon-s-data",
                },
                {
                    "name": "系统设置",
                    "id": 5,
                    "url": "/setting",
                    "icon": "el-icon-s-tools",
                },
            ],
        }
    },
    computed: {
        breadcrumbs() {
            const matchedRoutes = this.$route.matched;
            const breadcrumbs = [];

            matchedRoutes.forEach(route => {
                const breadcrumb = {
                    label: route.meta.breadcrumb || route.name,
                    to: route.path
                };

                console.log(breadcrumbs[0])
                if (breadcrumb.label == "首页") return
                else breadcrumbs.push(breadcrumb);
            });
            return breadcrumbs;
        }
    },
    methods: {
        // 执行退出登录操作
        logout() {
            // 清空localStorage中的数据，如用户信息、token等
            localStorage.clear();
            // 退出提示
            this.$message({
                showClose: true,
                message: '退出成功',
                type: 'success'
            });
            // 跳转至登录页面
            this.$router.push('/login');
        },
        // 弹出帮助
        help() {
            this.$alert('这是一段内容', '帮助', {
                confirmButtonText: '确定',
            });
        }
    },
}
</script>

<style>
html,
body {
    /* background-color: #f2fcfe; */
    background-color: #ecf5ff;
    height: 100%;
    overflow: hidden;
}

.el-aside {
    /* 100%视口高度 */
    height: 100vh;
    background-color: #fff;
    /* 边框圆角 */
    border-radius: 0 20px 20px 0;
    /* 边框阴影 */
    box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.2);
    /* 过渡动画 */
    transition: width 0.3s ease;
}

/* 隐藏垂直导航栏滚动条 */
.el-aside::-webkit-scrollbar {
    display: none;
}

/* 垂直导航栏顶部 */
.el-aside .top {
    display: flex;
    padding: 20px 26px 10px 6px;
}

/* 垂直导航栏顶部logo */
.el-aside .top .logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

/* 垂直导航栏顶部标题 */
.el-aside .top .title {
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
    font-family: 'SimSun';
    font-size: 24px;
    margin: 10px 2px 0 12px;
}

.el-header {
    margin: 10px 50px;
    height: 65px;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
    text-align: center;
    border-radius: 20px;
    background-color: #fff;

}

/* 导航栏左侧布局 */
.horizontal-menu .left {
    display: flex;
    float: left;
    margin: 15px
}

/* 展开动画 */
.horizontal-menu .left .fold {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transition: transform 0.3s ease;
}

/* 折叠动画 */
.horizontal-menu .left .unfold {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transition: transform 0.3s ease;
}

/* 导航栏左侧标题 */
.horizontal-menu .left .title {
    text-align: left;
    color: grey;
    font-family: 'SimSun';
    font-size: 20px;
    margin-top: 5px;
    margin-left: 20px;
}

/* 隐藏图标边框 */
.horizontal-menu .left .el-button {
    margin: 5px 20px 0 10px;
    border: none;
}

/* 导航栏右侧布局 */
.horizontal-menu .right {
    display: flex;
    float: right;
    margin-top: 7px;
}

/* 头像 */
.horizontal-menu .right .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

/* 右侧图标外边距 */
.horizontal-menu .right .icon .el-button {
    margin: 10px 20px 0 0;
}

/* 个人信息 */
.horizontal-menu .right .user {
    text-align: center;
    width: 50px;
    height: 50px;
    padding-top: 6px;
    color: black;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
}

/* 下拉菜单 */
.horizontal-menu .right .el-icon-arrow-down {
    color: grey;
    margin-top: 18px;
    margin-right: 6px;
    text-align: center;
}

/* 铃铛动画效果 */
.shake:hover {
    animation: shake 0.5s;
    /* 设置摇晃动画的持续时间 */
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(-15deg);
    }

    40% {
        transform: rotate(15deg);
    }

    60% {
        transform: rotate(-15deg);
    }

    80% {
        transform: rotate(15deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

/* 荧光绿 #3EF7E1 */
/* 宝石蓝 #409EFF */

.Container {
    margin: 0 30px;
    animation: fade-in 0.8s ease-out;
}

/* 添加页面淡入动画 */
@keyframes fade-in {
    from {
        opacity: 0.2;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>