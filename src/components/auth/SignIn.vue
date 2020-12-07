<template>
<div class="header">
    <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
    <b-form @submit="onSubmit" @reset="onReset">
     <!-- Email -->
    <b-row>
      <b-col class="ml-4 mr-4 mb-2">
        <b-form-input type="email" v-model="email" placeholder="email/username"></b-form-input>
      </b-col>
    </b-row>
     <!-- PW -->
    <b-row>
      <b-col class="ml-4 mr-4 mb-2">
        <b-form-input type="password" v-model="pw" placeholder="password"></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-1">
        <b-button :disabled=disabled variant="outline-success" @click="onLogin()">Anmelden</b-button>
      </b-col>
      <b-col v-if="loginResult">
        <label class="mt-1" :class="[loginResult.isAuth ? 'message-ok' : 'message-error']">{{loginResult.message}}</label>
      </b-col>
    </b-row>
    </b-form>
</div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator'
import LoginService from '@/domain/api/login.service'
import MasterService from '@/domain/api/master.service'
import { LoginResult } from '@/domain/models/loginResult'
import { User } from '@/domain/models/user'
import { StoreActions } from '@/store'
import { Master } from '@/domain/models/master'

@Component({
  components: {
  }
})
export default class SignIn extends Vue {
    @Model() private _loginResult!: LoginResult;
    @Model() private _email = '';
    @Model() private _pw = '';
    private disabled: boolean = false;
    private loading = false;

    async onLogin (): Promise<void> {
      this.disabled = true;
      this.loading = true;
      const result = await LoginService.login(this.email, this.pw)
      if (result) {
        this.loginResult = result
        if (this.loginResult.isAuth) {
             if (this.loginResult.user) {
                // Master laden 
                const master: Master | undefined = await MasterService.getMasterByUid(this.loginResult.user.uid);
                if (!master) {
                    // kein Master gefunden -> neu anlegen
                    let name: string = this.loginResult.user.name;
                    if (!name) {
                        name = this.loginResult.user.email;
                    }
                    const newMaster: Master | undefined = await MasterService.createMaster(name, this.loginResult.user.uid);
                    if (newMaster) {
                        await this.$store.commit(StoreActions.SaveMaster, newMaster);
                    }
                } else {
                    await this.$store.commit(StoreActions.SaveMaster, master);
                }
            }
          await this.$store.commit(StoreActions.SaveUser, this.loginResult.user)
          this.loading = false;
          this.$router.push({ name: 'Home' })
        }
        this.disabled = false;
        this.loading = false;
      }
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

    get messageClass (): string {
      if (this.loginResult && this.loginResult.isAuth) {
        return '.message-ok'
      }
      return '.message-error'
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
