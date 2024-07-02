<script setup>
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;
</script>

<template>
  <div class="price">
    <span class="priceAmount">£{{ value }}</span>
    <span class="increase">{{ data.priceIncrease }}% increase</span>
  </div>
</template>

<style>
.price {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price span {
  line-height: 100%;
}

.increase {
  opacity: 0.7;
}
</style>
