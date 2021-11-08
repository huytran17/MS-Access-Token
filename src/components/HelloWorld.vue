<template>
  <div class="hello">
    <a :href="loginUrl">Login</a>
    <button v-if="authorization_code" @click="onGetToken">Get token</button>
    <button v-if="refreshToken" @click="onRefreshToken">Refresh token</button>
    <p>Token: {{ accessToken }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { encode as base64encode } from "base64-arraybuffer";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  computed: {
    refreshToken() {
      return this.refresh_token;
    },

    accessToken() {
      return this.access_token;
    },
  },

  data() {
    return {
      loginUrl: process.env.VUE_APP_AUTH_ENDPOINT,
      code_challenge: "",
      authorization_code: "",
      refresh_token: "",
      access_token: "",
    };
  },

  async created() {
    await this.generateURLParams();
  },

  mounted() {
    this.getAuthorizationCode();
  },

  methods: {
    async onGetToken() {
      var data = new FormData();

      data.append("grant_type", process.env.VUE_APP_GRANT_TYPE);
      data.append("client_id", process.env.VUE_APP_CLIENT_ID);
      data.append("scope", process.env.VUE_APP_SCOPE);
      data.append("redirect_uri", process.env.VUE_APP_REDIRECT_URI);
      data.append("code", this.authorization_code);
      data.append("code_verifier", process.env.VUE_APP_CODE_VERIFIER);

      await axios({
        method: "post",
        url: process.env.VUE_APP_TOKEN_ENDPOINT,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          this.refresh_token = response.data.refresh_token;
          this.access_token = response.data.access_token;
          console.log(this.access_token);
        })
        .catch((response) => {
          console.log(response);
        });
    },

    async onRefreshToken() {
      var data = new FormData();

      data.append("client_id", process.env.VUE_APP_CLIENT_ID);
      data.append("scope", process.env.VUE_APP_SCOPE);
      data.append("refresh_token", this.refresh_token);
      data.append("grant_type", "refresh_token");

      await axios({
        method: "post",
        url: process.env.VUE_APP_TOKEN_ENDPOINT,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          this.refresh_token = response.data.refresh_token;
          this.access_token = response.data.access_token;

          console.log(response);
        })
        .catch((response) => {
          console.log(response);
        });
    },

    getAuthorizationCode() {
      let params = new URL(document.location).searchParams;

      if (params && params.get("code"))
        this.authorization_code = params.get("code");
    },

    async generateCodeChallenge() {
      const encoder = new TextEncoder();
      const data = encoder.encode(process.env.VUE_APP_CODE_VERIFIER);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      const base64Digest = base64encode(digest);
      // you can extract this replacing code to a function
      return base64Digest
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    },

    async generateURLParams() {
      await this.generateCodeChallenge().then((challenge) => {
        this.code_challenge = challenge;
      });

      this.loginUrl = new URL(this.loginUrl);

      this.loginUrl.searchParams.append(
        "client_id",
        process.env.VUE_APP_CLIENT_ID
      );
      this.loginUrl.searchParams.append("scope", process.env.VUE_APP_SCOPE);
      this.loginUrl.searchParams.append(
        "response_type",
        process.env.VUE_APP_RESPONSE_TYPE
      );
      this.loginUrl.searchParams.append(
        "redirect_uri",
        process.env.VUE_APP_REDIRECT_URI
      );
      this.loginUrl.searchParams.append(
        "response_mode",
        process.env.VUE_APP_RESPONSE_MODE
      );
      this.loginUrl.searchParams.append(
        "code_challenge_method",
        process.env.VUE_APP_CODE_CHALLENGE_METHOD
      );
      this.loginUrl.searchParams.append("code_challenge", this.code_challenge);
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
