<template>
  <div>
    <h1>Sign In</h1>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" requried />
      </div>
      <div>
        <label for="pass">Password</label>
        <input type="password" v-model="pass" id="pass" requried />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
// Dispatch an action on form submit to sign in the user
// 1. Map the actions form the store
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      pass: ""
    };
  },
  // 2. Add a method to SignIn.vue to be run on form submit
  methods: {
    ...mapActions(["signIn"]),

    onSubmit() {
      const formData = {
        email: this.email,
        password: this.pass
      };
      // 3. dispatch the action "signIp", and send the user data from the form
      this.signIn(formData);
    }
  }
};
</script>

<style>
form {
  padding: 20px;
  background: lemonchiffon;
  box-shadow: -2px 2px 6px;
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: block;
}

input,
button {
  padding: 5px 10px;
  margin: 5px 0;
}
</style>