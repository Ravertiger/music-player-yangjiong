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
      <p>忘记密码？</p>
    </div>
    <RegisterCom v-if="showRegisterCom" @closeModal="closeRegisterCom" />
  </div>
</template>

<script>
import RegisterCom from '@/components/RegisterCom.vue';
export default {
  data() {
    return {
      showRegisterCom: false,
      username: '',
      password: '',
      usernamePlaceholder: '请输入用户名',
      passwordPlaceholder: '请输入密码',
    };
  },
  components: {
    RegisterCom,
  },
  methods: {
    login() {
      // Implement your login logic here
      console.log('Logging in with:', this.username, this.password);
      // You may want to add authentication logic here
      // For simplicity, we're just logging the input values for now
    },
    closeRegisterCom() {
      this.showRegisterCom = false
    }
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
