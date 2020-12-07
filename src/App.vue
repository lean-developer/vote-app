<template>
  <div id="app">
    <b-navbar toogleable="lg" type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand href="#">NavBar</b-navbar-brand>
        <b-nav-item v-if="isMaster" to="/">
          Team
          <b-badge variant="success">{{members}}</b-badge>
        </b-nav-item>
        <b-nav-item to="/estimates">
          Schätzungen
          <b-badge v-if="votes" variant="danger">{{votes}}</b-badge>
        </b-nav-item>
        <!-- <b-nav-item v-if="isMaster" to="/about">About</b-nav-item> -->
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <!--
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
        -->
        <b-nav-item-dropdown right v-if="isMaster">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{name}}</em>
            </template>
            <b-dropdown-item to="/profile">Profil</b-dropdown-item>
            <b-dropdown-item @click="onLogout()">Logout</b-dropdown-item>
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
import LoginService from './domain/api/login.service';
import StoreModel from './store/storeModel';
import StoreService from './domain/api/store.service';

@Component({
  components: {
  },
})
export default class App extends Vue {

  async created() {
    StoreService.$store = this.$store;
    if (!this.isMaster) {
      this.$router.push({ name: 'Login' })
    }
    else {
      /** wenn die App geladen wird (und Login=True), Master neu laden und im Store speichern;
       * damit werden Daten die evtl. auf anderen Endgeräten gespeichert wurden, synchronisiert */
      await StoreService.reloadMaster();
    }
  }
  
  @Model() get master(): Master {
    return this.$store.getters.master
  }

  @Model() get votes(): string {
    if (this.isMaster) {
      if (this.master.votes.length > 0) {
        return this.master.votes.length.toString();
      }
    }
    return '';
  }

  @Model() get members(): string {
    if (this.isMaster) {
      if (this.master.members.length > 0) {
        return this.master.members.length.toString();
      }
    }
    return '';
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

  async onLogout() {
    const initStoreModel: StoreModel = new StoreModel();
    await this.$store.commit(StoreActions.SaveUser, initStoreModel.user);
    await this.$store.commit(StoreActions.SaveMaster, initStoreModel.master);
    this.$router.push({ name: 'Login' })
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


.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid blue;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
