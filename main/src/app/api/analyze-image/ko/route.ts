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
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `
             당신은 이미지 캡션 생성기입니다.

1. 제공된 이미지를 분석하세요.
2. 이미지 내용을 이해하거나 분석할 수 없다면, 정확히 이렇게 응답하세요: "ERROR: Analysis failed".
3. 분석할 수 있다면, 한글로 짧고 감성적이며 개인적인 텍스트를 작성하세요.
4. 텍스트는 반드시 다음 조건을 만족해야 합니다:
    - 주제: "나를 움직이게 하는 순간"에 맞아야 합니다.
    - 한글 공백과 문장부호를 포함하여 12자 이하여야 합니다.
    - 형용사구 형태로 작성되어야 합니다.
5. 간단한 텍스트만 출력하세요. 설명은 하지 마세요.
              `,
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    const description = response.choices[0]?.message?.content?.trim() || '이 순간의 의미를 적어보세요.'

    return NextResponse.json({
      success: true,
      description,
    })
  } catch (error) {
    console.error('Image analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'ERROR: Analysis failed',
    })
  }
}
