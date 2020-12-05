<template>
    <div class="chip">
        <b-avatar>
            JD
        </b-avatar>
        John Doo
        <span class="closebtn" @click="onClose()">&times;</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class UserChips extends Vue {

    async created() {
      console.log('UserChips created...')
    }

    onClose() {
        console.log('UserChips close');
    }
}
</script>

<style scoped>
    .chip {
        display: inline-block;
        padding-right: 25px;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        border-radius: 25px;
        background-color: #f1f1f1;
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
</style>