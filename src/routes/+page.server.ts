import type { Actions } from "@sveltejs/kit";
import * as env from "$env/static/private";

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const prompt = data.get("prompt");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 200,
                n: 1,
                stop: "\n",
                temperature: 0.5
            })
        });

        const generated = (await response.json()).choices[0].message.content;

        return {
            uid: crypto.randomUUID(),
            prompt,
            generated,
            timestamp: Date.now()
        };
    }
};
