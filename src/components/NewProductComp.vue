<template>
  <b-container>
    <div>
      <b-row class="mt-3 mb-2">
        <b-col>
          <b-input-group>
            <b-input type="text" v-model="productName"></b-input>
             <b-button variant="success" @click="onCreate()">
              <i class="fas fa-plus"></i>
            </b-button>
          </b-input-group>
          <div class="ml-2" style="text-align: left">
            <small>Projekt anlegen</small>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';

@Component({
  components: {
  },
})
export default class NewProductComp extends Vue {
    private productName: string = '';

    @Emit('createProduct')
    async onCreate() {
        const newProduct: string = this.productName;
        if (newProduct) {
          this.productName = '';
          return newProduct;
        }
    }
}
</script>

