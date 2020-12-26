<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Model, Vue, Prop, Emit } from 'vue-property-decorator';
import { Line, Bar, Doughnut } from 'vue-chartjs'

@Component({
  components: {
  },
})
export default class Chart extends mixins(Doughnut) {
    @Prop({ required: true }) labels!: string[];
    @Prop({ required: true }) datas!: number[];
    private chartdata: any = null;
    private options: any = null;
    

    mounted() {
        this.init();
        this.renderChart(this.myChartdata, this.myOptions);
        
    }

    init() {
        this.chartdata = {
            labels: this.labels,
            datasets: [
                {
                    label: "Population (millions)",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                    data: this.datas
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
            /*
            title: {
                display: false,
                text: 'Predicted world population (millions) in 2050'
            },
            */
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

    @Emit('clickPoints')
    handle(point: any, event: any) {
        if (event[0]) {
            let index = event[0]._index;
            let label = this.chartdata.labels[index];
            let backgroundColor = this.chartdata.datasets[0].backgroundColor[index];
            let value = this.chartdata.datasets[0].data[index];
            console.log('Clicked-labelValue', label, backgroundColor, value);
            return this.getStoryPointsFromLabel(label);
        }
    }

    getStoryPointsFromLabel(label: string): string {
        let indexEnd: number = label.indexOf('Story Points');
        let indexStart: number = label.indexOf('x');
        if (indexEnd > 0 && indexStart > 0) {
            return label.substring(indexStart + 1, indexEnd);
        }
        return '';
    }
}
</script>
