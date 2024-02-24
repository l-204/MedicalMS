<template>
    <div>
        <el-button size="medium" type="" icon="el-icon-circle-plus-outline" @click="openAddDialog()"
            style="margin-top: 10px;" v-if="identity == '管理员'">添加</el-button>
        <div style="margin: 5px 0 20px 0; float: right;">
            <el-input v-model="searchword" placeholder="请输入关键字查询" class="input-with-select">
                <el-select v-model="keywords" slot="prepend" placeholder="请选择" style="width: 120px;">
                    <el-option v-for="(item, index) in formList" :key="index" :label="item.label"
                        :value="item.key"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
            </el-input>
        </div>

        <el-dialog :title="isAdd ? `添加${title}` : isEdit ? `编辑${title}` : ''" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="ruleList" ref="form" label-width="120px">
                <el-form-item v-for="item in formList" :prop="item.key" :label="item.label" :key="item.key">
                    <template v-if="item.type === 'input'">
                        <el-input v-model="form[item.key]" :placeholder="'请输入' + item.label"></el-input>
                    </template>
                    <template v-else-if="item.type === 'number'">
                        <el-input v-model.number="form[item.key]" :placeholder="'请输入' + item.label"></el-input>
                    </template>
                    <template v-else-if="item.type === 'radio'">
                        <el-radio-group v-model="form[item.key]">
                            <el-radio v-for="(option, index) in item.options" :key="index" :label="option">{{ option
                            }}</el-radio>
                        </el-radio-group>
                    </template>
                    <template v-else-if="item.type === 'checkbox'">
                        <el-checkbox-group v-model="form[item.key]">
                            <el-checkbox v-for="(option, index) in item.options" :key="index" :label="option">{{
                                option }}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                    <template v-else-if="item.type === 'select'">
                        <el-select v-model="form[item.key]" :placeholder="'请选择' + item.label">
                            <el-option v-for="(option, index) in item.options" :key="index" :label="option"
                                :value="option"></el-option>
                        </el-select>
                    </template>
                    <template v-else-if="item.type === 'date'">
                        <el-date-picker v-model="form[item.key]" type="date"
                            :placeholder="'请选择' + item.label"></el-date-picker>
                    </template>
                    <template v-else-if="item.type === 'textarea'">
                        <el-input autosize type="textarea" v-model="form[item.key]" :rows="4"
                            :placeholder="'请输入' + item.label"></el-input>
                    </template>
                    <template v-else-if="item.type === 'switch'">
                        <el-switch v-model="form[item.key]"></el-switch>
                    </template>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDialog()">确 定</el-button>
            </div>
        </el-dialog>

        <el-table :data="displayedData" border height="455" style="margin-top:20px; width: 100%;">
            <el-table-column type="index" label="" align="center"></el-table-column>

            <el-table-column v-for=" (item, index) in formList" :key="index" :prop="item.key" align="center"
                :label="item.label">
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="180px" align="center" v-if="identity == '管理员'">
                <template slot-scope="scope">

                    &emsp;<el-button icon="el-icon-edit" type="text" size="small"
                        @click="openEditDialog(scope.row)">编辑</el-button>
                    &emsp;<el-button icon="el-icon-delete" type="text" size="small"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination style="margin: 20px 0;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 40, 50, 100]" :page-size="pageSize"
            layout="->,total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'TablePage',
    props: {
        tableName: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        formList: {
            type: Array,
            default: () => []
        },
        ruleList: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            identity: '',

            keywords: '',
            searchword: '',

            tableList: [],

            value: '',
            currentPage: 1, // 当前页数
            pageSize: 10, // 每页显示条目数
            total: 100, // 总条目数，需要从后端获取

            isAdd: false,
            isEdit: false,
            dialogFormVisible: false,
            form: {},
        }
    },
    computed: {
        displayedData() {
            // 根据currentPage和pageSize计算出当前页显示的数据
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.tableList.slice(startIndex, endIndex);
        }
    },
    created() {
        // 获取本地存储的用户信息，并将其转为json格式
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        // 获取用户身份
        this.identity = userInfo.identity
        fetch(`http://localhost:3000/api/all/select/${this.tableName}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', },
        }).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    this.tableList = data;
                    this.total = data.length;
                }).catch(err => {
                    console.error(err);
                });
            }
            else {
                throw new Error('请求失败');
            }
        })
            .catch(err => console.error(err));
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1; // 选择每页显示条目数后，重置当前页数为1
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        handleSearch() {
            if (this.keywords == '') {
                // 弹出信息
                this.$message({
                    type: 'error',
                    message: '请选择搜索关键词!'
                });
                return
            }
            const searchForm = [this.tableName, this.keywords, this.searchword]
            fetch(`http://localhost:3000/api/all/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(searchForm)
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        this.tableList = data;
                        this.total = data.length;
                    }).catch(err => {
                        console.error(err);
                    });
                }
                else {
                    throw new Error('请求失败');
                }
            })
                .catch(err => console.error(err));
        },
        handleDelete(row) {
            this.$confirm(`确定删除该${this.title}吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fetch(`http://localhost:3000/api/all/delete/${row.id}/${this.tableName}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                }).then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            this.tableList = data;
                            this.total = data.length;
                            // 删除数据为当前页最后一条时，删除后将返回上一页
                            this.total % this.pageSize == 0 ? this.currentPage -= 1 : this.currentPage
                            // 弹出信息
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch(err => {
                            console.error(err);
                        });
                    }
                    else {
                        throw new Error('请求失败');
                    }
                })
                    .catch(err => console.error(err));

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        openAddDialog() {
            this.form = {};
            this.isAdd = true;
            this.isEdit = false;
            this.dialogFormVisible = true;
        },
        openEditDialog(row) {
            /**
             * 使用深拷贝避免表单和表格数据引用同一内存地址
             * 否则会导致表单数据被修改时，表格数据也会被修改
             *  */
            this.form = JSON.parse(JSON.stringify(row));
            this.isAdd = false;
            this.isEdit = true;
            this.dialogFormVisible = true;
        },
        handleDialog() {
            // 规则校验
            this.$refs.form.validate((valid) => {
                if (valid) {
                    console.log('on submit!!')
                    this.submitForm()
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitForm() {
            // 符合校验规则则关闭弹窗
            this.dialogFormVisible = false;
            // 保存修改信息并发送请求
            const form = JSON.stringify(this.form);
            const url = this.isAdd ? 'insert' : this.isEdit ? `update/${this.form.id}` : '';
            fetch(`http://localhost:3000/api/all/${url}/${this.tableName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: form
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        this.tableList = data;
                        this.total = data.length;
                        // 弹出信息
                        this.$message({
                            showClose: true,
                            message: this.isAdd ? '添加成功' : this.isEdit ? '修改成功' : '',
                            type: 'success'
                        });
                    }).catch(err => {
                        console.error(err);
                    });
                }
                else {
                    throw new Error('请求失败');
                }
            })
                .catch(err => console.error(err));
        }
    }
}
</script>