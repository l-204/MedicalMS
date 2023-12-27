<template>
    <!-- 调用菜单组件 -->
    <MenuPage>
        <template v-slot:default>
            <!-- 这里是需要显示在 el-main 中的内容 -->
            <div class="Container">
                <!-- 内容 -->
                <div class="HomeContent">
                    <!-- 第一行 -->
                    <el-row :gutter="20">
                        <!-- 个人信息 -->
                        <el-col :xs="18" :sm="14" :md="10" :lg="10" :xl="4">
                            <div class="grid-content bg-purple">
                                <!-- 上部分 -->
                                <div class="top">
                                    <img src="../assets/man.png" v-if="gender == '男'">
                                    <img src="../assets/woman.png" v-if="gender == '女'">
                                    <img src="../assets/default.png" v-if="gender == '' || gender == '保密'">
                                    <div class="user">
                                        <i class="el-icon-user"></i> &nbsp;{{ username }}
                                        <br><br>
                                        <i class="el-icon-paperclip"></i> &nbsp;{{ identity }}
                                    </div>
                                </div>
                                <!-- 下部分 -->
                                <div style="color: gray; margin:0 20px">
                                    <el-divider></el-divider>
                                    <i class="el-icon-link"></i> 上次登录时间：{{ last_login_at }}
                                </div>
                            </div>
                        </el-col>
                        <!-- 常用功能 -->
                        <el-col :xs="6" :sm="10" :md="14" :lg="14" :xl="20">
                            <!-- 折线图 -->
                            <el-card style="border-radius: 10px;box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);">
                                <div id="line-chart" style="width: 100%; height: 275px; "></div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <!-- 第二行 -->
                    <el-row :gutter="20">
                        <!-- 轮播图 -->
                        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                            <div class="grid-content bg-purple">
                                <el-carousel trigger="click" height="315px">
                                    <el-carousel-item v-for="(item, index) in images" :key="index">
                                        <img :src="item" style="width: 100%; height: 100%;">
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                        </el-col>
                        <!-- 开发进度 -->
                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                            <div class="grid-content bg-purple">
                                <div class="title">
                                    <i class="el-icon-data-line"></i> 开发进度
                                    <el-divider></el-divider>
                                    <i class="el-icon-house"></i> 首页模块<el-progress :percentage="100"
                                        status="success"></el-progress>
                                    <i class="el-icon-mouse"></i> 管理模块<el-progress :percentage="100"
                                        status="success"></el-progress>
                                    <i class="el-icon-more-outline"></i> 其他模块<el-progress :percentage="100"
                                        status="success"></el-progress>
                                </div>
                            </div>
                        </el-col>
                        <!-- 开发日志 -->
                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                            <div class="grid-content bg-purple">
                                <div class="title">
                                    <i class="el-icon-notebook-2"></i> 开发日志
                                    <el-divider></el-divider><br>
                                    <el-timeline>
                                        <el-timeline-item v-for="(activity, index) in activities" :key="index"
                                            :timestamp="activity.timestamp" :type="activity.type" :icon="activity.icon">
                                            {{ activity.content }}
                                        </el-timeline-item>
                                    </el-timeline>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </template>
    </MenuPage>
</template>

<script>
import MenuPage from '../components/MenuPage.vue';
import * as echarts from 'echarts';
import moment from 'moment';
export default {
    data() {
        // 获取localStorage中的用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        // 
        return {
            username: userInfo.username,
            gender: userInfo.gender,
            identity: userInfo.identity,
            last_login_at: moment(userInfo.last_login_at).format('YYYY-MM-DD HH:mm:ss'),
            currentPage: 1, // 当前页码
            pageSize: 10,   // 每页显示条数

            images: [
                require('../assets/1.jpg'),
                require('../assets/2.jpg'),
                require('../assets/3.png'),
                require('../assets/4.jpg'),
            ],

            activities: [{
                content: '项目完工',
                timestamp: '2023-12-27',
                type: 'success',
                icon: 'el-icon-check',
            }, {
                content: '项目启动',
                timestamp: '2023-11-23',
                type: 'success',
                icon: 'el-icon-check',
            }]
        }

    },
    components: {
        MenuPage
    },
    mounted() {
        this.getDay()
    },
    methods: {
        getDay() {
            const tableName = 'patients'
            fetch(`http://localhost:3000/api/all/select/${tableName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json()
                .then(data => {
                    // 获取患者就诊时间字段created_at
                    const patientsData = data.map(item => item.created_at)
                    // 转化为时间戳
                    const timestamps = patientsData.map(date => new Date(date).getTime() / 1000);
                    // 获取当前时间戳（秒级）
                    const now = Date.now() / 1000;
                    // 计算7天前的时间戳（秒级）
                    const target = now - (7 * 24 * 3600);
                    // 定义结果对象
                    const result = {};
                    // 循环遍历7天内的每一天
                    for (let i = 1; i <= 7; i++) {
                        // 计算当前天数的时间戳范围
                        const start = target + (i * 24 * 3600);
                        const end = target + ((i + 1) * 24 * 3600);
                        // 在时间戳数组中寻找符合条件的时间戳
                        const filtered = timestamps.filter(timestamp => timestamp >= start && timestamp < end);
                        // 将当前天数和对应的时间戳数组存储到结果对象中
                        const date = new Date(start * 1000).toLocaleDateString();
                        // 不加length就是符合这一天的所有时间戳，加上length就是符合这一天的天数
                        result[date] = filtered.length;
                    }
                    this.renderLineChart(result)
                }))
        },
        renderLineChart(result) {
            // 获取键数组
            const keys = Object.keys(result);
            // 使用map()方法将键和值分别存储到两个数组中（只保留月日）
            const xAxisData = keys.map(key => key.replace(/^\d+\//, ''));
            const yAxisData = keys.map(key => result[key]);

            const chart = echarts.init(document.getElementById('line-chart'))
            const options = {
                title: { text: '近一周内就诊患者人数分布图' },
                xAxis: { type: 'category', data: xAxisData },
                yAxis: { type: 'value' },
                series: [
                    {
                        data: yAxisData,
                        type: 'line',
                        label: {
                            show: true, // 显示标签
                            position: 'top' // 标签位置
                        }
                    }
                ]
            };
            chart.setOption(options)
        },
    },
}
</script>

<style>
/* 隐藏滚动条 */
::-webkit-scrollbar {
    display: none;
}

.HomeContent .bg-purple {
    background: #fff;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.HomeContent .grid-content {
    border-radius: 10px;
    min-height: 315px;
    margin-bottom: 30px
}

.HomeContent .grid-content .top {
    display: flex;
    padding-top: 20px;
}

.HomeContent .grid-content .top img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: auto;
}

.HomeContent .grid-content .user {
    text-align: left;
    margin: auto;
    font-size: 24px;
}

/* el-carousel样式 */
.HomeContent .el-carousel__item h3 {
    font-size: 14px;
    opacity: 0.75;
    line-height: 320px;
    margin: 0;
    text-align: center;
}

.HomeContent .grid-content .title {
    padding: 20px;
    width: auto;
}

.HomeContent .grid-content .progress {
    margin: 0 20px;
    width: auto;
}

.HomeContent .grid-content .el-progress {
    margin-bottom: 30px;
    width: auto;
}
</style>