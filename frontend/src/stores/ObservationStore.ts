import {defineStore} from "pinia";
import type {Observation} from "@/types/global";

const sql = window.pywebview.api;

export const useObservationStore = defineStore('observation', {
    state: () => ({
        userId: 0,
        observations: [] as Observation[],
        userObservations: [] as Observation[],
    }),
    getters: {
        getUserId: (state) => state.userId,
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

        async fetchObservationsFromDatabase() {
            try {
                const observations = await sql.execute(
                    `SELECT o.id,
                            o.observation as observation,
                            o.observation_type AS type,
                            o.disease_id       AS disease_id,
                            d.name            AS disease
                     FROM observations o
                     JOIN diseases d ON o.disease_id = d.id`, []
                )
                if (observations.status !== "success") {
                    throw new Error("Failed to fetch observations: " + observations.message);
                }
                this.observations = observations.rows.map((row: any) => ({
                    id: row.id,
                    observation: row.observation,
                    type: row.type,
                    disease_id: row.disease_id,
                    disease: row.disease,
                    selected: false
                }));

            } catch (error) {
                console.error("Failed to fetch observations from database:", error);
            }
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