<template>
    <div>
        <!-- 调用菜单组件 -->
        <MenuPage>
            <template v-slot:default>
                <!-- 这里是需要显示在 el-main 中的内容 -->
                <div class="Container">
                    <div class="AnalyseContainer">
                        <el-row>
                            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="padding-right: 20px;">
                                <!-- 第一行 -->
                                <el-row style="margin-bottom: 40px;">
                                    <!-- 饼图 -->
                                    <el-card>
                                        <div class="chart-container">
                                            <div id="pie-chart" style="width: 100%; height: 250px;"></div>
                                        </div>
                                    </el-card>
                                </el-row>
                                <!-- 第二行 -->
                                <el-row>
                                    <!-- 散点图 -->
                                    <el-card>
                                        <div class="chart-container">
                                            <div id="scatter-chart" style="width: 100%; height: 250px;"></div>
                                        </div>
                                    </el-card>
                                </el-row>
                            </el-col>

                            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="padding-left: 20px;">
                                <!-- 柱状图 -->
                                <el-card>
                                    <div class="chart-container">
                                        <div id="bar-chart" style="width: 100%; height: 580px;"></div>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </template>
        </MenuPage>
    </div>
</template>

<script>
import MenuPage from '@/components/MenuPage.vue';
import * as echarts from 'echarts';


export default {
    data() {
        return {

        }
    },
    mounted() {
        this.getCity()  // 饼图
        this.getAge() // 散点图
        this.getTitle()  // 柱状图
        this.renderScatterChart() //散点图
    },
    methods: {
        getCity() {
            // 获取所有药品的生产城市
            const tableName = 'medicines'
            const keyName = 'medicine_company'
            fetch(`http://localhost:3000/api/${keyName}/${tableName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()
                .then(data => {
                    const cityData = data.map(item => item.medicine_company);
                    // 使用 Set 来筛选出不同的城市
                    const uniqueCity = new Set(cityData);
                    // 遍历 Set 中的每个城市，统计不同城市在数组中出现的次数
                    const cityCount = {};
                    uniqueCity.forEach(city => {
                        const count = cityData.filter(value => value === city).length;
                        cityCount[city] = count;
                    });
                    //将cityCount格式化为饼图数据源
                    const cityList = Object.keys(cityCount).map(key => {
                        return { value: cityCount[key], name: key };
                    });

                    this.renderPieChart(cityList); // 将城市数据传入 renderPieChart 方法
                }))
                .catch(err => console.error(err))
        },
        getAge() {
            // 获取所有患者的年龄
            const tableName = 'patients'
            const keyName = 'age'
            fetch(`http://localhost:3000/api/${keyName}/${tableName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()
                .then(data => {
                    const ageData = data.map(item => item.age);
                    const ageNumber1 = ageData.filter((num) => num >= 0 && num <= 19).length;
                    const ageNumber2 = ageData.filter((num) => num >= 20 && num <= 39).length;
                    const ageNumber3 = ageData.filter((num) => num >= 40 && num <= 59).length;
                    const ageNumber4 = ageData.filter((num) => num >= 60 && num <= 79).length;
                    const ageNumber5 = ageData.filter((num) => num >= 80 && num <= 99).length;
                    const ageNumber6 = ageData.filter((num) => num >= 100 && num <= 119).length;

                    const ageList = [ageNumber1, ageNumber2, ageNumber3, ageNumber4, ageNumber5, ageNumber6]
                    this.renderScatterChart(ageList); // 将年龄数据传入 renderBarChart 方法
                }))
                .catch(err => console.error(err))
        },
        getTitle() {
            // 获取所有药品的生产城市
            const tableName = 'doctors'
            const keyName = 'title'
            fetch(`http://localhost:3000/api/${keyName}/${tableName}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json()
                .then(data => {
                    const titleData = data.map(item => item.title);
                    // 使用 Set 来筛选出不同的城市
                    const uniqueTitle = new Set(titleData);
                    // 遍历 Set 中的每个城市，统计不同城市在数组中出现的次数
                    const titleCount = {};
                    uniqueTitle.forEach(title => {
                        const count = titleData.filter(value => value === title).length;
                        titleCount[title] = count;
                    });
                    //将cityCount格式化为饼图数据源
                    const titleList = Object.keys(titleCount).map(key => {
                        return { value: titleCount[key], name: key };
                    });

                    this.renderBarChart(titleList); // 将城市数据传入 renderPieChart 方法
                }))
                .catch(err => console.error(err))
        },
        renderPieChart(cityList) {
            const chart = echarts.init(document.getElementById('pie-chart'))
            const options = {
                title: { text: '院内药品各生产厂商城市分布图' },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    data: cityList,
                },
                series: [
                    {
                        type: 'pie',
                        data: cityList,
                        label: {
                            show: true,
                            formatter: '{d}%' // {b}表示name，{d}%表示百分比
                        }
                    }
                ]
            };
            chart.setOption(options)
        },
        renderBarChart(titleList) {
            const chart = echarts.init(document.getElementById('bar-chart'))
            const options = {
                title: {
                    text: '院内医师各职称人数分布图',
                },
                xAxis: {
                    data: titleList.map(item => item.name)
                },
                yAxis: {},
                series: [{
                    type: 'bar',
                    data: titleList,
                    label: {
                        show: true, // 显示标签
                        position: 'top' // 标签位置
                    }
                }]
            };

            chart.setOption(options)
        },
        renderScatterChart(ageList) {
            const chart = echarts.init(document.getElementById('scatter-chart'))
            const options = {
                title: { text: '院内患者各年龄段人数分布图' },
                xAxis: {
                    data: ['0-19', '20-39', '40-59', '60-79', '80-99', '100-119']
                },
                yAxis: {},
                series: [
                    {
                        type: 'scatter',
                        data: ageList,
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
    components: {
        MenuPage,
    }
}
</script>

<style></style>