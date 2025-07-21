import {defineStore} from "pinia";
import type {history_record, Observation} from "@/types/global";

const SQL = window.pywebview.api;

export const useHistoryStore = defineStore('history', {
    state: () => ({
        userId: 0,
        history: [] as history_record[]
    }),
    getters: {
        getUserId: (state) => state.userId,
        getHistory: (state) => state.history
    },
    actions: {
        getStringDate(date: Date): string {
            // Converts a Date object to a string in the format dd MMM YYYY (e.g., 12 Oct 2024)
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = d.toLocaleString('en-US', { month: 'short' });
            const year = d.getFullYear();
            return `${day} ${month} ${year}`;
        },
        setUserId(id: number) {
            this.userId = id;
        },
        clearHistory() {
            this.userId = 0;
            this.history = [];
        },
        async fetchHistory(id: number) {
            const getObservations = async (historyId: number):Promise<Observation[]> => {
                const result2 = await SQL.execute(`
                    select o.id, o.observation, o.observation_type as type, o.disease_id as disease_id, d.name as disease
                    from history_observations h, observations o, diseases d
                    where h.history_id = ?
                    and h.observation_id = o.id and o.disease_id = d.id
                `, [historyId]);
                if (result2.status !== "success") {
                    throw new Error("Failed to fetch observations: " + result2.message);
                }
                return result2.rows.map((row: any) => ({
                    id: row.id,
                    observation: row.observation,
                    type: row.type,
                    disease_id: row.disease_id,
                    disease: row.disease,
                    selected: false
                }));
            }
            try {
                const result1 = await SQL.execute(`
                    select user_id as uid, id as h_id, record_date as date, record_time as time
                    from history where user_id = ? 
                    order by record_date desc, record_time desc;
                `, [id]);
                if (result1.status !== "success") {
                    throw new Error("Failed to fetch history: " + result1.message);
                }
                const historyRecords: Promise<history_record>[] = result1.rows.map(async (row: any) => ({
                    uid: row.uid,
                    h_id: row.h_id,
                    date: new Date(row.date),
                    time: row.time,
                    observations: await getObservations(row.h_id)
                }))
                this.history = await Promise.all(historyRecords);
                this.userId = id;
            } catch (error) {
                console.error("Error fetching history:", error);
                this.clearHistory();
                alert("Error fetching history:");
            }
        },
        async deleteRecord(h_id: number) {
            this.history = this.history.filter(record => record.h_id !== h_id);
        }
    }
});