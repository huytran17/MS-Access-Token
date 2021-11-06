<template>
  <div class="hello">
    <button @click="onGetToken">Get Token</button>
    <button @click="$msal.signIn()">Login</button>
    <button @click="$msal.signOut()">Logout</button>

    <div>
      <p>Access token: {{ access_token }}</p>
      <p>ID token: {{ id_token }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  data() {
    return {
      access_token: "",
      id_token: "",
    };
  },

  methods: {
    onGetToken() {
      if (this.$msal.data) {
        this.access_token = this.$msal.data.accessToken;

        this.id_token = this.$msal.data.idToken;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
