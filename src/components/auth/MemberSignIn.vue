<template>
    <div class="header">
        <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
         <div v-if="member">
            <h5>Hallo {{member.name}}</h5>
            <small>Melde dich an mit PIN und Key</small>
            <b-input class="mt-2" type="number" v-model=memberPin @focus="onChange()"></b-input>
            <b-input class="mt-2" type="password" v-model=memberKey @focus="onChange()"></b-input>
            <div class="mt-2">
                <b-button block variant="success" @click="onLogin()">Login</b-button>
            </div>
            <div v-if="ErrorMsg" class="message-error mt-2">
                <small>{{ErrorMsg}}</small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator'
import MasterService from '@/domain/api/master.service'
import { Master } from '@/domain/models/master';
import { Member, MemberState } from '@/domain/models/member';
import { StoreActions } from '@/store';
import { StoreMember } from '@/domain/models/storeMember';
import MemberService from '@/domain/api/member.service';
import { MemberVote } from '@/domain/models/memberVote';
import StoreService from '@/domain/api/store.service';
import SocketService from '../../domain/api/socket.service';

@Component({
  components: {
  }
})
export default class MemberSignIn extends Vue {
    private disabled: boolean = false;
    private loading = false;
    private memberPin!: number;
    private memberKey!: string;
    private masterUid!: string;
    private errorMsg: string = '';
    private master: Master | undefined;
    @Model() private member: Member | undefined;

    async created() {
        this.memberPin = +this.$route.params.nr;
        this.masterUid = this.$route.params.masterUid;
        this.loading = true;
        this.master = await MasterService.getMasterByUid(this.masterUid);
        this.findMasterMember();
        this.loading = false;
    }

    findMasterMember() {
        if (this.master) {
            for (let m of this.master.members) {
                if (m.pin === this.memberPin) {
                    this.member = m;
                }
            }
        }
    }

    get ErrorMsg(): string {
        return this.errorMsg;
    }

    onChange() {
        this.errorMsg = '';
    }

    async onLogin (): Promise<void> {
        if (this.master) {
            if (this.member) {
                if (this.member.pin === this.memberPin) {
                    if (this.memberKey === this.member.name) {
                        let memberVotes: MemberVote[] | undefined = await this.loadMemberVotes();
                        if (!memberVotes) {
                            memberVotes = [];
                        }
                        // MemberState ändern
                        this.member.state = MemberState.ONLINE;
                        const onlineMember: Member | undefined = await MemberService.updateMember(this.member);
                        if (onlineMember) {
                            await StoreService.setStoreMember(onlineMember, this.master.uid, memberVotes);
                            // Clients benachrichtigen
                            SocketService.emitMemberStateChanged(onlineMember);
                            // zur Member-Ansicht wechseln
                            this.$router.push({ name: 'Member' })
                        }
                    }
                }
            }
        }
        this.errorMsg = 'Anmeldung fehlgeschlagen: Falsche Pin und/oder Key!';
    }

    async loadMemberVotes(): Promise<MemberVote[] | undefined> {
        if (this.member) {
            const result = await MemberService.getMemberVotes(this.member);
            if (result) {
                return result;
            }
        }
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
