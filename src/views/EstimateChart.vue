<template>
    <b-container v-if="vote">
        <div class="mt-4 mb-3 vote">{{vote.name}}</div>
        <b-row>
            <b-col class="mr-3">
                <chart v-if="!loading" 
                    :labels="chartLabels"
                    :datas="chartDatas"
                    @clickPoints="onClickPoints"></chart>
            </b-col>
        </b-row>
        <div class="label">{{points}}</div>
    </b-container>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Model, Vue, Prop } from 'vue-property-decorator';
import Chart from '@/components/Chart.vue';
import { Doughnut } from 'vue-chartjs';
import { Vote } from '@/domain/models/vote';
import { MemberVoteResult } from '@/domain/models/memberVoteResult';
import StoreService from '@/domain/api/store.service';
import SocketService from '@/domain/api/socket.service';
import MemberService from '@/domain/api/member.service';
import VoteService from '@/domain/api/vote.service';
import { Member } from '@/domain/models/member';
import { Socket } from 'vue-socket.io-extended';
import { MemberVote } from '@/domain/models/memberVote';
import { Master } from '@/domain/models/master';


@Component({
  components: {
      Chart
  },
})
export default class EstimateChart extends Vue {
    private componentKey: number = 0;
    private voteId!: number;
    private vote: Vote | undefined;
    private loading: boolean = false;
    private memberVoteResult!: MemberVoteResult | undefined;
    private points: string = '';
    private chartLabels: string[] = [];
    private chartDatas: number[] = [];
    
    async created() {
        this.voteId = +this.$route.params.voteId;
        await this.init();
    }

    async init() {
         this.loading = true;
        this.vote = this.getStoreVote();
        if (!this.vote) {
            console.warn('Vote is undefined; not found in store (master.votes)!', this.master.votes);
        }
        if (this.vote?.points) {
            this.points = this.vote.points;
        }
        await this.loadMemberVoteResult();
        this.initChartData();
        this.loading = false;
    }

    initChartData() {
        let pointsMap = new Map();
        let pointsCount = new Map();
        if (this.memberVoteResult) {
            for (let mv of this.memberVoteResult.memberVotes) {
                if (mv.points.length > 0) {
                    if (!pointsMap.has(mv.points)) {
                        pointsMap.set(mv.points, mv.points.toString() + ' Story Points');
                    }
                    if (!pointsCount.has(mv.points)) {
                        pointsCount.set(mv.points, 1);
                    }
                    else {
                        let count: number = pointsCount.get(mv.points);
                        pointsCount.set(mv.points, ++count);
                    }
                }
            }
        }
        let labels: string[] = [];
        for (let key of Array.from(pointsMap.keys())) {
            let labelValue: string = pointsMap.get(key);
            // rausfinden wie oft die X StoryPoints vorkommen und im LabelText ergänzen
            if (pointsCount.has(key)) {
                let pointsVorkommen: string = pointsCount.get(key);
                labels.push(pointsVorkommen + 'x ' + labelValue);
            }
        }
        this.chartLabels = labels;
        this.chartDatas = Array.from(pointsCount.values());
        console.log('CHART', this.chartLabels, this.chartDatas);
    }

    forceRerender() {
        this.componentKey += 1;
    }

    onBack() {
        this.$router.push({ name: 'Estimates' });
    }

    get Points(): string {
        return this.points;
    }

    get hasPoints(): boolean {
        return this.points.length > 0;
    }

    get hasMemberVotes(): boolean {
        if (!this.MemberVoteResult) {
            return false;
        }
        if (this.MemberVoteResult.memberVotes && this.MemberVoteResult.memberVotes.length > 0) {
            return true;
        }
        return false;
    }

    private hasMemberVoted(member: Member): boolean {
        if (!this.MemberVoteResult) {
            return false;
        }
         for (let mv of this.MemberVoteResult.memberVotes) {
            if (mv.member) {
                if (mv.member.id === member.id) {
                    return true;
                }
            }
        }
        return false;
    }

    @Socket('memberVoteChanged')
    async onMemberVoteChanged(result: any) {
        let currentMember: Member = result[0];
        let currentVote: Vote = result[1];
        let newPoints: string = result[2];
        this.loading = true;
        if (this.master && this.vote) {
            if (this.vote.id === currentVote.id) {
                this.updateChangedVote(currentMember, currentVote, newPoints);
                this.forceRerender();
            }
        }
        this.loading = false;
    }

