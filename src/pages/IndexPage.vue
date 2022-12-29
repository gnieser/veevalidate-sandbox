<template>
  <q-page class='row items-center justify-evenly'>
    <q-card>
      <q-card-section>
        <div class='text-h6'>User Form</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <UserForm ref='formRef' :model-value='userRef' />
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class='text-h6'>Live Form Model</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <pre>{{ liveFormModel?.value?.values }}</pre>
      </q-card-section>
    </q-card>
    <q-btn icon='save' round @click='save' />
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
</template>

<script setup lang='ts'>
import UserForm from 'components/UserForm.vue';
import { Role, User } from 'components/models';
import { onMounted, ref } from 'vue';

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

// In order to move the form actions outside the form component, we expose the formModel from the form component and use it directly.
const formRef = ref();
const save = async () => {
  const formModel = formRef.value.formModel;
  formModel.validate().then((formValidationResult) => {
    // if (formValidationResult.valid) {
    userRef.value = formModel.values;
    // } else {
    //   console.log('FormValidationResult is not valid', formValidationResult);
    // }
  });
};

const liveFormModel = ref();
onMounted(() => {
  if (formRef.value) {
    liveFormModel.value = ref(formRef.value.formModel);
    console.log(liveFormModel.value);
  }
});


</script>
