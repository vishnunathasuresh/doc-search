

<template>
  <strong v-if="isError">Error loading history</strong>
  <strong v-else-if="isFetching">Loading history...</strong>
  <strong v-else-if="historyStore.history.length === 0">No history records found</strong>
  <Accordion v-else type="single" class="w-full" collapsible :default-value="historyStore.getHistory.length > 0 ? historyStore.history[0].h_id.toString() : undefined">
    <AccordionItem v-for="record in searchHistory" :key="record.h_id" :value="record.h_id.toString()">
      <AccordionTrigger>{{ historyStore.getStringDate(record.date) }} - {{ record.time }}</AccordionTrigger>
      <AccordionContent>
        <span v-for="d in getDiseases(record.observations)" class="pr-1"><Badge>{{ d }}</Badge></span>
        <div class="mb-2">
          <ul class="list-disc pl-5">
            <li v-for="obs in record.observations" :key="obs.id" class="text-sm text-gray-500">
              {{ obs.observation }} - <span class="font-semibold">{{ obs.disease }}</span>
            </li>
          </ul>
        </div>
        <Button @click="async ()=>await historyStore.deleteRecord(record.h_id)" variant="destructive" class="mt-2">
          Delete Record
          <Icon icon="radix-icons:trash" />
        </Button>
      </AccordionContent>
    </AccordionItem>
  </Accordion>

</template>

<script setup lang="ts">
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from '@/components/ui/accordion'
import { useHistoryStore } from '@/stores/HistoryStore';
import type { history_record, Observation } from '@/types/global';
import { Badge } from '../ui/badge';
import { computed } from 'vue';
import { Button } from '../ui/button';
import { Icon } from '@iconify/vue';


const { searchTerm, isError, isFetching } = defineProps(
  {
    searchTerm: {
      type: String,
      default: '',
      required: true
    },
    isError: {
      type: Boolean,
      default: false
    },
    isFetching: {
      type: Boolean,
      default: false
    }
  }
)
const historyStore = useHistoryStore();


const getDiseases = (observations: Observation[]) => {
  const diseases: string[] = [];
  observations.forEach((observation) => {
    if (observation.disease && !diseases.includes(observation.disease)) {
      diseases.push(observation.disease);
    }
  });
  return diseases;
};

const searchHistory = computed(() => {
  return historyStore.history.filter((record: history_record) => {
    const search = searchTerm.toLowerCase();
    const formattedDate = historyStore.getStringDate(record.date).toLowerCase();
    const dateMatch = formattedDate.includes(search)
    const observationMatch = record.observations.some((obs: Observation) =>
      obs.observation.toLowerCase().includes(search)
    );
    const diseaseMatch = record.observations.some((obs: Observation) =>
      obs.disease.toLowerCase().includes(search)
    );
    return dateMatch || diseaseMatch || observationMatch;
  });
});
</script>