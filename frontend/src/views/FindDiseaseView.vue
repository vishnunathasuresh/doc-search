<template>
  <header class="flex items-center justify-between max-h-[8vh]">
    <h2 class="text-3xl font-bold p-4">
      Find Disease
    </h2>
    <Button class="m-4" @click="$router.push('/')" variant="secondary">
      <Icon icon="radix-icons:home" class="ml-1 size-5" /> Back to Home
    </Button>
  </header>
  <main class="flex flex-1 min-h-[92vh] w-full m-0 p-0">
    <Card v-if="isSuccessObservations" class="flex flex-col w-full h-full min-h-[92vh] justify-start items-stretch p-3 m-2">
      <div class="flex items-center gap-1 m-1">
        <Input v-model="searchDisease" placeholder="Search for a disease" />
        <Input v-model="searchSymptom" placeholder="Search for symptoms" />
      </div>
      <div class="flex-1 items-center justify-center">
        <Tabs v-model="selectedTab" class="w-full h-[calc(85vh)]">
          <TabsList class="grid w-full grid-cols-5">
            <TabsTrigger value="causes">Causes</TabsTrigger>
            <TabsTrigger value="clinical-presentation">Clinical Presentation</TabsTrigger>
            <TabsTrigger value="clinical-examination">Clinical Examination</TabsTrigger>
            <TabsTrigger value="laboratory-investigation">Lab Investigations</TabsTrigger>
            <TabsTrigger value="selected">Selected ({{ selectedObservations.length }})</TabsTrigger>
          </TabsList>
          <TabsContent value="causes">
            <SelectTable :data="causesData" @select="handleSelect" />
          </TabsContent>
          <TabsContent value="clinical-presentation">
            <SelectTable :data="clinicalPresentationData" @select="handleSelect" />
          </TabsContent>
          <TabsContent value="clinical-examination">
            <SelectTable :data="clinicalExaminationData" @select="handleSelect" />
          </TabsContent>
          <TabsContent value="laboratory-investigation">
            <SelectTable :data="laboratoryInvestigationData" @select="handleSelect" />
          </TabsContent>
          <TabsContent value="selected">
            <ViewTable
              :data="selectedObservations"
              @remove="handleRemoveObservation"
              @clear-all="handleClearAll"
            />
            <p>{{new Date(new Date().toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'})).toISOString() }}</p>
            <Button class = "m-2" :disabled = "selectedObservations.length === 0" @click="createRecord" variant="default">
              Confirm Selection and Proceed
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
    <div v-if="isFetchingObservations" class="flex justify-center items-center h-full">
      <p>Loading...</p>
    </div>
    <div v-if="isErrorObservations" class="flex justify-center items-center h-full text-red-500">
      <p>Error loading disease data.</p>
    </div>
  </main>
</template>
<script setup lang="ts">
import {ref, computed} from 'vue';
import { Icon } from '@iconify/vue';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {useQuery} from "@tanstack/vue-query";
import { useObservationStore } from "@/stores/ObservationStore.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import SelectTable from "@/components/SelectTable.vue";
import ViewTable from "@/components/ViewTable.vue";
import {useHistoryStore} from "@/stores/HistoryStore.ts";


const userStore = useUserStore();
const observationsStore = useObservationStore();
const historyStore = useHistoryStore();

observationsStore.setUserId(userStore.id);
const { isError: isErrorObservations, isFetching: isFetchingObservations, isSuccess: isSuccessObservations } = useQuery({
  queryKey: ['observations'],
  queryFn: async () => {
    await observationsStore.fetchObservationsFromDatabase();
    return [];
  },
});


// Search and selection logic
const searchDisease = ref('');
const searchSymptom = ref('');
const selectedTab = ref('causes');
// Use a Set for fast lookup
const selectedObsIds = ref<Set<number>>(new Set());

const allObservations = computed(() => observationsStore.observations || []);

function filterObservations(type: string) {
  return allObservations.value
    .filter(obs => obs.type === type)
    .filter(obs =>
      (!searchDisease.value || (obs.disease?.toLowerCase() || '').includes(searchDisease.value.toLowerCase())) &&
      (!searchSymptom.value || (obs.observation?.toLowerCase() || '').includes(searchSymptom.value.toLowerCase()))
    )
    .map(obs => ({
      disease_id: obs.disease_id,
      disease_name: obs.disease,
      observation: obs.observation,
      observation_type: obs.type,
      obs_id: obs.id,
      selected: selectedObsIds.value.has(obs.id)
    }));
}

function handleSelect(row: any) {
  if (selectedObsIds.value.has(row.obs_id)) {
    selectedObsIds.value.delete(row.obs_id);
  } else {
    selectedObsIds.value.add(row.obs_id);
  }
}

function handleRemoveObservation(obsId: number) {
  selectedObsIds.value.delete(obsId);
}

function handleClearAll() {
  selectedObsIds.value.clear();
}

// Get selected observations as RowData[]
const selectedObservations = computed(() => {
  return allObservations.value
    .filter(obs => selectedObsIds.value.has(obs.id))
    .map(obs => ({
      disease_id: obs.disease_id,
      disease_name: obs.disease,
      observation: obs.observation,
      observation_type: obs.type,
      obs_id: obs.id
    }));
});

const createRecord = async () => {
  if (selectedObservations.value.length === 0) {
    alert('Please select at least one observation.');
    return;
  }

  try {

    alert('Record created successfully!');
    await historyStore.addRecord({
      uid: userStore.id,
      h_id: 0,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      observations: selectedObservations.value.map(obs => ({
        id: obs.obs_id,
        observation: obs.observation,
        type: obs.observation_type,
        disease_id: obs.disease_id,
        disease: obs.disease_name,
        selected: true
      }))
    });
    selectedObsIds.value.clear(); // Clear selection after successful creation
  } catch (e) {
    console.error('Error creating record:');
    alert('Failed to create record. Please try again.');
  }
};

// Memoize filtered data for each tab
const causesData = computed(() => filterObservations('causes'));
const clinicalPresentationData = computed(() => filterObservations('clinical-presentation'));
const clinicalExaminationData = computed(() => filterObservations('clinical-examination'));
const laboratoryInvestigationData = computed(() => filterObservations('lab-investigation'));
</script>