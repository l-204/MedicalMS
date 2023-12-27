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
            tableName: 'medical_records',
            formTitle: '病历',

            // formData 的 key 必须与数据库字段保持一致
            formData: [
                { label: '患者姓名', type: 'input', key: 'patient_name', value: '' },
                { label: '主治医生', type: 'input', key: 'doctor_name', value: '' },
                { label: '医生工号', type: 'input', key: 'doctor_id', value: '' },
                { label: '病情描述', type: 'textarea', key: 'record_content', value: ' ' },
                { label: '诊断结果', type: 'textarea', key: 'record_results', value: ' ' },
            ],
            // ruleData 的 prop 必须与 formData 的 key 一致
            ruleData: {
                patient_name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                doctor_name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                doctor_id: [
                    { required: true, message: '工号不能为空', trigger: 'blur' },
                    { pattern: /^201[12345]\d{4}$/, message: '工号格式：201+职称号+编号', trigger: 'blur' },
                ],
                record_content: [],
                record_results: [],
            },
        }
    },
};
</script>