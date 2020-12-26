<template>
    <b-container>
        <b-row>
            <b-col>
                <div v-if="points" class="label">{{Points}}</div>
                <div v-if="!points" class="label">-</div>
            </b-col>
        </b-row>
        <b-row>
             <b-col>
                <b-button variant="outline-danger" block>Neu schätzen</b-button>
            </b-col>
            <b-col>
                <b-button variant="success" block>Übernehmen</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import { SaveVotePoints } from '@/domain/models/saveVotePoints';
import VoteService from '@/domain/api/vote.service';
import MemberService from '@/domain/api/member.service';
import MemberVoting from '@/components/MemberVoting.vue';
import { MemberVote } from '@/domain/models/memberVote';
import { Member } from '@/domain/models/member';
import { Master } from '@/domain/models/master';

@Component({
  components: {
  },
})
export default class EstimateVoting extends Vue {
    @Prop({ required: true }) points!: string;

    get Points(): string {
        if (Number.isInteger(+this.points)) {
            return this.points;
        }
        return '-';
    }
}
</script>


<style scoped>
    .label {
        /* font-family: 'Krona One', sans-serif; */
        font-family: 'Luckiest Guy', cursive; 
        font-size: 60px;
        color: blue;
    }
</style>