
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (
  productName: string, 
  attributes: string[], 
  style: string = 'Professional', 
  options: { emojis?: boolean, bolding?: boolean, lists?: boolean, seo?: boolean } = {}
) => {
  const ai = getAI();
  
  let stylingInstructions = "";
  if (options.emojis) stylingInstructions += "- Używaj odpowiednich emoji, aby ożywić tekst. ";
  if (options.bolding) stylingInstructions += "- Pogrubiaj kluczowe zalety i parametry (tag <strong>). ";
  if (options.lists) stylingInstructions += "- Najważniejsze cechy przedstaw w formie listy punktowanej (tagi <ul> i <li>). ";
  if (options.seo) stylingInstructions += "- Zoptymalizuj tekst pod kątem SEO, naturalnie wplatając nazwę produktu. ";

  const stylePrompts: Record<string, string> = {
    'Professional': 'stonowany, profesjonalny i godny zaufania',
    'Sales': 'agresywny sprzedażowo, nastawiony na szybką konwersję i silne CTA',
    'Storytelling': 'narracyjny, budujący emocjonalną więź z użytkownikiem i opisujący doświadczenie z produktem',
    'Minimalist': 'skondensowany, konkretny, skupiony na faktach bez zbędnych przymiotników',
    'Technical': 'ekspercki, skupiony na detalach technicznych, wydajności i precyzji'
  };

  const prompt = `Generuj profesjonalny opis produktu dla: ${productName}. 
  Atrybuty i dane techniczne: ${attributes.join(', ')}.
  Język: polski. 
  Styl komunikacji: ${stylePrompts[style] || stylePrompts['Professional']}. 
  
  Instrukcje formatowania HTML:
  ${stylingInstructions}
  - Wynik musi być poprawnym fragmentem HTML (używaj <p>, <ul>, <li>, <strong>).
  - Nie używaj tagów <html>, <body> ani <h1>/<h2>.
  - Odpowiedz wyłącznie wygenerowanym opisem.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const translateTechnicalSpecs = async (specs: any[], targetLang: string) => {
  const ai = getAI();
  const prompt = `Przetłumacz poniższą specyfikację techniczną produktu na język: ${targetLang}. 
  Tłumacz nazwy sekcji (title) i etykiety atrybutów (label). 
  Wartości (value) tłumacz tylko jeśli zawierają tekst opisowy, zachowaj jednostki miary i wartości liczbowe bez zmian.
  Zwróć wynik jako czysty JSON pasujący do formatu wejściowego.
  Format wejściowy: ${JSON.stringify(specs)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw error;
  }
};

export const semanticSearchProducts = async (query: string) => {
  const ai = getAI();
  const prompt = `Przetłumacz poniższe zapytanie użytkownika na intencję wyszukiwania w katalogu produktów PIMM. 
  Zapytanie: "${query}"
  
  Zwróć wynik w formacie JSON zawierający mapowanie atrybutów technicznych.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            params: {
              type: Type.OBJECT,
              properties: {
                requiredProperties: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.ARRAY, items: { type: Type.STRING } },
                      unit: { type: Type.STRING, nullable: true },
                      condition: { type: Type.STRING },
                      or_with: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["name", "value", "condition", "or_with"]
                  }
                }
              }
            }
          }
        }
      }
    });
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const extractSpecsFromFile = async (
  fileBase64: string,
  mimeType: string,
  existingSections: string[]
) => {
  const ai = getAI();
  
  const prompt = `Przeanalizuj załączony plik producenta i wyodrębnij z niego parametry techniczne produktu. 
  Twoim zadaniem jest dopasowanie wyłapanych informacji do poniższych sekcji specyfikacji:
  ${existingSections.join(', ')}.

  Jeśli znajdziesz parametry, które nie pasują do żadnej z powyższych sekcji, przypisz je do sekcji "INNE".
  Dla każdego parametru określ: etykietę (label), wartość (value) oraz opcjonalnie jednostkę (unit).

  Zwróć wynik wyłącznie w formacie JSON jako tablicę sekcji z atrybutami.
  Przykład formatu:
  [
    {
      "title": "EKRAN",
      "items": [
        { "label": "Przekątna", "value": "15.6", "unit": "cale" }
      ]
    }
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: fileBase64, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
