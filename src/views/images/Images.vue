<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 基础表格 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-select v-model="query.address" placeholder="图片分类" class="handle-select mr10">
                    <el-option key="0" label="请选择" value="请选择"></el-option>
                    <el-option key="1" label="写实" value="写实"></el-option>
                    <el-option key="2" label="二次元" value="二次元"></el-option>
                    <el-option key="3" label="练习" value="练习"></el-option>
                </el-select> -->
                <!-- <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input> -->
                <!-- <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->

                <!-- <el-button type="danger" @click="delAllSelection" round>批量删除</el-button> -->

                <el-button type="primary" @click="handleEdit(0, '')" round>上传图片</el-button>
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
                <el-table-column label="图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.url" :preview-src-list="[scope.row.url]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="一级分类" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.categoryByOne.name }}
                    </template>
                </el-table-column>
                <el-table-column label="二级分类" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.categoryByTwo.name }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.isShow == '1' ? 'success' : scope.row.isShow == '0' ? 'danger' : ''">{{
                            status[scope.row.isShow]
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="addTime" label="添加时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!-- <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button> -->
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
            <el-form ref="form" label-width="70px">
                <!-- <el-form-item label="图片" v-if="form.url">
                    <el-image :src="form.url" style="width: 100%"></el-image>
                </el-form-item> -->

                <el-form-item label="图片">
                    <el-upload
                        class="avatar-uploader"
                        action="/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :headers="uploadHeader"
                    >
                        <img v-if="form.url" :src="form.url" width="100%" height="100%" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="图片分类">
                    <el-select v-model="form.cateId1" placeholder="一级分类" class="handle-select mr10" @change="changeByCateList()">
                        <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="form.cateId2" placeholder="二级分类" class="handle-select mr10" @change="setCateId2()">
                        <el-option v-for="item in childrenList" :key="item.name" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio v-model="form.isShow" label="1">是</el-radio>
                    <el-radio v-model="form.isShow" label="0">否</el-radio>
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
import { findPageByList, imagesAdd, imagesUpdate } from '../../api/images';
import { cateFindAll } from '../../api/category';
export default {
    name: 'basetable',
    data() {
        return {
            imageUrl: '',
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            cateList: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            status: ['隐藏', '显示'],
            childrenList: [],
            uploadHeader: {Authorization:localStorage.getItem("Authorization")}
        };
    },
    created() {
        this.getData();
    },
    methods: {
        setCateId2() {
            this.$forceUpdate();
        },
        // 选择分类
        changeByCateList(sign = false) {
            if (!sign) this.form.cateId2 = '';
            this.cateList.forEach((el) => {
                if (el.id == this.form.cateId1) {
                    if (el.children) {
                        this.childrenList = el.children;
                    }
                }
            });
        },
        handleDownload(file) {
            console.log(file);
        },
        // 上传成功
        handleAvatarSuccess(res, file) {
            // this.imageUrl = URL.createObjectURL(file.raw);
            this.form.url = res.data;
            this.setCateId2()
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt1M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt1M) {
                this.$message.error('上传图片大小不能超过 1MB!');
            }
            return isJPG && isLt1M;
        },
        getData() {
            let params = {
                page: this.query.pageIndex,
                size: this.query.pageSize
            };
            // 相册列表
            findPageByList(params).then((res) => {
                if (res.data.flag) {
                    this.tableData = res.data.data.list;
                    this.pageTotal = res.data.data.total
                } else {
                    this.$message.error('获取失败');
                }
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
                    id: 0,
                    isShow: '1'
                };
            }
            this.editVisible = true;
            this.changeByCateList(true);
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            if (this.form.id == 0) {
                imagesAdd(this.form).then((res) => {
                    if (res.data.flag) {
                        this.$message.success('添加成功');
                        this.getData();
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            } else {
                imagesUpdate(this.form).then((res) => {
                    if (res.data.flag) {
                        this.$message.success('修改成功');
                        this.getData();
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            }
            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            // this.$set(this.tableData, this.idx, this.form);
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
    width: 100px;
    height: 50px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
