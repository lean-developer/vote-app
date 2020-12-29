<template>
    <div class="sidebar">
        <transition name="slide">
            <div>
                <b-list-group>
                    <b-list-group-item variant="dark" to="/team">
                        <b-row>
                            <b-col>
                                Team
                            </b-col>
                            <b-col>
                                <b-badge v-if="Members" variant="success" pill>{{Members}}</b-badge>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                    <b-list-group-item variant="dark" to="/estimates">
                        <b-row>
                            <b-col>
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
                    <b-list-group-item v-if="HasProducts" variant="dark">
                        <b-row>
                            <b-col>
                                Projekte
                            </b-col>
                            <b-col>
                                <b-badge variant="primary" pill>{{Products}}</b-badge>
                            </b-col>
                        </b-row>
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

    get Products(): string{
        if (this.HasProducts) {
            return this.Master.products.length.toString();
        }
        return '';
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

</style>