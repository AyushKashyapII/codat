import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }
  const eventType = evt.type  
  if(eventType == 'user.created'){
    const {data} = evt
    let nameProfile = data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.username || 'Unknown';
    const email = data.email_addresses.length > 0 ? data.email_addresses[0].email_address : null;

    if (!email) {
        console.error('Error: User created event missing email address')
        return new Response('Error: Missing email address', { status: 400 })
    }
      const newProfile = await db.profile.create({
      data: {
        id: data.id,
        name: nameProfile,
        image: data.image_url,
        email: email ?? undefined,
      }
    });
  
    await db.aiSearcher.create({
      data: {
        attachedProfileId: newProfile.id
      }
    });
    }

    if(eventType =='user.deleted'){
        const {data} = evt
        await db.profile.delete({where:{
            id:data.id
        }
        })
    }

    if (eventType === 'user.updated') {
        const { data } = evt;
      
        let nameProfile = data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.username || 'Unknown';
        const email = data.email_addresses.length > 0 ? data.email_addresses[0].email_address : null;
      
        await db.profile.update({
          where: { id: data.id },
          data: {
            name: nameProfile,
            image: data.image_url,
            email: email ?? undefined 
          }
        });
      }      
    
  

  return new Response('Webhook received', { status: 200 })
}