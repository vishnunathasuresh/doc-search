import { defineStore } from 'pinia';
import type { user } from '@/types/global';

export const useUserStore  = defineStore('user', {
    state: () => ({
        id : 0,
        name: '',
        phone: '',
        gender: '',
        address: '',
        dob: '',
    }),
    getters: {
        getId: (state) => `${state.id}`,
        getName: (state) => `${state.name}`,
        getPhone: (state) => `${state.phone}`,
        getGender: (state) => `${state.gender}`,
        getAddress: (state) => `${state.address}`,
        getDob: (state) => `${state.dob}`,
        getAge: (state) => {
            const birthDate = new Date(state.dob);
            const today = new Date();

            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            let days = today.getDate() - birthDate.getDate();

            if (days < 0) {
                months--;
                // Get days in previous month
                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            if (years > 0) {
                return `${years} years`;
            } else if (months > 0) {
                return `${months} months`;
            } else {
                return `${days} days`;
            }
        },
        getUser: (state) => state,
    },
    
    actions: {
        setUser(user: user) {
            this.id = user.id;
            this.name = user.name;
            this.phone = user.phone;
            this.gender = user.gender;
            this.address = user.address;
            this.dob = user.dob;
        },

        clearUser() {
            this.id = 0;
            this.name = '';
            this.phone = '';
            this.gender = '';
            this.address = '';
            this.dob = '';
        },

        async updateUserToDatabase(user: user) {
            // This function should contain the logic to update the user in the database.
            // For now, it just updates the state.
            this.setUser(user);
        },

        async getUserHistoryFromDatabase() {
            // This function should contain the logic to fetch user history from the database.
            // For now, it just returns a sample history.
            return [
                {
                    uid: 1,
                    h_id: 101,
                    date: new Date(),
                    observations: [
                        {id:1021, observation: "ndkksanfkksfugdlknwefnwelkfnke", type: "cause", disease_id: 23233267, disease:"flu", selected: true},
                        {id:1022, observation: "ndkkf adlknwefnwnnelkfnke", type: "cause",disease_id: 323233267, disease:"fever",  selected: true},
                    ]
                },
                {
                    uid: 1,
                    h_id: 102211,
                    date: new Date(),
                    observations: [
                        {id:10211231, observation: "ndkksanfkksf jdf adlknwefdcdsddnwelkfnke", type: "cause", disease_id: 23233267, disease: "Flu", selected: true},
                        {id:1022212312, observation: "ndkksanfkksf jdf adlknwefnwnnelddsskfnke", type: "clinical-examination", disease_id: 23233267, disease: "Fever", selected: true}
                    ]
                }
            ]
        },

        async addUserToDatabase(user: user) {
            // This function should contain the logic to add a new user to the database.
            // For now, it just updates the state with the new user.
            this.setUser(user);
        },
        
        async fetchAllUsersFromDatabase(): Promise<user[]> {
            // This function should contain the logic to fetch all users from the database.
            // For now, it just returns a static array of users.
            return [
                {
                    id: 1,
                    name: 'John Doe',
                    gender: 'Male',
                    dob: '2025-07-12',
                    address: '123 Main St',
                    phone: '555-1234'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    gender: 'Female',
                    dob: '2025-03-23',
                    address: '456 Oak Ave',
                    phone: '555-5678'
                },
                {
                    id: 3,
                    name: 'Alice Johnson',
                    gender: 'Female',
                    dob: '1996-02-17',
                    address: '789 Pine Rd',
                    phone: '555-8765'
                },
                {
                    id: 4,
                    name: 'Bob Brown',
                    gender: 'Male',
                    dob: '1989-11-30',
                    address: '321 Maple St',
                    phone: '555-4321'
                },
                {
                    id: 5,
                    name: 'Charlie White',
                    gender: 'Male',
                    dob: '2002-03-14',
                    address: '654 Elm St',
                    phone: '555-2468'
                },
                {
                    id: 6,
                    name: 'Diana Green',
                    gender: 'Female',
                    dob: '1997-07-09',
                    address: '987 Cedar Ave',
                    phone: '555-1357'
                },
                {
                    id: 7,
                    name: 'Ethan Blue',
                    gender: 'Male',
                    dob: '1993-12-21',
                    address: '159 Spruce Rd',
                    phone: '555-9753'
                },
                {
                    id: 8,
                    name: 'Fiona Black',
                    gender: 'Female',
                    dob: '1995-10-05',
                    address: '753 Birch Blvd',
                    phone: '555-8642'
                },
                {
                    id: 9,
                    name: 'George Grey',
                    gender: 'Male',
                    dob: '1991-04-18',
                    address: '852 Willow Ln',
                    phone: '555-3579'
                },
                {
                    id: 10,
                    name: 'Hannah Yellow',
                    gender: 'Female',
                    dob: '1998-06-27',
                    address: '951 Aspen Ct',
                    phone: '555-4682'
                },
            ]
        }
        
    }
});