// app/api/analyze-image/route.ts
import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // 파일을 base64로 변환
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "이 이미지를 보고 '나를 움직이게 하는 순간'이라는 주제로 감성적이고 개인적인 한 줄 설명을 한글로 작성해주세요. 22자 이내로 간결하게 써주세요."
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    const description = response.choices[0]?.message?.content?.trim() || '이 순간의 의미를 적어보세요.'

    return NextResponse.json({ 
      success: true, 
      description 
    })

  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}