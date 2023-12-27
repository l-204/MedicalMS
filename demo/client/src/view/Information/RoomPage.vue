<template>
    <div>
        <table-page :table-name="tableName" :title="formTitle" :form-list="formData" :rule-list="ruleData"></table-page>
    </div>
</template>
  
<script>
import TablePage from '../../components/TablePage.vue'
export default {
    components: {
        TablePage
    },
    data() {
        return {
            tableName: 'rooms',
            formTitle: '科室',

            // formData 的 key 必须与数据库字段保持一致
            formData: [
                { label: '科室号', type: 'input', key: 'room_id', value: '' },
                { label: '科室名', type: 'input', key: 'room_name', value: '' },
                { label: '科室负责人', type: 'input', key: 'room_head', value: '' },
            ],
            // ruleData 的 prop 必须与 formData 的 key 一致
            ruleData: {
                room_id: [
                    { required: true, message: '科室号不能为空', trigger: 'blur' },
                    { pattern: /^\d{3}$/, message: '科室号格式：楼层号+房间号', trigger: 'blur' },
                ],
                room_name: [
                    { required: true, message: '科室名不能为空', trigger: 'blur' },
                    { pattern: /[\u4e00-\u9fa5]科$/, message: '科室名格式：xx科', trigger: 'blur' },
                ],
            },
        }
    },
    methods: {

    },
};
</script>