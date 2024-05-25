export async function askChatGpt(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer <API_KEY>`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant helping to provide hints for a game of Codenames.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      n: 1,
      stop: null,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
