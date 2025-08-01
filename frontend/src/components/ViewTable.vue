<template>
  <div class="view-table-container">
    <div class="view-table-header">
      <h3 class="view-table-title">Selected Observations ({{ data.length }})</h3>
      <button v-if="data.length > 0" @click="clearAll" class="clear-button">
        Clear All
      </button>
    </div>

    <div v-if="data.length === 0" class="empty-state">
      <p>No observations selected. Use the tables above to select observations.</p>
    </div>

    <div v-else class="table-wrapper" ref="containerRef">
      <table class="view-table">
        <thead class="table-header">
          <tr>
            <th class="type-column">Type</th>
            <th class="observation-column">Observation</th>
            <th class="disease-column">Disease</th>
            <th class="action-column">Action</th>
          </tr>
        </thead>
        <tbody class="table-body" :style="{ height: `${totalHeight}px` }">
          <tr
            v-for="item in visibleItems"
            :key="item.data.obs_id"
            :style="{ transform: `translateY(${item.offset}px)` }"
            class="table-row"
          >
            <td class="type-cell">
              <span class="type-badge" :class="getTypeBadgeClass(item.data.observation_type)">
                {{ formatType(item.data.observation_type) }}
              </span>
            </td>
            <td class="observation-cell" :title="item.data.observation">
              {{ item.data.observation }}
            </td>
            <td class="disease-cell" :title="item.data.disease_name">
              {{ item.data.disease_name }}
            </td>
            <td class="action-cell">
              <button @click="removeItem(item.data)" class="remove-button">
                Remove
              </button>
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
}

const props = defineProps<{
  data: RowData[];
}>();

const emit = defineEmits<{
  (e: 'remove', obsId: number): void;
  (e: 'clear-all'): void;
}>();

const containerRef = ref<HTMLElement>();
const scrollTop = ref(0);
const containerHeight = ref(400);
const rowHeight = 50; // Slightly taller for better readability
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

function removeItem(row: RowData) {
  emit('remove', row.obs_id);
}

function clearAll() {
  emit('clear-all');
}

function formatType(type: string): string {
  switch (type) {
    case 'causes': return 'Cause';
    case 'clinical-presentation': return 'Clinical Presentation';
    case 'clinical-examination': return 'Clinical Exam';
    case 'lab-investigation': return 'Lab Investigation';
    default: return type;
  }
}

function getTypeBadgeClass(type: string): string {
  switch (type) {
    case 'causes': return 'type-cause';
    case 'clinical-presentation': return 'type-clinical';
    case 'clinical-examination': return 'type-exam';
    case 'lab-investigation': return 'type-lab';
    default: return 'type-default';
  }
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
.view-table-container {
  height: 50vh;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.view-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.view-table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.clear-button {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background: #dc2626;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.table-wrapper {
  height: calc(100% - 73px);
  overflow-y: auto;
  overflow-x: auto;
}

.view-table {
  width: 100%;
  min-width: 700px;
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

.type-column {
  width: 100px;
}

.observation-column {
  width: 50%;
}

.disease-column {
  width: 30%;
}

.action-column {
  width: 80px;
  text-align: center !important;
}

.table-body {
  position: relative;
}

.table-row {
  position: absolute;
  width: 100%;
  height: auto;
  min-height: 50px;
  border-bottom: 1px solid #f3f4f6;
  background: white;
  display: table;
  table-layout: fixed;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row td {
  padding: 12px 8px;
  vertical-align: top;
  border-right: 1px solid #f3f4f6;
  font-size: 14px;
  display: table-cell;
}

.type-cell {
  width: 100px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.type-cause {
  background: #fef3c7;
  color: #92400e;
}

.type-clinical {
  background: #dbeafe;
  color: #1e40af;
}

.type-exam {
  background: #d1fae5;
  color: #065f46;
}

.type-lab {
  background: #fce7f3;
  color: #be185d;
}

.type-default {
  background: #f3f4f6;
  color: #374151;
}

.observation-cell {
  width: 50%;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.disease-cell {
  width: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-cell {
  width: 80px;
  text-align: center;
}

.remove-button {
  padding: 4px 8px;
  background: #f87171;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background: #ef4444;
}
</style>
