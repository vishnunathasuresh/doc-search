<template>
  <div class="edit-table-container">
    <div class="edit-table-header">
      <h3 class="edit-table-title">Repository Management</h3>
      <div class="header-actions">
        <button @click="showAddDiseaseDialog = true" class="add-button">
          Add Disease
        </button>
        <button @click="showAddObservationDialog = true" class="add-button">
          Add Observation
        </button>
      </div>
    </div>

    <div class="filters">
      <input
        v-model="searchTerm"
        placeholder="Search diseases or observations..."
        class="search-input"
      />
      <select v-model="selectedType" class="type-filter">
        <option value="">All Types</option>
        <option value="causes">Causes</option>
        <option value="clinical-presentation">Clinical Presentation</option>
        <option value="clinical-examination">Clinical Examination</option>
        <option value="lab-investigation">Lab Investigation</option>
      </select>
    </div>

    <div class="table-wrapper" ref="containerRef">
      <table class="edit-table">
        <thead class="table-header">
          <tr>
            <th class="id-column">ID</th>
            <th class="type-column">Type</th>
            <th class="observation-column">Observation</th>
            <th class="disease-column">Disease</th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody class="table-body" :style="{ height: `${totalHeight}px` }">
          <tr
            v-for="item in visibleItems"
            :key="item.data.id"
            :style="{ transform: `translateY(${item.offset}px)` }"
            class="table-row"
          >
            <td class="id-cell">{{ item.data.id }}</td>
            <td class="type-cell">
              <span class="type-badge" :class="getTypeBadgeClass(item.data.type)">
                {{ formatType(item.data.type) }}
              </span>
            </td>
            <td class="observation-cell" :title="item.data.observation">
              {{ item.data.observation }}
            </td>
            <td class="disease-cell" :title="item.data.disease">
              {{ item.data.disease }}
            </td>
            <td class="actions-cell">
              <button @click="editItem(item.data)" class="edit-button">
                Edit
              </button>
              <button @click="deleteItem(item.data)" class="delete-button">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Disease Dialog -->
    <div v-if="showAddDiseaseDialog" class="dialog-overlay" @click="closeAddDiseaseDialog">
      <div class="dialog-content" @click.stop>
        <h4 class="dialog-title">Add New Disease</h4>
        <div class="form-group">
          <label>Disease Name:</label>
          <input v-model="newDisease.name" class="form-input" />
        </div>
        <div class="dialog-actions">
          <button @click="closeAddDiseaseDialog" class="cancel-button">Cancel</button>
          <button @click="addDisease" class="confirm-button">Add Disease</button>
        </div>
      </div>
    </div>

    <!-- Add Observation Dialog -->
    <div v-if="showAddObservationDialog" class="dialog-overlay" @click="closeAddObservationDialog">
      <div class="dialog-content" @click.stop>
        <h4 class="dialog-title">Add New Observation</h4>
        <div class="form-group">
          <label>Observation Text:</label>
          <textarea v-model="newObservation.observation" class="form-textarea"></textarea>
        </div>
        <div class="form-group">
          <label>Type:</label>
          <select v-model="newObservation.type" class="form-select">
            <option value="">Select Type</option>
            <option value="causes">Causes</option>
            <option value="clinical-presentation">Clinical Presentation</option>
            <option value="clinical-examination">Clinical Examination</option>
            <option value="lab-investigation">Lab Investigation</option>
          </select>
        </div>
        <div class="form-group">
          <label>Disease:</label>
          <select v-model="newObservation.disease_id" class="form-select">
            <option value="">Select Disease</option>
            <option v-for="disease in diseases" :key="disease.id" :value="disease.id">
              {{ disease.name }}
            </option>
          </select>
        </div>
        <div class="dialog-actions">
          <button @click="closeAddObservationDialog" class="cancel-button">Cancel</button>
          <button @click="addObservation" class="confirm-button">Add Observation</button>
        </div>
      </div>
    </div>

    <!-- Edit Observation Dialog -->
    <div v-if="showEditDialog" class="dialog-overlay" @click="closeEditDialog">
      <div class="dialog-content" @click.stop>
        <h4 class="dialog-title">Edit Observation</h4>
        <div class="form-group">
          <label>Observation Text:</label>
          <textarea v-model="editingObservation.observation" class="form-textarea"></textarea>
        </div>
        <div class="form-group">
          <label>Type:</label>
          <select v-model="editingObservation.type" class="form-select">
            <option value="causes">Causes</option>
            <option value="clinical-presentation">Clinical Presentation</option>
            <option value="clinical-examination">Clinical Examination</option>
            <option value="lab-investigation">Lab Investigation</option>
          </select>
        </div>
        <div class="form-group">
          <label>Disease:</label>
          <select v-model="editingObservation.disease_id" class="form-select">
            <option v-for="disease in diseases" :key="disease.id" :value="disease.id">
              {{ disease.name }}
            </option>
          </select>
        </div>
        <div class="dialog-actions">
          <button @click="closeEditDialog" class="cancel-button">Cancel</button>
          <button @click="updateObservation" class="confirm-button">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { Observation } from '@/types/global';

