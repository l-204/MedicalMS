<template>
    <div>
        <!-- 调用菜单组件 -->
        <MenuPage>
            <template v-slot:default>
                <!-- 这里是需要显示在 el-main 中的内容 -->
                <div class="Container">
                    <el-tabs type="border-card" style="border-radius: 0 0 20px 20px;">
                        <el-tab-pane v-for="item in menuList" :key="item.id">
                            <span slot="label" @click="currentComponent = item.currentComponent">
                                <i :class="item.icon"></i>&emsp;{{ item.name }}
                            </span>
                        </el-tab-pane>
                        <component :is="currentComponent"></component>
                    </el-tabs>
                </div>
            </template>
        </MenuPage>
    </div>
</template>

<script>
import MenuPage from '@/components/MenuPage.vue';
// 信息管理
import Patient from '../view/Information/PatientPage.vue';
import Doctor from '../view/Information/DoctorPage.vue';
import Room from '../view/Information/RoomPage.vue';
import CaseHistory from '../view/Information/CaseHistoryPage.vue';
import Medicine from '../view/Information/MedicinePage.vue';
import Surgery from '../view/Information/SurgeryPage.vue';
import Nursing from '../view/Information/NursingPage.vue';

export default {
    data() {
        return {
            currentComponent: 'Patient',
            menuList: [
                {
                    "name": "患者管理",
                    "id": 1,
                    "icon": "el-icon-warning-outline",
                    "currentComponent": 'Patient',
                },
                {
                    "name": "医生管理",
                    "id": 2,
                    "icon": "el-icon-circle-plus-outline",
                    "currentComponent": 'Doctor',
                },
                {
                    "name": "科室管理",
                    "id": 3,
                    "icon": "el-icon-house",
                    "currentComponent": 'Room',

                },
                {
                    "name": "病历管理",
                    "id": 4,
                    "icon": "el-icon-document-add",
                    "currentComponent": 'CaseHistory',
                },
                {
                    "name": "药品管理",
                    "id": 5,
                    "icon": "el-icon-first-aid-kit",
                    "currentComponent": 'Medicine',
                },
                {
                    "name": "手术管理",
                    "id": 6,
                    "icon": "el-icon-remove-outline",
                    "currentComponent": 'Surgery',
                },
                {
                    "name": "护理管理",
                    "id": 7,
                    "icon": "el-icon-suitcase",
                    "currentComponent": 'Nursing',
                },
            ]
        }
    },
    components: {
        MenuPage,
        Patient,
        Doctor,
        Room,
        CaseHistory,
        Medicine,
        Surgery,
        Nursing,
    }
}
</script>

<style></style>