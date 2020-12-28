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
                </b-list-group>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { uiStore, mutations } from '@/store';
import { Master } from '@/domain/models/master';

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
  
    get Members(): string {
        if (this.IsMaster) {
            if (this.Master.members.length > 0) {
                return this.Master.members.length.toString();
            }
        }
        return '';
    }

    get IsMaster(): boolean {
        return this.Master.uid !== '';
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