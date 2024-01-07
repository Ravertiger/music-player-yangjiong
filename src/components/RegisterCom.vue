<template>
  <div class="modal-container">
    <div class="modal-content" @click.stop>
      <h2>注册</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <input type="text" id="username" v-model="registerUsername" placeholder="用户名" required>
        </div>
        <div class="form-group">
          <input type="password" id="password" v-model="registerPassword" placeholder="密码" required>
        </div>
        <div class="form-group">
          <input type="password" id="confirm-password" v-model="registerPasswordConfirm" placeholder="确认密码" required>
        </div>
        <div class="form-group">
          <div class="input-container">
            <input type="text" id="email" v-model="registerEmail" placeholder="邮箱" required>
            <button type="button" @click="sendEmail">发送验证码</button>
          </div>
        </div>
        <div class="form-group">
          <input type="text" id="emailCode" v-model="EmailCode" placeholder="邮箱验证码" required>
        </div>
        <div class="btn-container">
          <button type="submit">注册</button>
          <button class="blue" type="button" @click="closeModal">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script>
import http from '@/utils/http';
export default {
  data() {
    return {
      registerUsername: '',
      registerPassword: '',
      registerPasswordConfirm: '',
      registerEmail: '',
      EmailCode: '',
      countDown: 0, // 验证码发送计时器，
      buttonText: '发送验证码', // 验证码按钮文本
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    register() {
      if (!this.checkPasswordFormat()) return; // 验证密码格式
      if (!this.checkPassword()) return; // 验证两次密码输入是否一致
      http.post('/register', {
        username: this.registerUsername,
        password: this.registerPassword,
        email: this.registerEmail,
        emailCode: this.EmailCode,
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
      if (this.countDown > 0) return; // 倒计时中不允许发送验证码
      if (!this.checkEmail()) return; // 验证邮箱格式
      // 发送验证码请求
      http.post('/sendEmail', {
        email: this.registerEmail,
      }).then((res) => {

        if (res.data.code === 200) {
          this.$toast.success(res.data.msg);
        } else {
          this.$toast.error(res.data.msg);
        }
      }).catch((error) => {
        console.error('发送验证码请求失败:', error);
        this.$toast.error('发送验证码失败');
      });
    },

    setSendEmailButton() {
      // 启动定时器
      this.countDown = 30;
      const timer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1;
          this.buttonText = `${this.countDown}s后重发`;
        } else {
          this.buttonText = '发送验证码';
          clearInterval(timer);
        }
      }, 1000);
    },

    checkEmail() {
      if (this.registerEmail === '') {
        this.$toast.error('邮箱不能为空');
        return false;
      } else {
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
        if (!reg.test(this.registerEmail)) {
          this.$toast.error('邮箱格式不正确');
          return false;
        }
      }
      return true;
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
};
</script>
  
<style scoped>
/* Add your modal styling here */
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
  padding: 48px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

button {
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  padding: 8px 24px;
  color: #fff;
  cursor: pointer;
}

button:focus {
  outline: none;
}

button:active {
  background-color: #327f5c;
}

button:hover {
  background-color: #4ee19f;
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
  