<template>
  <div class="about">
    <h1>This is an about page</h1>
    <b-button @click="onEmit()">Socket-Test</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class About extends Vue {

  onEmit() {
     // Client benachrichtigen
    this.$socket.client.emit('memberLogin', null);
  }
}
</script>
