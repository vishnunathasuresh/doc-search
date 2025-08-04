<template>
    <Dialog>
        <DialogTrigger as-child>
        <Button v-if="dialogType === 'add'">Add Patient <Icon icon="radix-icons:plus-circled"/></Button>
        <Button v-else-if="dialogType === 'update'" variant="outline">Update Patient <Icon icon="radix-icons:pencil-2"/></Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle class="mb-0">{{ dialogType === 'add' ? 'Add Patient' : 'Update Patient' }}</DialogTitle>
            <DialogDescription>
            {{ dialogType === 'add' ? 'Add a new patient to the system.' : 'Update the patient information.' }}
            </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-2">
            <Input placeholder="Name" required v-model="form.name" />
            <Input placeholder="Date of Birth" type="date" v-model="form.dob" required/>
            <Input placeholder="Phone" type="tel" required v-model="form.phone" />
            <Input placeholder="Address" default-value="" v-model="form.address" />
            <Label for="gender">Gender</Label>
            <Tabs v-model="form.gender" class="mb-2" id="gender">
              <TabsList>
                <TabsTrigger value="male">Male</TabsTrigger>
                <TabsTrigger value="female">Female</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>

        </div>
          <DialogFooter>
            <DialogClose as-child>
              <Button type="submit" @click="handleSubmit" :disabled="!form.name || !form.dob">Submit</Button>
            </DialogClose>
            
            <DialogClose as-child>
              <Button type="button" variant="secondary" @click="clearUserForm">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
<script setup lang="ts">

const { dialogType, id } = defineProps({
  dialogType: {
    type: String,
  },
  id: {
    type: Number,
    default: 0
  }
})

import { reactive } from 'vue';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Icon } from '@iconify/vue';
import { useUserStore } from '@/stores/UserStore';
import { useUsersStore } from '@/stores/UsersStore';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label'; 
const userStore = useUserStore();
const usersStore = useUsersStore();



const form = reactive({
  name: '',
  dob: '',
  address: '',
  phone: '',
  gender: 'male'
});

const clearUserForm = () => {
  form.name = '';
  form.dob = '';
  form.address = '';
  form.phone = '';
  form.gender = 'male';
}

if (dialogType === 'update') {
  const user = usersStore.getUserById(id);
  if (user) {
    form.name = user.name;
    form.dob = user.dob;
    form.address = user.address;
    form.phone = user.phone;
    form.gender = user.gender;
  }
}


const handleSubmit = () => {
  if (dialogType === 'add') {
    usersStore.addUser({ ...form });
    form.name = '';
    form.dob = '';
    form.address = '';
    form.phone = '';
    form.gender = 'male';

  } else {
    usersStore.updateUser({ id, ...form });
    userStore.setUser({ id, ...form });
  }
  clearUserForm();
}

</script>
