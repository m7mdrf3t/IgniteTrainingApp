import { supabase } from '../supabase';

export const getDoctorRequests = async () => {
  const session = (await supabase.auth.getSession()).data.session;
  const access_token = session?.access_token;

  const res = await fetch('https://gizqdfxguwdukyhndabn.supabase.co/functions/v1/get-doctor-requests', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch doctor requests');
  }

  return data.requests;
};