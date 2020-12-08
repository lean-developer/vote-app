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
            <div v-if="errorMsg" class="message-error mt-2">
                <small>{{errorMsg}}</small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator'
import MasterService from '@/domain/api/master.service'
import { Master } from '@/domain/models/master';
import { Member } from '@/domain/models/member';
import { StoreActions } from '@/store';
import { StoreMember } from '@/domain/models/storeMember';

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
    @Model() private errorMsg: string = '';
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

    onChange() {
        this.errorMsg = '';
    }

    async onLogin (): Promise<void> {
        if (this.member?.pin === this.memberPin) {
            if (this.memberKey === this.member.name) {
                const storeMember: StoreMember = { pin: this.member.pin, uid: this.masterUid, name: this.member.name };
                await this.$store.commit(StoreActions.SaveMember, storeMember);
                this.$router.push({ name: 'Member' })
            }
        }
        this.errorMsg = 'Anmeldung fehlgeschlagen: Falsche Pin und/oder Key!'
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
