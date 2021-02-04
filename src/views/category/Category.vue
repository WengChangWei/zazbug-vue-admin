<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 基础表格 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" round @click="handleEdit('', '')">添加分类</el-button>
                <!-- <el-button type="danger" round @click="delAllSelection">批量删除</el-button> -->
                <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="100" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="分类名称"></el-table-column>
                <el-table-column prop="parentCate.name" label="上级分类"></el-table-column>
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.isShow == '1' ? 'success' : scope.row.isShow == '0' ? 'danger' : ''">{{
                            status[scope.row.isShow]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
                        <!-- <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="ID">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-select v-model="form.parentId" placeholder="请选择" class="handle-select mr10">
                        <el-option label="顶级分类" value="0"></el-option>
                        <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio v-model="form.isShow" label="1">是</el-radio>
                    <el-radio v-model="form.isShow" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import { findPageByList, add, update } from '../../api/category';
import { cateFindAll } from '../../api/category';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            status: ['隐藏', '显示'],
            cateList: []
        };
    },
    created() {
        this.getData();
    },
    activated(){
        this.getData();
    },
    methods: {
        // 获取
        getData() {
            let params = {
                page: this.query.pageIndex,
                size: this.query.pageSize
            };
            findPageByList(params).then((res) => {
                this.tableData = res.data.data.list;
            });
            // 所有分类
            cateFindAll().then((res) => {
                if (res.data.flag) {
                    this.cateList = res.data.data;
                }
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            if (row) {
                this.form = row;
            } else {
                this.form = {
                    id: 0
                };
            }
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            if (this.form.id == 0) {
                // 添加
                add(this.form).then((res) => {
                    if (res.data.flag) {
                        this.$message.success(`添加成功`);
                        this.getData();
                    } else {
                        this.$message.error(`添加失败`);
                    }
                });
            } else {
                // 修改
                update(this.form).then((res) => {
                    if (res.data.flag) {
                        this.$message.success(`修改成功`);
                        this.getData();
                    } else {
                        this.$message.error(`修改失败`);
                    }
                });
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
