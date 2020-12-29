<template>
    <div class="ml-3 mr-3">
        <b-row v-if="product">
            <b-col class="bcolor row-mb row-mr vote-row vote-name" :style=rowState>
                <b-row>
                    <b-col @click="onClickVote()">
                        <div class="text-head mt-1 mb-1">
                            {{product.name}}
                        </div>  
                    </b-col>
                </b-row>
                <b-row>
                    <div class="text-sub">
                        <em class="ml-3">{{CreatedDateStr}}</em>
                    </div>
                </b-row>
            </b-col>
            <span class="closebtn" @click="onDelete()">&times;</span>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import VoteService from '@/domain/api/vote.service';
import VoteRowDone from '@/components/VoteRow/VoteRowDone.vue';
import VoteRowOpen from '@/components/VoteRow/VoteRowOpen.vue';
import VoteRowRunning from '@/components/VoteRow/VoteRowRunning.vue';
import { Member } from '@/domain/models/member';
import { MemberVote } from '@/domain/models/memberVote';
import StoreService from '@/domain/api/store.service';
import { Product } from '@/domain/models/product';

@Component({
  components: {
  },
})
export default class ProductRowComp extends Vue {
    @Prop({ required: true }) product!: Product;

    @Emit('deleteProduct')
    onDelete() {
        return this.product;
    }

    get rowState() {
        return { 
            'color': 'var(--main-green-1)',
            'cursor': 'auto'
        }
    }

    get CreatedDateStr(): string {
        if (this.product && this.product.created) {
            let date: Date = new Date(this.product.created);
            var year = date.getFullYear();
            var month = (date.getMonth() + 1);
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return this.formateTime(year, month, day, hour, minute, second);
        }
        return '';
    }

    formateTime(year: number, month: number, day: number, hour: number, minute: number, second: number) {
        return this.makeDoubleDigit(day) + "." + 
            this.makeDoubleDigit(month) + "." + 
            this.makeDoubleDigit(year) + " " + 
            this.makeDoubleDigit(hour) + ":" + 
            this.makeDoubleDigit(minute) + ":" + 
            this.makeDoubleDigit(second);
    }

    makeDoubleDigit(x: number) {
        return (x < 10) ? "0" + x : x;
    }
}
</script>

<style scoped>
    .btn-w {
        width: 60px;
    }
    .btn-w-sm {
        width: 40px;
    }
    .bcolor {
        background-color: var(--main-cherry-2);
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
</style>


