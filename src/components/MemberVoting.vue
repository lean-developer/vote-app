<template>
    <div class="ml-3 mr-3 mb-4 bg">
        <b-row class="voting">
            <div v-for="p in points" :key="p">
                <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
                    <b-button pill variant="secondary" @click="onClickPoints(p)" style="width: 65px;">
                        <p class="point">{{p}}</p>
                    </b-button>
                </div>
            </div>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import MasterService from '@/domain/api/master.service';
import StoreService from '@/domain/api/store.service';
import { DeleteResult } from '@/domain/models/deleteResult';
import { Member } from '@/domain/models/member';

@Component({
  components: {
  },
})
export default class MemberVoting extends Vue {
    private points: string[] = [];

    created() {
        this.initPoints();
    }
    
    initPoints() {
        this.points = [];
        this.points.push('1');
        this.points.push('2');
        this.points.push('3');
        this.points.push('5');
        this.points.push('8');
        this.points.push('13');
        this.points.push('20');
        this.points.push('40');
        this.points.push('100');
        this.points.push('?');
        this.points.push('-');
    }

    @Emit('clickPoints')
    onClickPoints(p: string) {
        if (p.endsWith('-')) {
            return '';
        }
        return p;
    }
}
</script>

<style scoped>
     .voting {
        background-color: rgb(232, 232, 232);
        border-radius: 20px;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .point {
        margin: 0;
        font-size: 24px;
    }
</style>