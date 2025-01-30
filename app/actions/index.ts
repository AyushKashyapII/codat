'use client'

import { signIn } from 'next-auth/react';

export async function socialLogin(formData:FormData) {
  const action = formData.get('action');

  if (typeof action !== 'string') {
    console.error('Invalid action, expected a string provider name');
    return;
  }

  console.log(action);

  const result = await signIn(action, {
    redirect: true,
    callbackUrl: '/'
  });

  if (result?.error) {
    console.error('Error during social login:', result.error);
  }
  else if(result?.ok){
    try{
      const response = await fetch('/api/save-user',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        }
      });
      if(response.ok){
        console.log('welcome boi');
      }
      else{
        console.log('fail hogya user tu');
      }
    }
    catch(error){
      console.error('error calling save-userr',error);
    }
  }
}