<template>
  <q-layout view='lHh Lpr lFf'>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar App</q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class='row items-center justify-evenly'>
        <q-card>
          <q-card-section>
            <div class='text-h6'>User Form</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <Form :initial-values='userRef' @submit='save'>
              <Field name='name' />
              <FieldArray name='roles' v-slot='{ fields }'>
                <q-table title='Roles' :rows='fields' :columns='columns' row-key='key' flat hide-bottom>
                  <template v-slot:body-cell-label='props'>
                    <q-td :props='props'>
                      <!-- To test without Field -->
                      <!-- <q-input dense v-model='props.row.value.label' /> -->
                      <Field name='label' v-model='props.row.value.label' />
                    </q-td>
                  </template>
                </q-table>
              </FieldArray>
              <q-btn icon='save' round type='submit' color='primary' />
            </Form>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <div class='text-h6'>Saved Model</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <pre class='row'>{{ userRef }}</pre>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>


<script setup lang='ts'>
import { Role, User } from 'src/models';
import { Field, FieldArray, Form } from 'vee-validate';
import { ref } from 'vue';

// Init a model
const user = new User();
user.id = 1;
user.name = 'Jane';
user.roles = new Array<Role>();
const role0 = new Role();
role0.label = 'Admin';
user.roles.push(role0);
const role1 = new Role();
role1.label = 'User';
user.roles.push(role1);

const userRef = ref(user);

const columns = [
  {
    name: 'label', label: 'Label', align: 'center', field: (row: any) => row.value.label, sortable: true,
    sort: (a: string, b: string) => {
      return a.localeCompare(b);
    }
  }
];

const save = (values: User) => {
  console.log(JSON.stringify(values, null, 2));
  userRef.value = values;
};

</script>
