<template>
  <div>
    <nav class="main-nav">
      <div class="logo">
        my.company
      </div>
      <Burger></Burger>
    </nav>

    <Sidebar>
      <div>
        <h1>Geolocation</h1>
        <p>Your location is:</p>
        <p>
          Latitude: <span v-if="loc">{{ loc.coords.latitude }}</span>
        </p>
        <p>
          Longitude: <span v-if="loc">{{ loc.coords.longitude }}</span>
        </p>
        <b-button block @click="getCurrentPosition">Get Current Location</b-button>
        <b-button block @click="scheduleNotification">Local Notifications</b-button>
    </div>
      <!--
      <ul class="sidebar-panel-nav">
        <li><a href="">Home</a></li>
        <li><a href="">About</a></li>
        <li><a href="">Contact</a></li>
      </ul>
      -->
    </Sidebar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import Burger from '@/components/menu/Burger.vue';
import Sidebar from '@/components/menu/Sidebar.vue';
import { Plugins } from '@capacitor/core';

@Component({
  components: {
    Burger,
    Sidebar
  }
})
export default class About extends Vue {
  private loc: any = null;

  getCurrentPosition() {
    const { Geolocation } = Plugins;
    Geolocation.getCurrentPosition().then(
      loc => (this.loc = loc),
      e => console.log("there was an error", e)
    );
  }

  async scheduleNotification() {

  }
}
</script>

<style>
html {
   height: 100%;
   overflow:hidden;
 }

 /*
 body {
   border: 0; margin: 0; padding: 0;
   font-family: 'Lato';
   height: 100%;
   background: rgb(101,31,87);
   background: linear-gradient(45deg, rgba(101,31,87,1) 0%, rgba(225,113,87,1) 48%, rgba(249,248,113,1) 100%);
 }
 */

 .logo {
   align-self: center;
   color: #fff;
   font-weight: bold;
   font-family: 'Lato'
 }

 .main-nav {
   display: flex;
   justify-content: space-between;
   padding: 0.5rem 0.8rem;
 }

 ul.sidebar-panel-nav {
   list-style-type: none;
 }

 ul.sidebar-panel-nav > li > a {
   color: #fff;
   text-decoration: none;
   font-size: 1.5rem;
   display: block;
   padding-bottom: 0.5em;
 }
</style>