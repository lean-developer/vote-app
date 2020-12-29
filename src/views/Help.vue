<template>
    <b-container>
        <div>
            <div v-if="IsMaster">
                Help Master
            </div>
            <div v-if="!IsMaster && IsMember">
                Help Member
            </div>
        </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
import MasterService from '@/domain/api/master.service'
import { Vote } from '@/domain/models/vote';
import UserChips from '@/components/UserChips.vue';
import NewVoteComp from '@/components/NewVoteComp.vue';
import NewMemberComp from '@/components/NewMemberComp.vue';
import { Master } from '@/domain/models/master';
import { StoreActions } from '../store';
import { Member } from '@/domain/models/member';
import VoteService from '@/domain/api/vote.service';
import StoreService from '@/domain/api/store.service';
import { Socket } from 'vue-socket.io-extended';
import { mutations } from '@/store';
import { StoreMember } from '@/domain/models/storeMember';

@Component({
  components: {
  },
})
export default class Help extends Vue {
    
    get StoreMember(): StoreMember {
        return this.$store.getters.member;
    }
  
    get Master(): Master {
        return this.$store.getters.master;
    }

    get IsMaster(): boolean {
        return this.Master.uid !== '';
    }

    get IsMember(): boolean {
        return this.StoreMember.uid !== '';
    }
}
</script>