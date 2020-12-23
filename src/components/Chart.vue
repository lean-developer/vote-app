<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Model, Vue, Prop } from 'vue-property-decorator';
import { Line, Bar, Doughnut } from 'vue-chartjs'

@Component({
  components: {
  },
})
export default class Chart extends mixins(Doughnut) {
    @Prop({ required: true }) chartdata!: any;
    @Prop({ required: true }) options!: any;

    mounted() {
        this.renderChart(this.chartdata, this.options);
        window.addEventListener("click", this.onClickCanvas, false);
    }

    onClickCanvas(e: Event) {
        // getElementAtEvent(e)[0];
        e = e || window.event;
        var target: any = e.target || e.srcElement,
            text = target.textContent || target.innerText;   
        console.log('ClickCanvas', target);
    }
}
</script>
