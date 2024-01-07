<template>
  <div class="login-container">
    <h1>泠泠七弦上，静听松风寒</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <input type="text" id="username" v-bind:placeholder="usernamePlaceholder" v-model="username" required>
      </div>
      <div class="form-group">
        <input type="password" id="password" v-bind:placeholder="passwordPlaceholder" v-model="password" required>
      </div>
      <div class="btn-container">
        <button type="submit">登录</button>
        <button class="blue" type="button" @click="showRegisterCom = true">注册</button>
      </div>
    </form>
    <div class="forgot-account">
      <p @click="showForgetPsw = true">忘记密码？</p>
    </div>
    <RegisterCom v-if="showRegisterCom" @closeModal="showRegisterCom = false" />
    <ForgetPsw v-if="showForgetPsw" @closeModal="showForgetPsw = false" />
  </div>
</template>

<script>
import RegisterCom from '@/components/RegisterCom.vue';
import ForgetPsw from '@/components/ForgetPsw.vue';
import http from '@/utils/http';
export default {
  data() {
    return {
      showRegisterCom: false, // 是否显示注册组件
      showForgetPsw: false, // 是否显示忘记密码组件
      username: '',
      password: '',
      usernamePlaceholder: '邮箱',
      passwordPlaceholder: '密码',
    };
  },
  components: {
    RegisterCom, // 注册两个弹窗型组件（注册和忘记密码）
    ForgetPsw,
  },
  methods: {
    login() { // 登录方法
      http.post('/login', {
        email: this.username,
        password: this.password,
      }).then((res) => {
        if (res.data.code === 200) {
          this.$toast.success(res.data.msg);
          localStorage.setItem('yltoken', res.data.yltoken);
          this.$router.push('/home');
        } else {
          this.$toast.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgb(250, 250, 250);
  animation-name: pulse;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes pulse {
  0% {
    background-color: rgb(255, 252, 252);
  }

  25% {
    background-color: rgb(176, 232, 229);
  }

  50% {
    background-color: rgb(196, 228, 246);
  }

  100% {
    background-color: rgb(255, 255, 255);
  }
}

h1 {
  font-size: 60px;
  text-align: center;
  color: #327f5c;
}

.form-group {
  margin: 12px 0;
  position: relative;
}

.form-group input:focus {
  outline: 1px solid #42b983;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #42b983;
}

input {
  padding: 12px;
  border: none;
  border-radius: 5px;
}

button {
  margin-top: 24px;
  background-color: #42b983;
  color: white;
  padding: 10px 25px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

.blue {
  background-color: rgb(78, 191, 252);
}

.forgot-account {
  margin-top: 12px;
}

.forgot-account p {
  font-size: small;
  cursor: pointer;
}

.forgot-account p:hover {
  color: #42b983;
}
</style>
