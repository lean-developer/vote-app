<template>
  <b-container>
      MEMBER
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import StoreService from '@/domain/api/store.service';
import { Master } from '@/domain/models/master';

@Component({
  components: {
  },
})
export default class Member extends Vue {
}
</script>
