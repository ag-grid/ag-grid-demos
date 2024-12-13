<template>
  <div class="tickerCell" style="display: flex; align-items: center; gap: 5px">
    <img
      :src="`/example/finance/logos/${data.ticker}.png`"
      style="width: 20px; height: 20px; border-radius: 32px"
    />
    <b class="custom-ticker">{{ data.ticker }}</b>
    <span class="ticker-name">{{ data.name }}</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const { params } = defineProps(["params"]);

const data = params.data;
</script>
