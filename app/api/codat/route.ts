import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiDesc } from '@/lib/codatAIDescription';
import { aiFunc } from '@/lib/codatAIFunction';
import { qdrantStore } from '@/lib/qdrantStore';
import { currentProfile } from '@/lib/current-profile';
import { aiTags } from '@/lib/codatAITags';

export async function POST(req: Request) {
  const currentUser = await currentProfile();
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  // Log the raw request body for debugging
  const rawBody = await req.text();
  let requestBody;
  try {
    requestBody = JSON.parse(rawBody);
  } catch (parseError) {
    console.error('JSON parsing error:', parseError);
    return NextResponse.json({
      error: 'Invalid JSON in request body',
      rawBody: rawBody
    }, { status: 400 });
  }
  
  const { code, title, description, collectionId, language } = requestBody;
  
  // Validate request body
  if (!code || !title || !language) {
    return NextResponse.json({
      error: 'Missing required fields',
      receivedBody: requestBody
    }, { status: 400 });
  }
  
  if (!currentUser.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const aiDescritpion = await aiDesc(code, language) || '';
  const aiFunction = await aiFunc(code, language) || '';
  const aiTagsData = await aiTags(code, language);
  const aiTagsResult = aiTagsData?.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  
  const codat = await db.codat.create({
    data: {
      codatName: title,
      codatCode: code,
      codatLanguage: language,
      codatAuthor: {
        connect: {
          id: currentUser.id,
        },
      },
      codatDescription: description,
      codatAIDesc: aiDescritpion,
      codatAIFunc: aiFunction,
      codatTags: aiTagsResult,
      codatIsPublic: true,
      codatsCollectionPartOf: {
        connect: {
          collectionId: collectionId
        }
      }
    },
  });
  
  const aiSearcherData = await db.aiSearcher.findUnique({
    where: {
      attachedProfileId: currentUser.id
    },
    select: {
      textToPassToAI: true
    }
  });
  console.log(aiSearcherData);
  
  let currentData: { id: string, text: string }[] = [];

  if (aiSearcherData && Array.isArray(aiSearcherData.textToPassToAI)) {
    currentData = aiSearcherData.textToPassToAI as { id: string, text: string }[];
  }
    
  await db.aiSearcher.update({
    where: {
      attachedProfileId: currentUser.id
    },
    data: {
      textToPassToAI: [
        ...currentData,
        {
          id: codat.codatId,
          text: aiDescritpion
        }
      ]
    }
  });
  
  if (!currentUser.name) {
    return NextResponse.json({ error: 'User name not found' }, { status: 400 });
  }
  
  await qdrantStore(code, language, currentUser.name, Number(codat.codatId));
  console.log('Codat saved successfully:', codat);
  return NextResponse.json({ message: 'Codat saved successfully', codat }, { status: 200 });
}