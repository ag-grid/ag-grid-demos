<script setup>
import { defineProps } from "vue";

const { params } = defineProps(["params"]);

const { value, data } = params;
const { jobTitle, image } = data;
</script>

<template>
  <div class="employeeCell">
    <div class="employeeData">
      <span>{{ value }}</span>
      <span class="description">{{ jobTitle }}</span>
    </div>
    <img
      class="image"
      :src="`/example/hr/${image}.png`"
      :alt="value.toLowerCase()"
    />
  </div>
</template>

<style>
.employeeCell {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: left;
  gap: 8px;
}

.employeeCell img {
  padding: 2px;
}

.employeeData {
  display: flex;
  flex-direction: column;
}

.employeeData span:first-child {
  font-weight: 500;
}

.description {
  opacity: 0.6;
}

.employeeData > span {
  line-height: 20px;
}

.employeeName {
  font-weight: 600;
  color: rgb(50, 50, 50);
}

.image {
  width: 36px;
  height: 36px;
  margin-right: 5px;
  border-radius: 100px;
}
</style>
