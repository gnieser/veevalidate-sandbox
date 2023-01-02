<template>
  <q-layout view='lHh Lpr lFf'>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar/VeeValidate: QTable with FieldArray</q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class='row items-start justify-evenly q-pa-md'>
        <q-card>
          <q-card-section>
            <div class='text-h6'>User Form</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit='onSubmit' @reset='onReset'>
              <Field name='name' v-slot='{ field, value, errorMessage }'>
                <q-input label='Name' :model-value='value' v-bind='field' :error-message='errorMessage'
                         :error='!!errorMessage' dense />
              </Field>
              <q-table title='Roles' :rows='fields' :columns='columns' row-key='key' flat
                       :rows-per-page-options='[2]' bordered dense>
                <template v-slot:top>
                  <q-space />
                  <q-btn icon='add' round flat color='primary' @click='handleAddRole' />
                </template>
                <template v-slot:body-cell-label='props'>
                  <q-td :props='props'>
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
              <div class='q-mt-sm'>
                <q-btn icon='save' round type='submit' color='primary' />
                <q-btn icon='cancel' round outline type='reset' color='negative' class='q-ml-sm' />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <div class='text-h6'>FieldArray Model</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <pre class='row'>{{ fields }}</pre>
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
import { Field, FieldEntry, FormContext, FormValidationResult, useFieldArray, useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { AnySchema, array, object, ObjectSchema, string } from 'yup';

// Init a model
const user = new User(1, 'Jane');
user.roles.push(new Role('Admin'));
user.roles.push(new Role('User'));
user.roles.push(new Role('Reviewer'));
const userRef = ref(user);

const userSchema: ObjectSchema<Partial<Record<keyof User, AnySchema>>> = object<User>({
  name: string().required().min(3).max(15),
  roles: array().of(
    object({
      label: string().required().min(3).max(15)
    })
  )
});


// Template ref to table component
const table = ref();

// QTable columns definition
const columns = [
  {
    name: 'label', label: 'Label', align: 'center', sortable: true,
    field: (field: FieldEntry<Role>) => field.value.label,
    sort: (labelA: string, labelB: string) => labelA.localeCompare(labelB) // Not needed for string, kept for demo
  },
  { name: 'delete', label: 'Delete', align: 'center' }
];

// Vee-validate Form
const formContext: FormContext<User> = useForm({
  initialValues: userRef,
  validationSchema: userSchema,
  keepValuesOnUnmount: true
});

// Vee-validate roles field arrays
const { fields, push, remove } = useFieldArray<Role>('roles');

// Computes the index in the fields array of a given cell props. Used to build the Field's path.
const fieldIndex = (cellProps: Required<{ row: FieldEntry<Role> }>) => {
  return fields.value.findIndex((field: FieldEntry<Role>) => field.value === cellProps.row.value);
};

// Builds handler for form submission
// Triggered by the q-form when the inner q-btn with type submit is clicked
const onSubmit = formContext.handleSubmit((values: User) => {
  formContext.validate().then((validationResult: FormValidationResult<User>) => {
    if (validationResult.valid) {
      console.log('FormValidationResult is valid', validationResult);
      userRef.value = values;
    } else {
      console.log('FormValidationResult is not valid', validationResult);
    }
  });
});
const onReset = () => formContext.handleReset();

// Force a reset of the form when the initial values change
watch(userRef, () => {
  formContext.handleReset();
});

// Handler of role addition
const handleAddRole = () => {
  const newRole = new Role('New Role ' + fields.value.length);
  push(newRole);
};

// Handler of role deletion
const handleDeleteRole = (cellProps: Required<{ row: FieldEntry<Role> }>) => {
  remove(fieldIndex(cellProps));
};

</script>
