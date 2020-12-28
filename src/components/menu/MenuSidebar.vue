<template>
    <div class="sidebar">
        <transition name="slide">
            <div>
                <b-list-group>
                    <b-list-group-item variant="dark" to="/team">Team</b-list-group-item>
                    <b-list-group-item variant="dark" to="/estimates">Stories</b-list-group-item>
                </b-list-group>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { uiStore, mutations } from '@/store';

@Component({
  components: {
  },
})
export default class MenuSidebar extends Vue {
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