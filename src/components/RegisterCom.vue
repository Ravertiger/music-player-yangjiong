<template>
  <div class="modal-container" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>注册</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <input type="text" id="register-username" v-model="registerUsername" placeholder="用户名" required>
        </div>
        <div class="form-group">
          <input type="password" id="register-password" v-model="registerPassword" placeholder="密码" required>
        </div>
        <div class="form-group">
          <input type="password" id="register-password" v-model="registerPasswordConfirm" placeholder="确认密码" required>
        </div>
        <div class="form-group">
          <input type="text" id="register-username" v-model="registerEmail" placeholder="邮箱" required>
        </div>
        <div class="form-group">
          <input type="text" id="register-username" v-model="EmailCode" placeholder="邮箱验证码" required>
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
export default {
  data() {
    return {
      registerUsername: '',
      registerPassword: '',
      registerPasswordConfirm: '',
      registerEmail: '',
      EmailCode: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    register() {
      // Implement your registration logic here
      console.log('Registering with:', this.registerUsername, this.registerPassword);
      // You may want to add registration logic here
      // For simplicity, we're just logging the input values for now
      this.closeModal(); // Close the modal after registration
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
}

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group input:focus{
  outline: 1px solid #42b983;
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
  