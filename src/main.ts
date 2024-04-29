import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vue3AutoScroll from "vue3-auto-scroll";
import "vue3-auto-scroll/dist/style.css";
createApp(App).component('Vue3AutoScroll',Vue3AutoScroll).mount('#app')

