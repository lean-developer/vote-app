<template>
  <div id="app">
    <b-navbar toogleable="lg" type="dark" variant="dark">
      <b-navbar-nav>
        <b-navbar-brand href="/">
          Vote
        </b-navbar-brand>
        <b-nav-item v-if="IsMaster" to="/team">
          Team
          <b-badge variant="primary">{{Members}}</b-badge>
        </b-nav-item>
        <b-nav-item v-if="IsMaster" to="/estimates">
          Stories
          <b-badge v-if="Votes" variant="success">{{Votes}}</b-badge>
        </b-nav-item>
        <b-nav-item v-if="IsMember" to="/member">
          {{StoreMember.name}}
          <b-badge v-if="Votes" variant="danger">{{VotesIsRunning}}</b-badge>
        </b-nav-item>
        <!-- <b-nav-item v-if="IsMaster" to="/about">About</b-nav-item> -->
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <!--
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
        -->
        <b-nav-item-dropdown right v-if="IsMaster">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{Name}}</em>
            </template>
            <b-dropdown-item to="/profile">Profil</b-dropdown-item>
            <b-dropdown-item @click="onMasterLogout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
        
        <b-nav-item-dropdown right v-if="!IsMaster">
            <b-dropdown-item to="/login">Login</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
    <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
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
import SocketService from './domain/api/socket.service';
import { StoreMember } from './domain/models/storeMember';
import { Member } from './domain/models/member';
import voteService from './domain/api/vote.service';
import { Vote } from './domain/models/vote';
import { MemberVote } from './domain/models/memberVote';

@Component({
  components: {
  },
})
export default class App extends Vue {
  private loading: boolean = false;

  async created() {
    document.title = process.env.VUE_APP_TITLE;
    StoreService.$store = this.$store;
    SocketService.$socket = this.$socket;
    if (this.$route.name === 'MemberLogin') {
          // hier als Member einloggen!
    }
    else {
      if (this.IsMaster) {
        /** Wenn die App geladen wird (und Login=True), Master neu laden und im Store speichern;
         * damit werden Daten die evtl. auf anderen Endgeräten gespeichert wurden, synchronisiert.
         * Darf nur ausgeführt werden, wenn isMaster=True! */
        this.loading = true;
        await StoreService.reloadMaster();
        this.loading = false;
        /** Wenn man als Master eingeloggt ist, kann man gleichzeitig auch als Member eingeloggt sein; 
         * d.h. MemberDaten neu laden wg. Synchronisierung verschiedener Endgeräte.
        */
        if (this.IsMember) {
          this.loading = true;
          await StoreService.reloadMember();
          this.loading = false;
        }
      }
      else {
        if (this.IsMember) {
          /* MemberDaten neu laden wg. Synchronisierung verschiedener Endgeräte. */
          this.loading = true;
          await StoreService.reloadMember();
          this.loading = false;
          this.$router.push({ name: 'Member' })
        }
        else {
          this.$router.push({ name: 'Login' })
        }
      }
    }
  }

  get VotesIsRunning(): string {
    return this.$store.getters.votesIsRunning;
  }

  get StoreMember(): StoreMember {
    return this.$store.getters.member;
  }
  
  get Master(): Master {
    return this.$store.getters.master;
  }

  get Votes(): string {
    if (this.IsMaster) {
      if (this.Master.votes.length > 0) {
        return this.Master.votes.length.toString();
      }
    }
    return '';
  }
  
  get Members(): string {
    if (this.IsMaster) {
      if (this.Master.members.length > 0) {
        return this.Master.members.length.toString();
      }
    }
    return '';
  }

  get IsMaster(): boolean {
    return this.Master.uid !== '';
  }

  get IsMember(): boolean {
    return this.StoreMember.uid !== '';
  }

  get Name(): string {
    if (this.Master) {
      return this.Master.name;
    }
    return '';
  }

  async onMasterLogout() {
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
  animation-delay: -0.3s;
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
