<template>
  <div class="tickerCell">
    <img
      :src="`/example/finance/logos/${data.ticker}.png`"
      style="width: 20px; height: 20px; margin-right: 5px; border-radius: 32px"
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
