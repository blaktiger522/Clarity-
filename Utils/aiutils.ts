import { Platform } from 'react-native';

interface AIResponse {
  completion: string;
}

export const recognizeText = async (imageBase64: string): Promise<string> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an OCR (Optical Character Recognition) expert. Your task is to accurately extract and transcribe text from images. Respond only with the extracted text, nothing else. Preserve the formatting where possible.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract and transcribe all text from this image:'
              },
              {
                type: 'image',
                image: imageBase64
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    const data: AIResponse = await response.json();
    return data.completion.trim();
  } catch (error) {
    console.error('Error recognizing text:', error);
    return 'Error extracting text. Please try again.';
  }
};

// For web testing when we can't capture real images
export const mockRecognizeText = async (): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockResponses = [
    "INVOICE\n\nInvoice #: INV-2023-0042\nDate: June 15, 2023\n\nBill To:\nAcme Corporation\n123 Business Ave\nCorporate Park, CA 94107\n\nDescription | Quantity | Rate | Amount\n--------------------------------\nConsulting Services | 40 | $150 | $6,000\nSoftware License | 1 | $2,500 | $2,500\n\nSubtotal: $8,500\nTax (8.5%): $722.50\nTotal Due: $9,222.50",
    
    "MEETING MINUTES\n\nProject: Website Redesign\nDate: March 10, 2023\nAttendees: John Smith, Sarah Johnson, Michael Wong\n\nKey Discussion Points:\n1. Timeline review - project on track for May launch\n2. Budget approval for additional design resources\n3. Content migration strategy finalized\n\nAction Items:\n- John: Prepare design mockups by 3/17\n- Sarah: Schedule user testing sessions\n- Michael: Update stakeholders on progress",
    
    "RECEIPT\n\nGreen Grocery Market\n456 Fresh Street\nHealthytown, NY 10001\n\nDate: 04/22/2023\nTime: 14:32\n\nOrganic Apples (1lb) - $3.99\nWhole Grain Bread - $4.50\nFarm Fresh Eggs (dozen) - $5.99\nAlmond Milk (32oz) - $3.49\n\nSubtotal: $17.97\nTax: $1.44\nTotal: $19.41\n\nThank you for shopping with us!",
    
    "BUSINESS CARD\n\nJane Doe, MBA\nSenior Marketing Director\n\nTech Innovations Inc.\n\nPhone: (555) 123-4567\nEmail: jane.doe@techinnovations.com\nwww.techinnovations.com\n\n100 Enterprise Way, Suite 300\nSilicon Valley, CA 94025"
  ];
  
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};
