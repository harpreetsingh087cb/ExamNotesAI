
export const generateGeminiResponse = async (prompt) => {
    try {
        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const response = await fetch(`${geminiUrl}?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini API responded with status ${response.status}: ${err}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No text returned from Gemini");
        }

        let cleanText = text.trim();
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.substring(7);
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith("```")) {
            cleanText = cleanText.slice(0, -3);
        }
        cleanText = cleanText.trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Fetch Error:", error.message);
        throw new Error(`Gemini generation failed: ${error.message}`);
    }
}