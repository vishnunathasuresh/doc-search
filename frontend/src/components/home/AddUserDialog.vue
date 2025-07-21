<template>
    <Dialog>
        <DialogTrigger as-child>
        <Button>Add Patient <Icon icon="radix-icons:plus-circled"/></Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle class="mb-0">Add Patient</DialogTitle>
            <DialogDescription>
            Add a new patient to the system.
            </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-2">
            <Input placeholder="Name" />
            <Input placeholder="Age" />
        </div>
        </DialogContent>
    </Dialog>
</template>
<script setup lang="ts">
import { Button } from '../ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Icon } from '@iconify/vue';
</script>
