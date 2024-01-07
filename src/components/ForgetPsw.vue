<template>
    <div class="forgetPsw">
        <div class="modal-container">
            <h1>找回密码</h1>
            <form @submit.prevent="findPsw">
                <div class="form-group">
                    <input type="text" id="email" v-model="registerEmail" placeholder="邮箱" required>
                    <button type="button" @click="sendEmail" :disabled="countDown > 0">{{ buttonText }}</button>
                </div>
                <div class="form-group">
                    <input type="text" id="emailCode" v-model="registerEmailCode" placeholder="邮箱验证码" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" v-model="registerPassword" placeholder="新密码" required>
                </div>
                <div class="form-group">
                    <input type="password" id="confirm-password" v-model="registerPasswordConfirm" placeholder="确认新密码"
                        required>
                </div>
                <div class="btn-container">
                    <button type="submit">确定</button>
                    <button class="blue" type="button" @click="closeModal">取消</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import http from '@/utils/http'; // 引入封装好的axios请求
export default {
    name: 'ForgetPsw',
    data() {
        return {
            registerEmail: '',
            registerEmailCode: '',
            registerPassword: '',
            registerPasswordConfirm: '',
            countDown: 30,  // 验证码发送倒计时，
            buttonText: '发送验证码', // 验证码按钮文本
        }
    },
    methods: {
        closeModal() {
            this.$emit("closeModal");
        },
        forgetPsw() {
            if (!this.checkPasswordFormat()) return;
            if (!this.checkPassword()) return;
            http.post('/forget', {
                email: this.registerEmail,
                emailCode: this.registerEmailCode,
                password: this.registerPassword,
                passwordConfirm: this.registerPasswordConfirm,
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$toast.success(res.data.msg);
                    this.closeModal();
                } else {
                    this.$toast.error(res.data.msg);
                }
            });
            this.closeModal(); // Close the modal after registration
        },
        sendEmail() {
            if (this.countDown > 0) return;
            this.$toast.info('验证码已发送，请注意查收');
            http.post('/sendEmail', {
                email: this.registerEmail,
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$toast.success(res.data.msg);
                    this.countDown = 30;
                    const timer = setInterval(() => {
                        if (this.countDown > 0) {
                            this.countDown -= 1;
                            this.buttonText = `${this.countDown}s后重发`;
                        } else {
                            this.buttonText = '发送验证码';
                            clearInterval(timer);
                        }
                    }, 1000); // 创建定时器防止频繁发送验证码
                } else {
                    this.$toast.error(res.data.msg);
                }
            });
        },
        checkPasswordFormat() {
            if (this.registerPassword === '') {
                this.$toast.error('密码不能为空');
                return false;
            } else {
                const reg = /^[a-zA-Z0-9_-]{6,20}$/;
                if (!reg.test(this.registerPassword)) {
                    this.$toast.error('密码格式不正确,请输入6-20位字母数字组合');
                    return false;
                }
            }
            return true;
        },
        checkPassword() {
            if (this.registerPasswordConfirm === '') {
                this.$toast.error('确认密码不能为空');
                return false;
            } else {
                if (this.registerPasswordConfirm !== this.registerPassword) {
                    this.$toast.error('两次密码输入不一致');
                    return false;
                }
            }
            return true;
        },
    },
}
</script>
<style scoped>
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 24px 36px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

button {
    background-color: #42b983;
    border: none;
    border-radius: 5px;
    padding: 8px 24px;
    color: #fff;
}

.modal-content h2 {
    text-align: center;
    color: #327f5c;
}

.form-group {
    margin-bottom: 12px;
    width: 100%;
}

.form-group input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    /*防止padding撑开宽度导致超过100%*/
}

.form-group input:focus {
    outline: 1px solid #42b983;
}

.form-group button {
    padding: 8px 12px;
    margin-left: 16px;
    font-size: 13px;
}

.input-container {
    display: flex;
    justify-content: space-between;
}

.btn-container {
    margin-top: 26px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
}

.blue {
    background-color: rgb(78, 191, 252);
}

/* You can reuse the existing styles for form, input, button, etc. */
</style>