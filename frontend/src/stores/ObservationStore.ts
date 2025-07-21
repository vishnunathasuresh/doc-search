import {defineStore} from "pinia";
import type {Observation} from "@/types/global";

export const useObservationStore = defineStore('observation', {
    state: () => ({
        userId: 0,
        observations: [] as Observation[],
        userObservations: [] as Observation[],
    }),
    getters: {
        getUserId: (state) => state.userId,
        getObservations: (state) => state.observations,
        getUserObservations: (state) => state.userObservations,
    },
    actions: {
        setUserId(id: number) {
            this.userId = id;
        },

        setObservations(observations: Observation[]) {
            this.observations = observations;
        },

        setUserObservations(userObservations: Observation[]) {
            this.userObservations = userObservations;
        },

        addUserObservation(observation: Observation) {
            this.observations.push(observation);
        },

        addObservation(observation: Observation) {
            this.observations.push(observation);
        },

        async getObservationsFromDatabase(){
            // This function should fetch observations from the database
            // for now, it returns a static array
            return [
                {id: 1, observation: 'Fever', type: 'Symptom', disease_id: '1', disease: 'Flu', selected: false},
                {id: 2, observation: 'Cough', type: 'Symptom', disease_id: '1', disease: 'Flu', selected: false},
                {id: 3, observation: 'Headache', type: 'Symptom', disease_id: '2', disease: 'Migraine', selected: false},
            ];
        },

        async pushObservationToDatabase(observation: Observation) {
            // This function should contain the logic to push the observation to the database.
            // For now, it just adds the observation to the state.
            this.addObservation(observation);
        },

        async updateObservationToDatabase(observation: Observation) {
            // This function should contain the logic to update the observation in the database.
            // For now, it just updates the state.
            const index = this.observations.findIndex(obs => obs.id === observation.id);
            if (index !== -1) {
                this.observations[index] = observation;
            }
        }
    }
});