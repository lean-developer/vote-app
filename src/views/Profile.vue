<template>
    <b-container>
        <div>
            Profile
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
import MasterService from '@/domain/api/master.service'

@Component({
  components: {
  },
})
export default class Profile extends Vue {
}
</script>