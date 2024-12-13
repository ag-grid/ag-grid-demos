<script setup>
import { defineProps } from "vue";

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
    <button class="button-secondary removeButton" @click="onRemoveClick">
      <img class="icon" src="/example/inventory/delete.svg" alt="delete" />
    </button>
    <button
      class="button-secondary buttonStopSelling"
      @click="onStopSellingClick"
    >
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

.buttonCell button {
  appearance: none;
  display: inline-block;
  padding: 0.375em 1em 0.5em;
  white-space: nowrap;
  border-radius: 6px;
  box-shadow: 0 0 0 4px transparent, 0 1px 2px 0 #0c111d11;
  outline: none;
  background-color: var(--ag-background-color);
  color: var(--color-fg-primary, #101828);
  border: 1px solid var(--ag-border-color);
  cursor: pointer;
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
