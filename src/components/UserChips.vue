<template>
    <div>
        <b-col>
            <div class="chip" v-if="name">
                <b-avatar>
                    {{initials}}
                </b-avatar>
                <div class="ml-2 round-box" :style="rowState">
                </div>
                <div class="ml-4" style="display: inline;">
                {{name}}
                </div>
                <span class="closebtn" @click="onClose()">&times;</span>
            </div>
            <div v-if="pin" class="link">
                <b-link :to=link>{{pin}}</b-link>
            </div>
        </b-col>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator';
import MasterService from '@/domain/api/master.service';
import StoreService from '@/domain/api/store.service';
import { DeleteResult } from '@/domain/models/deleteResult';
import { Member } from '@/domain/models/member';
import { Socket } from 'vue-socket.io-extended';

@Component({
  components: {
  },
})
export default class UserChips extends Vue {
    @Prop({ required: true }) member!: Member;

    async onClose() {
        const deleteResult: DeleteResult | undefined = await MasterService.deleteMemberOfMaster(StoreService.master.id, this.member.id);
        if(deleteResult?.affected) {
            if(deleteResult.affected) {
                await StoreService.reloadMaster();
            }
        }
    }

    get state(): string {
        if (this.member.state) {
            return this.member.state;
        }
        return '';
    }

    get name(): string {
        return this.member.name;
    }

    get pin(): number {
        if(this.member.pin) {
            return this.member.pin;
        }
        return 0;
    }

    get link(): string {
        return '/member/' + this.pin + '/login/' + StoreService.master.uid;
    }

    get initials(): string {
        return this.member.name.substring(0, 2).toUpperCase();
    }

    get rowState() {
         if (this.state) {
            return { 
                'display': 'inline',
                'background-color': '#54da73'
            }    
        }
        return { 
            'display': 'inline',
            'background-color': 'rgb(182, 182, 182)'
        }  
    }
}
</script>

<style scoped>
    .chip {
        display: inline-block;
        text-align: left;
        margin-left: 20px;
        padding-right: 25px;
        margin-bottom: 5px;
        height: 50px;
        min-width: 250px;
        font-size: 16px;
        line-height: 50px;
        border-radius: 25px;
        background-color: #f1f1f1;
    }

    .link {
        padding-left: 2rem;
        display: inline-block;
    }

    .chip img {
        float: left;
        margin: 0 10px 0 -25px;
        height: 50px;
        width: 50px;
        border-radius: 50%;
    }

    .closebtn {
        padding-left: 10px;
        color: #888;
        font-weight: bold;
        float: right;
        font-size: 20px;
        cursor: pointer;
    }

    .closebtn:hover {
        color: #000;
    }

    .round-box {
        position: absolute;
        margin-top: 20px;
        width: 10px;
        height: 10px;
        border: 1px solid whitesmoke;
        border-radius: 5px;
    }
</style>