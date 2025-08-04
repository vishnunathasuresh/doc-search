<template>
  <div class="repo-view">
    <header class="repo-header">
      <h2 class="repo-title">Repository Management</h2>
      <Button @click="$router.push('/')" variant="secondary">
        <Icon icon="radix-icons:home" class="mr-2 size-4" /> Back to Home
      </Button>
    </header>

    <main class="repo-main">
      <div v-if="isLoading" class="loading-state">
        <p>Loading repository data...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <Button @click="loadData" variant="outline">Retry</Button>
      </div>

      <EditTable
        v-else
        :data="observations"
        :diseases="diseases"
        @add-disease="handleAddDisease"
        @add-observation="handleAddObservation"
        @edit-observation="handleEditObservation"
        @delete-observation="handleDeleteObservation"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import EditTable from '@/components/EditTable.vue';
import type { Observation } from '@/types/global';

interface Disease {
  id: number;
  name: string;
}

const SQL = window.pywebview.api;

const observations = ref<Observation[]>([]);
const diseases = ref<Disease[]>([]);
const isLoading = ref(true);
const error = ref('');

async function loadData() {
  try {
    isLoading.value = true;
    error.value = '';

    // Load diseases
    const diseasesResult = await SQL.execute('SELECT id, name FROM diseases ORDER BY name', []);
    if (diseasesResult.status !== 'success') {
      throw new Error('Failed to load diseases: ' + diseasesResult.message);
    }
    diseases.value = diseasesResult.rows;

    // Load observations with disease names
    const observationsResult = await SQL.execute(`
      SELECT o.id, o.observation, o.observation_type as type, o.disease_id, d.name as disease
      FROM observations o
      JOIN diseases d ON o.disease_id = d.id
      ORDER BY o.observation_type, o.observation, d.name
    `, []);

    if (observationsResult.status !== 'success') {
      throw new Error('Failed to load observations: ' + observationsResult.message);
    }

    observations.value = observationsResult.rows.map((row: any) => ({
      id: row.id,
      observation: row.observation,
      type: row.type,
      disease_id: row.disease_id,
      disease: row.disease,
      selected: false
    }));

  } catch (err) {
    console.error('Error loading data:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load data';
  } finally {
    isLoading.value = false;
  }
}

async function handleAddDisease(diseaseData: { name: string }) {
  try {
    const result = await SQL.execute(
      'INSERT INTO diseases (name) VALUES (?)',
      [diseaseData.name]
    );

    if (result.status !== 'success') {
      throw new Error('Failed to add disease: ' + result.message);
    }

    // Get the new disease ID
    const newDiseaseResult = await SQL.execute(
      'SELECT id, name FROM diseases WHERE name = ? ORDER BY id DESC LIMIT 1',
      [diseaseData.name]
    );

    if (newDiseaseResult.status === 'success' && newDiseaseResult.rows.length > 0) {
      diseases.value.push(newDiseaseResult.rows[0]);
      diseases.value.sort((a, b) => a.name.localeCompare(b.name));
    }

    alert('Disease added successfully!');
  } catch (err) {
    console.error('Error adding disease:', err);
    alert('Failed to add disease: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

async function handleAddObservation(observationData: { observation: string; type: string; disease_id: number }) {
  try {
    const result = await SQL.execute(
      'INSERT INTO observations (observation, observation_type, disease_id) VALUES (?, ?, ?)',
      [observationData.observation, observationData.type, observationData.disease_id]
    );

    if (result.status !== 'success') {
      throw new Error('Failed to add observation: ' + result.message);
    }

    // Get the new observation with disease name
    const newObservationResult = await SQL.execute(`
      SELECT o.id, o.observation, o.observation_type as type, o.disease_id, d.name as disease
      FROM observations o
      JOIN diseases d ON o.disease_id = d.id
      WHERE o.observation = ? AND o.observation_type = ? AND o.disease_id = ?
      ORDER BY o.id DESC LIMIT 1
    `, [observationData.observation, observationData.type, observationData.disease_id]);

    if (newObservationResult.status === 'success' && newObservationResult.rows.length > 0) {
      const newObs = newObservationResult.rows[0];
      observations.value.push({
        id: newObs.id,
        observation: newObs.observation,
        type: newObs.type,
        disease_id: newObs.disease_id,
        disease: newObs.disease,
        selected: false
      });
    }

    alert('Observation added successfully!');
  } catch (err) {
    console.error('Error adding observation:', err);
    alert('Failed to add observation: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

async function handleEditObservation(observationData: Observation) {
  try {
    const result = await SQL.execute(
      'UPDATE observations SET observation = ?, observation_type = ?, disease_id = ? WHERE id = ?',
      [observationData.observation, observationData.type, observationData.disease_id, observationData.id]
    );

    if (result.status !== 'success') {
      throw new Error('Failed to update observation: ' + result.message);
    }

    // Get the disease name for the updated observation
    const diseaseResult = await SQL.execute(
      'SELECT name FROM diseases WHERE id = ?',
      [observationData.disease_id]
    );

    if (diseaseResult.status === 'success' && diseaseResult.rows.length > 0) {
      const diseaseName = diseaseResult.rows[0].name;

      // Update the observation in the local array
      const index = observations.value.findIndex(obs => obs.id === observationData.id);
      if (index !== -1) {
        observations.value[index] = {
          ...observationData,
          disease: diseaseName
        };
      }
    }

    alert('Observation updated successfully!');
  } catch (err) {
    console.error('Error updating observation:', err);
    alert('Failed to update observation: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

async function handleDeleteObservation(observationId: number) {
  try {
    const result = await SQL.execute(
      'DELETE FROM observations WHERE id = ?',
      [observationId]
    );

    if (result.status !== 'success') {
      throw new Error('Failed to delete observation: ' + result.message);
    }

    // Remove the observation from the local array
    observations.value = observations.value.filter(obs => obs.id !== observationId);

    alert('Observation deleted successfully!');
  } catch (err) {
    console.error('Error deleting observation:', err);
    alert('Failed to delete observation: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.repo-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.repo-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.repo-main {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.error-message {
  color: #dc2626;
  font-size: 16px;
  text-align: center;
}
</style>
