<script setup>
import { defineProps } from "vue";

const { params } = defineProps(["params"]);

const { value, data } = params;
const { flag } = data;
</script>

<template>
  <div class="flagCell">
    <div class="employeeData">
      <span>{{ value }}</span>
    </div>
    <img
      class="flagImage"
      :src="`/example/hr/${flag}.svg`"
      :alt="value.toLowerCase()"
    />
  </div>
</template>

<style>
.flagCell {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: left;
  gap: 8px;
}

.employeeData {
  display: flex;
  flex-direction: column;
}

.employeeData > span {
  line-height: 20px;
}

.flagImage {
  position: relative;
  width: 33px;
  height: 27px;
  top: 4px;
}
</style>
