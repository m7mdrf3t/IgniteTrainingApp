import { supabase } from '../supabase';

export const createRequest = async (device_name: string, description: string) => {
  const session = (await supabase.auth.getSession()).data.session;
  const access_token = session?.access_token;

  const response = await fetch('https://gizqdfxguwdukyhndabn.supabase.co/functions/v1/createRequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ device_name, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create request');
  }

  return data;
};