<template>
    <div class="small">
        <div>MyChart-Test</div>
        <chart :chartdata="chartdata" :options="options"></chart>
    </div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Model, Vue, Prop } from 'vue-property-decorator';
import Chart from '@/components/Chart.vue';


@Component({
  components: {
      Chart
  },
})
export default class EstimateChart extends Vue {
   
    get chartdata() {
        return {
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [
                {
                label: "Population (millions)",
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                data: [2478,5267,734,784,433]
                }
            ]
        }
    };

    get options() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            /** links */
            // circumference:1 * Math.PI,
            // rotation: -1.5 * Math.PI,
            /** rechts */
            // circumference:1 * Math.PI,
            // rotation: -0.5 * Math.PI,
              /** oben */
            circumference:1 * Math.PI,
            rotation: 1 * Math.PI,
            title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
            }
        }
    }
}
</script>

<style scoped>
    .small {
        max-width: 600px;
        margin:  150px auto;
    }
</style>