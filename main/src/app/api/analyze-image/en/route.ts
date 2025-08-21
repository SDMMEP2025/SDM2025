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
              You are an image caption generator.
              1. Analyze the provided image.
              2. If you cannot understand or analyze the image content, respond exactly with: "ERROR: Analysis failed".
              3. If you can analyze it, write ONE short, emotional, and personal text in English.
              4. The text must:
                  - Fit the theme: "Express the image poetically but intuitively"
                  - Must Be under 30 English characters (including spaces and punctuation, this is really important)
              5. Output ONLY the text. Do not explain.
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
