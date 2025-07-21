<template>
  <header class="flex items-center justify-between max-h-[8vh]">
    <h2 class="text-3xl font-bold p-4">
      Disease Tracker
    </h2>
    <Button class="m-4" @click="$router.push('/repo')">
      Repo
    </Button>
  </header>
  <main class="flex h-[90vh] m-2" v-if="!isFetchingUsers && !isErrorUsers">
    <!-- Sidebar -->
    <Card class="w-1/4 min-w-[200px] h-full">
      <CardContent class="flex flex-col items-stretch justify-evenly p-3 gap-5">
        <Input placeholder="Search patient by name" v-model="searchTerm"/>
        <AddUserDialog />
        <p class="text-lg font-bold">Previous Patients</p>

        <div class="flex-2 flex flex-col">
          <ScrollArea class="h-[calc(63vh)] w-full">
            <div v-if="isFetchingUsers" class="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
            <div v-if="isErrorUsers" class="flex justify-center items-center h-full text-red-500">
              <p>Error loading users.</p>
            </div>
            <div v-if="!isFetchingUsers && !isErrorUsers" class="space-y-2">
              <Card v-for="user in filteredUsers" :key="user.id" class="p-2">
                <CardContent class="p-0" @click="selectUser(user)">
                  <div class="flex items-center justify-between m-0.5">
                    <p class="text-lg font-semibold leading-none">{{ user.name }}</p>
                    <Badge>{{ user.gender }}</Badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-500 leading-none">{{ dobToAge(user.dob) }}</p>
                    <Badge variant="outline">{{ user.phone }}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>

    <!-- Main Content -->
    <!--Patient info-->
    <Card class="flex-1 h-full ml-4">
      <CardHeader v-if="userStore.id != 0" class="h-[10%]">
        <div class="flex items-center justify-between">
          <p class="text-lg font-semibold">{{ userStore.name }}</p>
          <Badge>{{ userStore.gender }}</Badge>
        </div>
        <div class="flex items-start justify-between">
          <p class="text-sm font-medium text-gray-500 pl-1.5">{{ userStore.getAge }}</p>
          <p class="text-sm font-medium text-gray-500">{{ userStore.phone }}</p>
        </div>
        <div class="flex items-center justify-between">
          <Badge variant="outline">{{ userStore.address }}</Badge>
        </div>
        
      </CardHeader>
      
      <!--History section-->
      <CardContent class="h-[90%]" v-if="userStore.id != 0">
        <!--Searchbox for history, New history Record, Update User details, Delete user button-->
        <div class="flex items-center justify-between mt-2">
          <Input placeholder="Search history" v-model="searchHistoryTerm" class="w-1/2"/>
          <Button @click="$router.push('/new-record')">Add record<Icon icon="radix-icons:plus-circled"/></Button>
          <Button>Update User</Button>
          <Button variant="destructive">Delete User</Button>
        </div>
        <p class="text-lg font-semibold mb-2">Patient History</p>

        <ScrollArea class="h-[calc(65vh)] w-full">
          <div class="space-y-2">
            <History 
              :search-term="searchHistoryTerm" 
              :is-error="isErrorHistory" 
              :is-fetching="isFetchingHistory"
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";


// Stores
import { useUserStore } from "@/stores/UserStore.ts";
import { useUsersStore } from "@/stores/UsersStore.ts";
import History from "@/components/home/History.vue";
import AddUserDialog from "@/components/home/AddUserDialog.vue";
import { useHistoryStore } from "@/stores/HistoryStore";

// Store instances
const userStore = useUserStore();
const usersStore = useUsersStore();

// State
const searchTerm = ref("");
const searchHistoryTerm = ref("");
const filteredUsers = computed(() => usersStore.getSearchedUsers(searchTerm.value));
// Fetch users using useQuery
const { isFetching:isFetchingUsers, isError:isErrorUsers} = useQuery({
  queryKey: ["users"],
  queryFn: async ()=> {
    await usersStore.fetchUsersFromDatabase()
    return usersStore.getUsers;
  }
})

const historyStore = useHistoryStore();
const { isError:isErrorHistory, isFetching:isFetchingHistory, refetch: refetchHistory } = useQuery({
  queryKey: ['history', userStore.id],
  queryFn: async () => {
    await historyStore.fetchHistory(userStore.id);
    console.log("History fetched");
    return historyStore.history;
  },
  enabled: userStore.id !== 0,
  gcTime: 0, // Disable garbage collection
  staleTime: 0 // Disable stale time
});


// Methods
const dobToAge = (dob: string): string => {
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
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
};

const selectUser = (user: any) => {
  userStore.setUser({
    id: user.id,
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    address: user.address,
    dob: user.dob
  });
  console.log("Selected user:", userStore.getUser.id);
  refetchHistory(); // Refetch history when a user is selected
  searchHistoryTerm.value = ""; // Reset search term for history
};

</script>

<style scoped>
</style>