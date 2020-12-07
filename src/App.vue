<template>
  <div id="app">
    <b-navbar toogleable="lg" type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand href="#">NavBar</b-navbar-brand>
        <b-nav-item v-if="isMaster" to="/">Home</b-nav-item> |
        <b-nav-item v-if="isMaster" to="/estimates">Schätzungen</b-nav-item> |
        <b-nav-item v-if="isMaster" to="/about">About</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>

        <b-nav-item-dropdown right v-if="isMaster">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{name}}</em>
            </template>
            <b-dropdown-item href="#">Profil</b-dropdown-item>
            <b-dropdown-item href="#">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
        
        <b-nav-item-dropdown right v-if="!isMaster">
            <b-dropdown-item to="/login">Login</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
import { User } from './domain/models/user';
import { Master } from './domain/models/master';
import MasterService from './domain/api/master.service';
import { StoreActions } from './store';

@Component({
  components: {
  },
})
export default class App extends Vue {

  async created() {
    if (!this.isMaster) {
      this.$router.push({ name: 'Login' })
    }
    else {
      /** wenn die App geladen wird (und Login=True), Master neu laden und im Store speichern;
       * damit werden Daten die evtl. auf anderen Endgeräten gespeichert wurden, synchronisiert */
      const m: Master | undefined = await MasterService.getMaster(this.master.id);
      if (m) {
        await this.$store.commit(StoreActions.SaveMaster, m);
      }
    }
  }
  
  @Model() get master(): Master {
    return this.$store.getters.master
  }

  @Model() get isMaster(): boolean {
    return this.master.uid !== '';
  }

  @Model() get name(): string {
    if (this.master) {
      return this.master.name;
    }
    return '';
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
