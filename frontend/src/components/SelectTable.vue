// create a vue component which uses native HTML table with custom virtual scrolling implementation
// it accepts a prop `data` which is an array of objects with { disease_id, disease_name, observation, obs_id, selected: bool}
// it emits an event `select` with the selected row data when a row is clicked 
// the emitted data should be in the format { disease_id, disease_name, observation, obs_id }
// it should have two cols [select, observation, disease_name ] and a checkbox to select the row (minimize reactivity)
// large data set...

<template>
  <div class="table-container">
    <div class="table-wrapper" ref="containerRef">
      <table class="performance-table">
        <thead class="table-header">
          <tr>
            <th class="select-column">Sel</th>
            <th class="observation-column">Observation</th>
            <th class="disease-column">Disease</th>
          </tr>
        </thead>
        <tbody class="table-body" :style="{ height: `${totalHeight}px` }">
          <tr
            v-for="item in visibleItems"
            :key="item.data.obs_id"
            :style="{ transform: `translateY(${item.offset}px)` }"
            :class="{ selected: item.data.selected }"
            class="table-row"
            @click="handleRowClick(item.data)"
          >
            <td class="select-cell">
              <input
                type="checkbox"
                :checked="item.data.selected"
                @click.stop="handleRowClick(item.data)"
                class="checkbox"
              />
            </td>
            <td class="observation-cell" :title="item.data.observation">
              {{ item.data.observation }}
            </td>
            <td class="disease-cell" :title="item.data.disease_name">
              {{ item.data.disease_name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface RowData {
  disease_id: number;
  disease_name: string;
  observation: string;
  observation_type: string;
  obs_id: number;
  selected: boolean;
}

const props = defineProps<{ data: RowData[] }>();
const emit = defineEmits<{
  (e: 'select', row: RowData): void;
}>();

const containerRef = ref<HTMLElement>();
const scrollTop = ref(0);
const containerHeight = ref(600);
const rowHeight = 40;
const overscan = 5;

// Virtual scrolling calculations
const totalHeight = computed(() => props.data.length * rowHeight);
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / rowHeight) - overscan));
const endIndex = computed(() => Math.min(props.data.length - 1, startIndex.value + Math.ceil(containerHeight.value / rowHeight) + overscan * 2));

const visibleItems = computed(() => {
  const items = [];
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    if (props.data[i]) {
      items.push({
        data: props.data[i],
        offset: i * rowHeight,
        index: i
      });
    }
  }
  return items;
});

function handleRowClick(row: RowData) {
  emit('select', row);
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  scrollTop.value = target.scrollTop;
}

function updateContainerHeight() {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
  }
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll, { passive: true });
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
  }
});

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll);
  }
  window.removeEventListener('resize', updateContainerHeight);
});
</script>

<style scoped>
.table-container {
  height: 60vh;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.table-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
}

.performance-table {
  width: 100%;
  min-width: 800px;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.table-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-header th {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-right: 1px solid #e5e7eb;
}

.select-column {
  width: 80px;
  text-align: center !important;
}

.observation-column {
  width: 60%;
}

.disease-column {
  width: calc(40% - 80px);
}

.table-body {
  position: relative;
}

.table-row {
  position: absolute;
  width: 100%;
  height: 40px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background: white;
  transition: background-color 0.1s ease;
  display: table;
  table-layout: fixed;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row.selected {
  background: #dbeafe;
}

.table-row td {
  padding: 8px;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid #f3f4f6;
  font-size: 14px;
  display: table-cell;
}

.select-cell {
  width: 80px;
  text-align: center;
  padding: 8px 4px !important;
  display: table-cell;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.observation-cell {
  width: 60%;
  max-width: 0;
  display: table-cell;
}

.disease-cell {
  width: calc(40% - 80px);
  max-width: 0;
  display: table-cell;
}
</style>