interface Disease {
  id: number;
  name: string;
}

const props = defineProps<{
  data: Observation[];
  diseases: Disease[];
}>();

const emit = defineEmits<{
  'add-disease': [disease: { name: string }];
  'add-observation': [observation: { observation: string; type: string; disease_id: number }];
  'edit-observation': [observation: Observation];
  'delete-observation': [id: number];
}>();

const containerRef = ref<HTMLElement>();
const scrollTop = ref(0);
const containerHeight = ref(600);
const rowHeight = 60;
const overscan = 5;

// Search and filter
const searchTerm = ref('');
const selectedType = ref('');

// Dialog states
const showAddDiseaseDialog = ref(false);
const showAddObservationDialog = ref(false);
const showEditDialog = ref(false);

// Form data
const newDisease = ref({ name: '' });
const newObservation = ref({ observation: '', type: '', disease_id: 0 });
const editingObservation = ref<Observation>({ id: 0, observation: '', type: '', disease_id: 0, disease: '', selected: false });

// Filtered data
const filteredData = computed(() => {
  return props.data.filter(item => {
    const matchesSearch = !searchTerm.value ||
      item.observation.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.disease.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesType = !selectedType.value || item.type === selectedType.value;

    return matchesSearch && matchesType;
  });
});

// Virtual scrolling calculations
const totalHeight = computed(() => filteredData.value.length * rowHeight);
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / rowHeight) - overscan));
const endIndex = computed(() => Math.min(filteredData.value.length - 1, startIndex.value + Math.ceil(containerHeight.value / rowHeight) + overscan * 2));

const visibleItems = computed(() => {
  const items = [];
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    if (filteredData.value[i]) {
      items.push({
        data: filteredData.value[i],
        offset: i * rowHeight,
        index: i
      });
    }
  }
  return items;
});

function formatType(type: string): string {
  switch (type) {
    case 'causes': return 'Cause';
    case 'clinical-presentation': return 'Clinical';
    case 'clinical-examination': return 'Exam';
    case 'lab-investigation': return 'Lab';
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

function editItem(item: Observation) {
  editingObservation.value = { ...item };
  showEditDialog.value = true;
}

function deleteItem(item: Observation) {
  if (confirm(`Are you sure you want to delete this observation: "${item.observation}"?`)) {
    emit('delete-observation', item.id);
  }
}

function addDisease() {
  if (newDisease.value.name.trim()) {
    emit('add-disease', { name: newDisease.value.name.trim() });
    closeAddDiseaseDialog();
  }
}

function addObservation() {
  if (newObservation.value.observation.trim() && newObservation.value.type && newObservation.value.disease_id) {
    emit('add-observation', {
      observation: newObservation.value.observation.trim(),
      type: newObservation.value.type,
      disease_id: newObservation.value.disease_id
    });
    closeAddObservationDialog();
  }
}

function updateObservation() {
  if (editingObservation.value.observation.trim() && editingObservation.value.type && editingObservation.value.disease_id) {
    emit('edit-observation', editingObservation.value);
    closeEditDialog();
  }
}

function closeAddDiseaseDialog() {
  showAddDiseaseDialog.value = false;
  newDisease.value = { name: '' };
}

function closeAddObservationDialog() {
  showAddObservationDialog.value = false;
  newObservation.value = { observation: '', type: '', disease_id: 0 };
}

function closeEditDialog() {
  showEditDialog.value = false;
  editingObservation.value = { id: 0, observation: '', type: '', disease_id: 0, disease: '', selected: false };
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
.edit-table-container {
  height: 90vh;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.edit-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.edit-table-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.add-button {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background: #059669;
}

.filters {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.search-input, .type-filter {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.type-filter {
  width: 200px;
}

.table-wrapper {
  height: calc(100% - 140px);
  overflow-y: auto;
  overflow-x: auto;
}

.edit-table {
  width: 100%;
  min-width: 1000px;
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

.id-column {
  width: 80px;
}

.type-column {
  width: 120px;
}

.observation-column {
  width: 40%;
}

.disease-column {
  width: 25%;
}

.actions-column {
  width: 150px;
  text-align: center !important;
}

.table-body {
  position: relative;
}

.table-row {
  position: absolute;
  width: 100%;
  height: auto;
  min-height: 60px;
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

.id-cell {
  width: 80px;
  font-weight: 600;
  color: #6b7280;
}

.type-cell {
  width: 120px;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
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
  width: 40%;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.disease-cell {
  width: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions-cell {
  width: 150px;
  text-align: center;
}

.edit-button, .delete-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin: 0 2px;
  transition: background-color 0.2s;
}

.edit-button {
  background: #3b82f6;
  color: white;
}

.edit-button:hover {
  background: #2563eb;
}

.delete-button {
  background: #ef4444;
  color: white;
}

.delete-button:hover {
  background: #dc2626;
}

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-textarea {
  height: 80px;
  resize: vertical;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

.cancel-button, .confirm-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background: #6b7280;
  color: white;
}

.cancel-button:hover {
  background: #4b5563;
}

.confirm-button {
  background: #10b981;
  color: white;
}

.confirm-button:hover {
  background: #059669;
}
</style>
