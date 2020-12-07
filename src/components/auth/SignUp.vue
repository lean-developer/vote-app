<template>
<div class="header">
  <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
  <b-form @submit="onSubmit" @reset="onReset">
    <!-- Name -->
    <b-row>
      <b-col class="ml-4 mr-4 mb-2">
        <b-form-input type="text" v-model="_name" placeholder="Enter your name"></b-form-input>
      </b-col>
    </b-row>
     <!-- Email -->
    <b-row>
      <b-col class="ml-4 mr-4 mb-2">
        <b-form-input type="email" v-model="_email" placeholder="Enter your email"></b-form-input>
      </b-col>
    </b-row>
     <!-- PW -->
    <b-row>
      <b-col class="ml-4 mr-4 mb-2">
        <b-form-input type="password" v-model="_pw" placeholder="Enter your password"></b-form-input>
      </b-col>
    </b-row>
     <!-- PW-Wiederholung -->
    <b-row>
      <b-col class="ml-4 mr-4 mb-2">
        <b-form-input type="password" v-model="_pw2" placeholder="Repeat password"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-1">
        <b-button :disabled=disabled variant="outline-success" @click="onRegister()">Registrieren</b-button>
      </b-col>
      <b-col v-if="loginResult">
        <label class="mt-1" :class="[loginResult.isAuth ? 'message-ok' : 'message-error']">{{loginResult.message}}</label>
      </b-col>
    </b-row>
  </b-form>
</div>
</template>

<script lang="ts">
import { Component, Vue, Model, Emit } from 'vue-property-decorator'
import LoginService from '@/domain/api/login.service'
import MasterService from '@/domain/api/master.service'
import { User } from '@/domain/models/user'
import { LoginResult } from '@/domain/models/loginResult'
import { StoreActions } from '@/store'
import { Master } from '@/domain/models/master'

@Component({
  components: {
  }
})
export default class SignUp extends Vue {
    @Model() private _loginResult!: LoginResult
    @Model() private _name = ''
    @Model() private _email = ''
    @Model() private _pw = ''
    @Model() private _pw2 = ''
    private disabled: boolean = false;
    private loading = false;

    async onRegister () {
        if (this.pw !== this.pw2) {
            this.loginResult = {
                code: 'FALSE',
                message: 'Passwörter stimmen nicht überein',
                isAuth: false
            }
            this.pw = '';
            this.pw2 = '';
            return;
        }
        this.disabled = true;
        this.loading = true;
        const result = await LoginService.register(this.email, this.pw);
        if (result) {
            this.loginResult = result;
            if (this.loginResult.isAuth) {
                this.onLogin();
            }
            else {
                this.pw = '';
                this.pw2 = '';
            }
        }
    }

    async onLogin (): Promise<void> {
      const result = await LoginService.login(this.email, this.pw)
      if (result) {
        this.loginResult = result
        if (this.loginResult.isAuth) {
            if (this.loginResult.user) {
                await LoginService.updateDisplayName(this.loginResult.user.token, this.name);
                // Master anlegen
                const master: Master | undefined = await MasterService.createMaster(this.name, this.loginResult.user.uid);
                if (master) {
                    await this.$store.commit(StoreActions.SaveMaster, master);
                }
            }
            await this.$store.commit(StoreActions.SaveUser, this.loginResult.user)
            this.disabled = false;
            this.loading = false;
            this.$router.push({ name: 'Home' })
        }
      }
      this.disabled = false;
      this.loading = false;
    }

    onSubmit () {
      console.log('SUBMIT')
    }

    onReset () {
      console.log('RESET')
    }

    get loginResult (): LoginResult {
      return this._loginResult
    }

    set loginResult (loginResult: LoginResult) {
      this._loginResult = loginResult
    }

    set name (name: string) {
      this._name = name
    }

    get name (): string {
      return this._name
    }

    set email (email: string) {
      this._email = email
    }

    get email (): string {
      return this._email
    }

    set pw (pw: string) {
      this._pw = pw
    }

    get pw (): string {
      return this._pw
    }

    set pw2 (pw2: string) {
      this._pw2 = pw2
    }

    get pw2 (): string {
      return this._pw2
    }
}
</script>

<style scoped>
    .header {
        margin-top: 2rem;
    }
    .message-ok {
      color: blue;
    }
    .message-error {
      color: red;
    }
</style>
