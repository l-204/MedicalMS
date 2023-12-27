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
            tableName: 'medicines',
            formTitle: '药品',

            // formData 的 key 必须与数据库字段保持一致
            formData: [
                { label: '药品名称', type: 'input', key: 'medicine_name', value: '' },
                { label: '药品品牌', type: 'input', key: 'medicine_brand', value: ' ' },
                { label: '生产厂家', type: 'input', key: 'medicine_company', value: ' ' },
                { label: '药品规格', type: 'input', key: 'specification', value: ' ' },
                { label: '药品单价', type: 'number', key: 'unit_price', value: ' ' },
                { label: '批准文号', type: 'input', key: 'approval_number', value: ' ' },
                { label: '药品库存', type: 'number', key: 'storage', value: ' ' },
            ],
            // ruleData 的 prop 必须与 formData 的 key 一致
            ruleData: {
                medicine_name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                medicine_brand: [],
                medicine_company: [],
                specification: [],
                unit_price: [
                    { required: true, message: '单价不能为空', trigger: 'blur' },
                    { type: 'number', message: '单价必须为数字值', trigger: 'blur' },
                ],
                approval_number: [
                    { required: true, message: '批准编号不能为空', trigger: 'blur' },
                    { pattern: /^(Z|H)\d{8}$/, message: '格式为Z或H开头加8位数字', trigger: 'blur' }
                ],
                storage: [
                    { required: true, message: '库存不能为空', trigger: 'blur' },
                    { type: 'number', message: '库存必须为数字值', trigger: 'blur' },
                ],
            },
        }
    },
};
</script>