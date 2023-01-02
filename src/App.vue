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
            <q-form @submit='onSubmit'>
              <Field name='name' v-slot='{ field, value, errorMessage }'>
                <q-input label='Name' :model-value='value' v-bind='field' :error-message='errorMessage'
                         :error='!!errorMessage' dense />
              </Field>
              <q-table ref='table' title='Roles' :rows='fields' :columns='columns' row-key='key' flat
                       :rows-per-page-options='[2]' bordered dense>
                <template v-slot:top>
                  <q-space />
                  <q-btn icon='add' round flat color='primary' @click='handleAddRole' />
                </template>
                <template v-slot:body-cell-label='props'>
                  <q-td :props='props' v-if='tableMounted'>
                    <Field :name='`roles[${fieldIndex(props)}].label`' v-slot='{ field, value, errorMessage }'>
                      <q-input :label='field.name' :model-value='value' v-bind='field' :error-message='errorMessage'
                               :error='!!errorMessage' dense />
                    </Field>
                  </q-td>
                </template>
                <template v-slot:body-cell-delete='props'>
                  <q-btn icon='delete' round flat color='primary'
                         @click.stop='props.selected = true; handleDeleteRole(props)' />
                </template>
              </q-table>
              <q-btn icon='save' round type='submit' color='primary' />
            </q-form>
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
import { Field, FieldEntry, FormContext, useFieldArray, useForm } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';

// Init a model
const user = new User(1, 'Jane');
user.roles.push(new Role('Admin'));
user.roles.push(new Role('User'));
user.roles.push(new Role('Reviewer'));
const userRef = ref(user);

// Template ref to table component, along its mounted flag (so the fieldIndex function is not called prematurely)
const table = ref();
const tableMounted = ref(false);
onMounted(() => tableMounted.value = true);

// QTable columns definition
const columns = [
  {
    name: 'label', label: 'Label', align: 'center', field: (row: FieldEntry<Role>) => row.value.label, sortable: true,
    sort: (a: string, b: string) => {
      return a.localeCompare(b);
    }
  },
  { name: 'delete', label: 'Delete', align: 'center' }
];

// Vee-validate Form
const formContext: FormContext<User> = useForm({
  initialValues: userRef,
  keepValuesOnUnmount: true
});

// Vee-validate roles field arrays
const { fields, push, remove } = useFieldArray('roles');

// Computes the index in the fields array of a given cell props. Used to build the Field's path.
const fieldIndex = (cellProps: Required<{ row: FieldEntry<User> }>) => {
  return table.value.filteredSortedRows.findIndex((row: FieldEntry<User>) => row.value === cellProps.row.value);
};

// Builds handler for form submission
// Triggered by the q-form when the inner q-btn with type submit is clicked
const onSubmit = formContext.handleSubmit((values: User) => {
  userRef.value = values;
});

// Force a reset of the form when the initial values change
watch(userRef, () => {
  formContext.handleReset();
})

// Handler of role addition
const handleAddRole = () => {
  const newRole = new Role('New Role');
  push(newRole);
};

// Handler of role deletion
const handleDeleteRole = (cellProps: Required<{ row: FieldEntry<User> }>) => {
  const index = fields.value.findIndex(r => {
    return r.value === cellProps.row.value;
  });
  remove(index);
};

</script>
