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
            <Form :initial-values='userRef' @submit='save' keepValues='true'>
              <Field name='name' />
              <FieldArray name='roles' v-slot='{ fields }'>
                <q-table ref='table' title='Roles' :rows='fields' :columns='columns' row-key='key' flat
                         :rows-per-page-options='[2]'>
                  <template v-slot:body-cell-label='props'>
                    <q-td :props='props' v-if='tableMounted'>
                      <Field :name='roleFieldName(props)' v-model='props.row.value.label' v-slot='{ errorMessage, value, field }'>
                        <q-input :model-value='value' v-bind='field' :error-message='errorMessage'
                                 :error='!!errorMessage' dense />
                      </Field>
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
import { onMounted, ref } from 'vue';

// Init a model
const user = new User(1, 'Jane');
user.roles.push(new Role('Admin'));
user.roles.push(new Role('User'));
user.roles.push(new Role('Reviewer'));
const userRef = ref(user);

const table = ref(); // template ref to table component

const columns = [
  {
    name: 'label', label: 'Label', align: 'center', field: (row: any) => row.value.label, sortable: true,
    sort: (a: string, b: string) => {
      return a.localeCompare(b);
    }
  }
];

const roleFieldName = (props:any) => {
  if (table.value) {
    const index = table.value.filteredSortedRows.findIndex((row: any) => row.value === props.row.value);
    return 'roles[' + index + '].label';
  }
};

const tableMounted = ref(false);
onMounted(() => tableMounted.value = true)

const save = (values: User) => {
  console.log(JSON.stringify(values, null, 2));
  userRef.value = values;
};

</script>
