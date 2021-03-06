<template>
  <div id="app">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Krona+One&family=Luckiest+Guy&display=swap" rel="stylesheet">
    <b-navbar toogleable="lg" type="dark" variant="dark" sticky>
      <b-navbar-nav>
        <b-navbar-brand class="display-mobile" href="/">
          <img src="./assets/story_point.svg" width="32" height="32" alt="">
        </b-navbar-brand>
        <b-nav-item v-if="IsMaster">
           <b-button v-b-toggle.sidebar variant="dark"><i class="fas fa-bars"></i></b-button>
         </b-nav-item>
      </b-navbar-nav>
      <div class="ml-auto mt-1">
          <div class="caption-t">Scrum Planning Poker</div>
          <div class="caption-b"><strong>{{Caption}}</strong></div>
      </div>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
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
    <b-sidebar id="sidebar" title="Sidebar" bg-variant="dark" text-variant="light" shadow>
      <menu-sidebar></menu-sidebar>
    </b-sidebar>
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
import { Member, MemberState } from './domain/models/member';
import voteService from './domain/api/vote.service';
import { Vote } from './domain/models/vote';
import { MemberVote } from './domain/models/memberVote';
import { Socket } from 'vue-socket.io-extended';
import MemberService from './domain/api/member.service';
import MenuSidebar from '@/components/menu/MenuSidebar.vue';
import { uiStore, mutations } from '@/store';

@Component({
  components: {
    MenuSidebar
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
        /**
         * Check ob die Member mit LoginState tatsächlich noch erreichbar sind
         * wenn nicht: State updaten
         */
        // TODO
        /*
        for (let m of this.Master.members) {
          if (m.pin !== this.StoreMember.pin) {
            // alle eingeloggten Member durchlaufen ...
            if (m.state === MemberState.ONLINE) {
              // Status auf Offline
              m.state = MemberState.OFFLINE;
              // MasterMember im Store aktualisieren
              StoreService.updateMemberState(m);
              // Client benachrichtigen (kommt die Message an; wird dieser Client den Status wieder auf Online setzen)
              SocketService.emitMemberStateChanged(m);
            }
          }
        }
        */
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

   get Caption(): string {
     return uiStore.siteCaption;
   }

  async onClose() {
    if (this.IsMember) {
      let member: Member | undefined = await StoreService.getMember();
      if (member) {
        member.state = MemberState.OFFLINE;
        const offlineMember: Member | undefined = await MemberService.updateMember(member);
        if (offlineMember) {
          StoreService.updateMemberState(offlineMember);
        }
      }
    }
  }

  @Socket('memberStateChanged')
  onMemberStateChanged(currentMember: Member) {
    StoreService.updateMemberState(currentMember);
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

.caption-t {
  color: silver;
  padding: 0;
  font-size: 14px;
}

.caption-b {
  color: red;
  padding: 0;
  font-size: 20px;
}

.display-mobile {
  display: inline-block;
}

/* the given size or smaller */
@media (max-width: 767.98px) {
  .display-mobile {
    display: none!important;
  }
}

:root {
  --main-beige: #EAE1CD;
  --main-dark: #404C50;
  --main-green-3: #639F95;
  --main-green-2: #89BEB5;
  --main-green-1: #C5E3DB;
  --main-gray: #E6ECE8;

  --main-blue-lila: #6E5C97;
  --main-blue-4: #1A2244;
  --main-blue-3: #192F5E;
  --main-blue-2: #275793;
  --main-blue-1: #4C82B4;
  --main-blue-0: #77B2C5;

  --main-cherry-5: #BDB964;
  --main-cherry-4: #7C1C23;
  --main-cherry-3: #3D1322;
  --main-cherry-2: #317380;
  --main-cherry-1: #8FC4C6;
  --main-cherry-0: #E2D8CE;
}
/* color: var(--main-green-2); */
</style>
