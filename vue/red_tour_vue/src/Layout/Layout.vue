<template>
    <div class="app-wrapper">
        <Header class="header" />
        <div class="main-container">
            <div class="sidebar-container">
                <SideBar />
            </div>
            <div class="main-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from "../components/Header.vue"
import SideBar from "../components/SideBar.vue"
import '../styles/Layout.css'
</script>