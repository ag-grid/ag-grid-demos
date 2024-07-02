<script setup>
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { data } = params;
</script>

<template>
  <div class="stock">
    <span>{{ data.available }}</span>
    &nbsp;<span class="stockText">Stock /</span>&nbsp;
    <span class="variantsText">{{ `${data.variants} Variants` }}</span>
  </div>
</template>

<style>
.stockText {
  opacity: 0.7;
}

.variantsText {
  opacity: 0.7;
}
</style>
