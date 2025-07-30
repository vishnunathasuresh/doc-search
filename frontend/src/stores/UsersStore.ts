import { defineStore} from "pinia";
import type {user} from "@/types/global";

interface userWithoutId {
    name: string;
    phone: string;
    dob: string;
    address: string;
    gender: string;
}
const SQL = window.pywebview.api;

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [] as user[]
    }),
    getters: {
        getUsers: (state) => state.users,
        getSearchedUsers: (state) => (searchTerm: string) => {
            if (!searchTerm) return state.users;
            const term = searchTerm.toLowerCase();
            return state.users.filter(user =>
                user.name.toLowerCase().includes(term) ||
                user.phone.includes(searchTerm) ||
                user.address.toLowerCase().includes(term) ||
                user.gender.toLowerCase().includes(searchTerm)
            );
        }
    },
    actions: {
        getUserById(id: number) {
            return this.users.find(user => user.id === id) || null;
        },
        setUsers(users: user[]) {
            this.users = users;
        },
        async addUser(user: userWithoutId) {
            try{
                const result1 = await SQL.execute(`
                insert into users ( name, phone, gender, address, dob) values (?, ?, ?, ?, ?);
                `, [user.name, user.phone, user.gender, user.address, user.dob.toString()])
                if (result1.status !== "success") {
                    new Error("Failed to add user: " + result1.message);
                }

                const result2 = await SQL.execute(`
                select id from users where name = ? and phone = ? and address = ? and dob = ? and gender = ?;
                `, [user.name, user.phone, user.address, user.dob.toString(), user.gender])
                if (result2.status !== "success") {
                    throw new Error("Failed to fetch user ID: " + result2.message);
                }
                const userId:number = result2.rows[0].id;
                this.users.push({
                    id:userId,
                    name:user.name,
                    phone: user.phone,
                    gender: user.gender,
                    address: user.address,
                    dob: user.dob.toString()
                });
            } catch (error) {
                console.error("Error adding user:", error);
            }

        },
        async updateUser(updatedUser: user) {
            const { id, name, dob, address, phone, gender } = updatedUser;
            try {
                const result = await SQL.execute(`
                    update users
                    set name = ?, dob = ?, address = ?, phone = ?, gender = ? where id = ?
                `,[name, dob, address, phone, gender, id])
                if (result.status !== "success") {
                    throw new Error("Failed to update user: " + result.message);
                }
                const index = this.users.findIndex(user => user.id === id);
                if (index !== -1) {
                    this.users[index] = { id, name, dob, address, phone, gender };
                }
            } catch (e) {
                console.error(e);
            }
            
        },
        async deleteUser(id: number) {
            try {
                const result = await SQL.execute(`
                delete from users where id = ?;
                `, [id]);
                if (result.status !== "success") {
                    throw new Error("Failed to delete user: " + result.message);// ignore this line
                }
                this.users = this.users.filter(user => user.id !== id);
            } catch (e) {
                console.error(e);
            }
        },
        async fetchUsersFromDatabase() {
            try {
                const result = await SQL.execute(`
                select id, name, gender, dob, address, phone from users order by id desc;
                `);
                if (result.status === "success") {
                    // Transform the sample data to match the user interface
                    const transformedUsers = result.rows.map((row: any) => ({
                        id: row.id,
                        name: row.name,
                        gender: row.gender,
                        dob: row.dob,
                        address: row.address,
                        phone: row.phone
                    }));
                    this.setUsers(transformedUsers);
                } else {
                    console.error("Failed to fetch users:", result.message);
                    // Fallback to mock data if database fails
                    this.setUsers([
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
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error calling Python backend:", error);
                // Fallback to mock data if backend is not available
                this.setUsers([
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
                    }
                ]);
            }
        }
    }

})