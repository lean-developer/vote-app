<template>
        <div class="voting">
            <b-row>
                <b-col>
                    <div v-if="points" class="label">{{Points}}</div>
                    <div v-if="!points" class="label">-</div>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button variant="outline-danger" block @click="onNeuSchaetzen()">Neu schätzen</b-button>
                </b-col>
                <b-col>
                    <b-button variant="success" block @click="onSaveStoryPoints()">Übernehmen</b-button>
                </b-col>
            </b-row>
        </div>
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

    @Emit('neuSchaetzen')
    onNeuSchaetzen() {
        return true;
    }

    @Emit('saveStoryPoints')
    onSaveStoryPoints() {
        return this.points;
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
    .voting {
        position: relative;
        margin-top: -30px;
    }
    @media only screen and (max-width: 700px) {
    .voting {
        margin-top: -120px;
    }
}
</style>