import Vue from "vue";
import Vuex from "vuex";
import axiosAuth from "./axios-auth";
import router from "./router";
// import fresh axios instance
import globalAxios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    error: "",
    user: null
  },

  mutations: {
    // 6. Add a mutation to update the state
    AUTH_USER(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    SET_ERROR(state, errorMessage) {
      state.error = errorMessage;
    },
    EMPTY_ERROR(state) {
      state.error = "";
    },
    CLEAR_DATA(state) {
      state.idToken = null;
      state.userId = null;
    },
    STORE_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    // // 4. Add signUp action for sending the data to axios
    signUp({ commit, dispatch }, authData) {
      axiosAuth
        .post("accounts:signUp?key=AIzaSyDhUBUDrU2y_LNsDb7bJU0C_w_6ACswkCw", {
          // data from SignUp.vue
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })

        .then(res => {
          console.log(res);

          // 5. Get the auth token from the response (URL前半部分在axios-auth.js里)save the auth info in the state
          commit("AUTH_USER", {
            token: res.data.idToken,
            userId: res.data.localId
          });

          // add the expiration time on the local storage
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          );

          // save the response tokens into the local storage
          localStorage.setItem("token", res.data.idToken);
          localStorage.setItem("userId", res.data.localId);
          localStorage.setItem("expirationDate", expirationDate);

          // save email to local storage
          localStorage.setItem("userEmail", authData.email);

          this.dispatch("storeUser", authData);

          router.push({ name: "dashboard" });
        })

        // display any errors form the catch on the page instead of in the console
        .catch(error => {
          if (error.response) {
            console.log(error.response.data.error.message);
            commit("SET_ERROR", error.response.data.error.message);
          }
        });
    }, // closing Sign Up

    // 4. Add signIn action for sending the data to axios
    signIn({ commit }, authData) {
      axiosAuth
        .post(
          "accounts:signInWithPassword?key=AIzaSyDhUBUDrU2y_LNsDb7bJU0C_w_6ACswkCw",
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          }
        )
        .then(res => {
          console.log(res);

          // 5. Get the auth token from the response and save it in the state
          commit("AUTH_USER", {
            token: res.data.idToken,
            userId: res.data.localId
          });

          // add the expiration time on the local storage
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          );

          // save the response tokens into the local storage
          localStorage.setItem("token", res.data.idToken);
          localStorage.setItem("userId", res.data.localId);
          localStorage.setItem("expirationDate", expirationDate);

          // save email to local storage
          localStorage.setItem("userEmail", authData.email);

          router.push({ name: "dashboard" });
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data.error.message);
            commit("SET_ERROR", error.response.date.error.message);
          }
        });
    }, // closing signIn

    clearError({ commit }) {
      commit("EMPTY_ERROR");
    },

    // clear the local storage and clear the state
    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationDate");
      localStorage.removeItem("userId");

      // commit mutation to clear the state
      commit("CLEAR_DATA");

      // send user to signin page
      router.push({ name: "signin" });
    },

    // store local storage in state
    autoLogin({ commit }) {
      const token = localStorage.getItem("token");
      const expirationDate = localStorage.getItem("expirationDate");
      const userId = localStorage.getItem("userId");

      const now = new Date();
      if (now >= expirationDate) {
        return;
      }
      commit("AUTH_USER", {
        token: token,
        userId: userId
      });
    },

    storeUser({ state }, userData) {
      if (!state.idToken) {
        // log out
        return;
      }
      // send user infor to database
      // Authenticate REST Requests: https://firebase.google.com/docs/database/rest/auth?authuser=0
      globalAxios
        .post(
          "https://guo00090-week-12-auth.firebaseio.com/users.json" +
            "?auth=" +
            state.idToken,
          userData
        )
        .then(res => console.log(res))
        .catch(error => console.log(error.message));
    },

    fetchUser({ commit, state }, userEmail) {
      if (!state.idToken) {
        return;
      }
      globalAxios
        .get(
          "https://guo00090-week-12-auth.firebaseio.com/users.json" +
            "?auth=" +
            state.idToken
        )
        .then(res => {
          const data = res.data;
          for (let key in data) {
            const user = data[key];
            if (user.email == userEmail) {
              console.log(user);
              user.id = key;
              commit("STORE_USER", user);
            }
          }
        });
    },

    updateUser({ state }) {
      globalAxios
        .patch(
          "https://guo00090-week-12-auth.firebaseio.com/users/" +
            state.user.id +
            ".json" +
            "?auth=" +
            state.idToken,
          { name: state.user.name }
        )
        .then(res => {
          console.log(res);
        })
        .catch(error => console.log(error.response));
    }
  },

  getters: {
    isAuthenticated(state) {
      // return token only if it is null
      return state.idToken !== null;
    },
    getUser(state) {
      return state.user;
    }
  }
});
// AIzaSyDhUBUDrU2y_LNsDb7bJU0C_w_6ACswkCw
