<template>
    <b-container>
        <div>MyChart-Test</div>
        <canvas id="canvas" width="250" height="100"></canvas>
        <b-row>
            <b-col class="mr-3">
                <chart></chart>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Model, Vue, Prop } from 'vue-property-decorator';
import Chart from '@/components/Chart.vue';
import { Doughnut } from 'vue-chartjs';


@Component({
  components: {
      Chart
  },
})
export default class EstimateChart extends Vue {
   setChartText() {    
        var chart: any = document.getElementById('doughnut-chart');
        var context = chart.getContext("2d");
        context.fillStyle = "red";
        context.font = "bold 18px Arial";
        context.fillText("myChart", (chart.width / 2) - 17, (chart.height / 2) + 8);
    }
}
</script>

<style scoped>
    .small {
        max-width: 600px;
        margin:  150px auto;
    }
</style>