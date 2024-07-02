<script setup>
import { defineProps } from 'vue';

const { params } = defineProps(["params"]);

const onRemoveClick = () => {
  const rowData = params.node.data;
  params.api.applyTransaction({ remove: [rowData] });
};

const onStopSellingClick = () => {
  const rowData = params.node.data;

  const isPaused = rowData.status === "paused";
  const isOutOfStock = rowData.available <= 0;

  // Modify the status property
  rowData.status = !isPaused
    ? "paused"
    : !isOutOfStock
      ? "active"
      : "outOfStock";

  // Refresh the row to reflect the changes
  params.api.applyTransaction({ update: [rowData] });
};
</script>

<template>
  <div class="buttonCell">
    <button class="button-secondary" @click="onRemoveClick">
      <img class="icon" src="/example/inventory/delete.svg" alt="delete" />
    </button>
    <button class="button-secondary" @click="onStopSellingClick">
      Hold Selling
    </button>
  </div>
</template>

<style>
.buttonCell {
  display: flex;
  gap: 8px;
  flex-direction: row-reverse;
}

.removeButton {
  display: flex !important;
  justify-content: center;
  align-items: center;

  height: 40px;
  width: 40px;
}

.removeButton img {
  width: 20px;
}

.buttonStopSelling {
  height: 40px;
  line-height: 1.8;
}
</style>
