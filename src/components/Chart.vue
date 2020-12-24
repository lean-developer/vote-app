<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Model, Vue, Prop } from 'vue-property-decorator';
import { Line, Bar, Doughnut } from 'vue-chartjs'

@Component({
  components: {
  },
})
export default class Chart extends mixins(Doughnut) {
    private chartdata: any = null;
    private options: any = null;

    mounted() {
        this.init();
        this.renderChart(this.myChartdata, this.myOptions);
        
    }

    init() {
        this.chartdata = {
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [
                {
                label: "Population (millions)",
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                data: [2478,5267,734,784,433]
                }
            ]
        };
        this.options = {
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
            },
            onClick: this.handle,
            elements: {
                center: {
                text: 'Red is 2/3 the total numbers',
                color: '#FF6384', // Default is #000000
                fontStyle: 'Arial', // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
                }
            }
        };
    }

    get myChartdata() {
        return this.chartdata;
    };

    get myOptions() {
        return this.options;
    }

    handle(point: any, event: any) {
        let index = event[0]._index;
        let label = this.chartdata.labels[index];
        let backgroundColor = this.chartdata.datasets[0].backgroundColor[index];
        let value = this.chartdata.datasets[0].data[index];
        console.log('Clicked-labelValue', label, backgroundColor, value);
    }
}
</script>
