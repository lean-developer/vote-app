<template>
  <b-container>
      <b-card no-body>
          <b-tabs v-model="tabIndex" card style="height: 25rem;">
              <b-tab no-body title="Anmelden">
                <sign-in></sign-in>
            </b-tab>
            <b-tab no-body title="Neu registrieren">
                <sign-up></sign-up>
            </b-tab>
          </b-tabs>
      </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import SignUp from '@/components/auth/SignUp.vue'
import SignIn from '@/components/auth/SignIn.vue'
import { LoginResult } from '@/domain/models/loginResult';

@Component({
  components: {
    SignUp,
    SignIn
  }
})
export default class Login extends Vue {
}
</script>
