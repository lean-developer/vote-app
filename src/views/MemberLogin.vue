<template>
  <b-container>
      <member-sign-in></member-sign-in>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import MemberSignIn from '@/components/auth/MemberSignIn.vue'
import { LoginResult } from '@/domain/models/loginResult';

@Component({
  components: {
      MemberSignIn
  }
})
export default class Login extends Vue {
}
</script>
