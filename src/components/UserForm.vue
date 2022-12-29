<template>
  <div>
    <Field name='name' />
    <FieldArray name='roles' v-slot='{ fields }'>
      <q-table title='Roles' :rows='fields' :columns='columns' row-key='key'>
        <template v-slot:body-cell-label='props'>
          <q-td :props='props'>
            <Field name='label' v-model='props.row.value.label' />
          </q-td>
        </template>
      </q-table>
    </FieldArray>
  </div>
</template>

<script setup lang='ts'>
import { User } from './models';
import { Field, FieldArray, FormContext, useForm } from 'vee-validate';
import { toRef, watch } from 'vue';

const props = defineProps({
  modelValue: { type: User, required: true }
});

const modelValueRef = toRef(props, 'modelValue');
watch(() => props.modelValue, () => {
  formModel.handleReset();
});

const formModel: FormContext<User> = useForm<User>({
  initialValues: modelValueRef
});

const columns = [
  { name: 'label', label: 'Label', align: 'center' }
];

defineExpose({ formModel });
</script>
