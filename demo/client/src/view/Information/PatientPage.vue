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
            tableName: 'patients',
            formTitle: '患者',

            // formData 的 key 必须与数据库字段保持一致
            formData: [
                { label: '姓名', type: 'input', key: 'patient_name', value: '' },
                { label: '性别', type: 'radio', key: 'gender', options: ['男', '女'] },
                { label: '年龄', type: 'number', key: 'age', value: '' },
                { label: '联系方式', type: 'input', key: 'phone_number', value: '' },
            ],
            // ruleData 的 prop 必须与 formData 的 key 一致
            ruleData: {
                patient_name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '年龄不能为空', trigger: 'blur' },
                    { type: 'number', message: '年龄必须为数字值', trigger: 'blur' },
                    { pattern: /^[2-5]\d$/, message: '年龄必须为20-59岁', trigger: 'blur' }
                ],
                phone_number: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
                ]
            },
        }
    },
};
</script>