    updateChangedVote(currentMember: Member, changedVote: Vote, newPoints: string) {
        let newMemberVotes: MemberVote[] = [];
        if (!this.memberVoteResult) {
            return;
        }
        for(let mv of this.memberVoteResult.memberVotes) {
            if (mv.member) {
                if (mv.member.id === currentMember.id) {
                    console.log('Update ', changedVote.name, newPoints);
                    mv.points = newPoints;
                }
            }
            newMemberVotes.push(mv);
        }
        this.memberVoteResult.memberVotes = newMemberVotes;
    }

    onAcceptVote(points: string) {
        this.points = points;
    }

    async onNeuSchaetzen() {
        if (this.vote) {
            // 1) memberVotes löschen!
            const isDeleted: boolean | undefined = await MemberService.deleteMemberVotesByVote(this.vote);
            if (isDeleted) {
                // 2) Vote: Status auf running setzen und StoryPoints löschen!
                const newStateVote: Vote | undefined = await VoteService.setRunningAndDeletePoints(this.vote);
                if (newStateVote) {
                    this.vote = newStateVote;
                    this.points = '';
                    // 3) Clients benachrichtigen
                    SocketService.emitMasterVoteChanged(this.master, this.vote);
                    // 4) Store updaten
                    await StoreService.reloadMember();
                    // 5) Members mit leeren Schätzungen anzeigen
                    this.deleteMemberVotes();
                    this.forceRerender();
                }
            }
        }
    }

    deleteMemberVotes() {
        if (this.memberVoteResult) {
            this.memberVoteResult.memberVotes = [];
            this.setUnvotedMembers();
        }
    }

    async onSaveStoryPoints() {
        if (this.vote) {
            await VoteService.setDone(this.vote, this.points);
            await StoreService.reloadMemberVotesIsRunning();
            SocketService.emitMasterVoteChanged(this.master, this.vote);
            this.$router.push({ name: 'Estimates' });
        }
    }

    getStoreVote(): Vote | undefined {
        for(let v of this.master.votes) {
            if(v.id === this.voteId) {
                return v;
            }
        }
    }

    async loadMemberVoteResult(): Promise<void> {
        if (this.vote) {
            const result = await MemberService.getMemberVotesResult(this.vote);
            if (result) {
                this.memberVoteResult = result;
                console.log('LoadMemberVoteResult: ', this.memberVoteResult);
                this.setUnvotedMembers();
            }
        }
    }

    setUnvotedMembers() {
        for (let m of this.master.members) {
            if (this.hasMemberVoted(m)) {
                continue;
            }
            if (this.memberVoteResult) {
                let unvotedMemberVote: MemberVote = { vote: this.vote, member: m, points: '', note: '' };
                this.memberVoteResult.memberVotes.push(unvotedMemberVote);
            }
        }
    }

    get MemberVoteResult(): MemberVoteResult | undefined {
        return this.memberVoteResult;
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.vote);
    }

    get isDone(): boolean {
        return VoteService.isDone(this.vote);
    }

    get master(): Master {
        return this.$store.getters.master;
    }

    get isLogin(): boolean {
        return StoreService.isLogin;
    }

    async onStartVote() {
        if (!this.vote) {
            return;
        }
        if (VoteService.isOpen(this.vote)) {
            const newVote = await VoteService.setRunning(this.vote);
            if (newVote) {
                SocketService.emitMasterVoteChanged(this.master, this.vote);
                this.vote = newVote;
                await StoreService.reloadMaster();
            }
        }
    }

    onClickPoints(clickedPoints: string) {
        this.points = clickedPoints;
    }

     get stateColor() {
        if (this.isRunning) {
            return { 
                'color': '#28a745'
            }    
        }
        if (this.isDone) {
            return {
                'color': '#0275d8'
            }
        }
        if (this.isOpen) {
            return {
                'color': '#d9534f'
            }
        }
        return {
            'color': 'black'
        }
     }

   setChartText() {    
        var chart: any = document.getElementById('doughnut-chart');
        var context = chart.getContext("2d");
        context.fillStyle = "red";
        context.font = "bold 18px Arial";
        context.fillText("myChart", (chart.width / 2) - 17, (chart.height / 2) + 8);
    }
}
</script>

<style scoped>
    .small {
        max-width: 600px;
        margin:  150px auto;
    }
    .vote {
        font-size: 26px;
        font-weight: 700;
    }
    .label {
        position: relative;
        font-size: 40px;
        font-weight: 900;
        color: blue;
        top: -130px;
    }
</style>