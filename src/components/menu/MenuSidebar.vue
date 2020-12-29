<template>
    <div class="sidebar">
        <transition name="slide">
            <div>
                <b-list-group>
                    <b-list-group-item variant="dark" to="/team">
                        <b-row>
                            <b-col class="left ml-2">
                                Team
                            </b-col>
                            <b-col>
                                <b-badge v-if="Members" variant="success" pill>{{Members}}</b-badge>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                    <b-list-group-item variant="dark" to="/estimates">
                        <b-row>
                            <b-col class="left ml-2">
                                Stories
                            </b-col>
                            <b-col>
                                <b-badge v-if="Members" variant="primary" pill>{{Votes}}</b-badge>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                    <b-list-group-item v-if="IsMember" variant="dark" to="/member">
                        <b-row>
                            <b-col>
                                {{StoreMember.name}}
                            </b-col>
                            <b-col>
                                <b-badge v-if="Votes" variant="danger" pill>{{VotesIsRunning}}</b-badge>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                    <b-list-group-item v-if="HasProducts" variant="dark" to="/products">
                        <b-row>
                            <b-col class="left ml-2">
                                Projekte
                            </b-col>
                            <b-col @click="clickCollapseProducts()">
                                <i class="fas fa-chevron-down"></i>
                                <!-- <b-badge variant="primary" pill>{{Products}}</b-badge> -->
                            </b-col>
                        </b-row>
                            <b-collapse id="productsCollapse" v-model="collapseProducts" class="mt-2">
                                <b-row v-for="p in Products" :key="p.id">
                                    <b-col class="left ml-4">
                                        {{p.name}}
                                    </b-col>
                                    <b-col>
                                        bbb
                                    </b-col>
                                </b-row>
                            </b-collapse>
                    </b-list-group-item>
                </b-list-group>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { uiStore, mutations } from '@/store';
import { Master } from '@/domain/models/master';
import { StoreMember } from '@/domain/models/storeMember';
import { Product } from '@/domain/models/product';

@Component({
  components: {
  },
})
export default class MenuSidebar extends Vue {
    private collapseProducts: boolean = false;

    get Master(): Master {
        return this.$store.getters.master;
    }

    get Votes(): string {
        if (this.IsMaster) {
            if (this.Master.votes.length > 0) {
                return this.Master.votes.length.toString();
            }
        }
        return '';
    }

    clickCollapseProducts() {
        this.collapseProducts = !this.collapseProducts;
    }

    get VotesIsRunning(): string {
        return this.$store.getters.votesIsRunning;
    }

    get StoreMember(): StoreMember {
        return this.$store.getters.member;
    }
  
    get Members(): string {
        if (this.IsMaster) {
            if (this.Master.members.length > 0) {
                return this.Master.members.length.toString();
            }
        }
        return '';
    }

    get IsMember(): boolean {
        return this.StoreMember.uid !== '';
    }

    get IsMaster(): boolean {
        return this.Master.uid !== '';
    }

    get HasProducts(): boolean {
        return this.Master.products && this.Master.products.length > 0;
    }

    get Products(): Product[] {
        if (this.HasProducts) {
            return this.Master.products;
        }
        return [];
    }

    get Name(): string {
        if (this.Master) {
            return this.Master.name;
        }
        return '';
    }
}
</script>

<style scoped>
    .slide-enter-active,
    .slide-leave-active
    {
        transition: transform 0.2s ease;
    }

    .slide-enter,
    .slide-leave-to {
        transform: translateX(-100%);
        transition: all 150ms ease-in 0s
    }
    .collapse {
        cursor: 'pointer';
    }
    .left {
        text-align: left;
    }

</style>