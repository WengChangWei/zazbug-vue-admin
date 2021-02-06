<template>
    <div>
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm" style="width: 30%; margin: 50px">
            <el-form-item label="头像" prop="headPic">
                <label>
                    <img v-if="userForm.headPic" :src="userForm.headPic" class="user-avator" width="40%" alt />
                    <img v-else src="../../assets/img/img.png" class="user-avator" width="40%" alt />
                    <el-upload
                        v-show="false"
                        class="avatar-uploader"
                        action="/api/upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :headers="uploadHeader"
                    >
                    </el-upload>
                </label>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="userForm.nickname"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
                <el-input v-model="userForm.qq"></el-input>
            </el-form-item>
            <el-form-item label="微博名" prop="weibo">
                <el-input v-model="userForm.weibo"></el-input>
            </el-form-item>
            <el-form-item label="自我介绍" prop="introduce">
                <el-input type="textarea" v-model="userForm.introduce"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getUserInfo, putUserInfo } from '@/api/index';
export default {
    data: function () {
        return {
            userForm: {},
            uploadHeader: {Authorization:localStorage.getItem("Authorization")},
            rules: {
                nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                introduce: [{ required: true, message: '请填写自我介绍', trigger: 'blur' }],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                qq: [{ required: true, message: '请输入QQ', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getUser();
    },
    methods: {
        handleAvatarSuccess(res, file) {
            // this.imageUrl = URL.createObjectURL(file.raw);
            // 修改头像
            if (res.flag) {
                let img = res.data;
                this.userForm.headPic = img;
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 1MB!');
            }
            return isJPG && isLt2M;
        },
        getUser() {
            getUserInfo().then((res) => {
                if (res.data.flag) {
                    this.userForm = res.data.data;
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提交
                    putUserInfo(this.userForm).then((res) => {
                        if (res.data.flag) {
                            this.$message.success('提交成功');
                        }
                    });
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>