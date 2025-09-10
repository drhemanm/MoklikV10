import { useState, useCallback } from 'react';

interface Tip {
  id: string;
  content: string;
  type: 'general' | 'topic' | 'exam' | 'motivation';
}

export function useAssistantTips(topic?: string) {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);

  const getTopicSpecificTips = useCallback((topic: string): Tip[] => {
    return [
      {
        id: `${topic}-1`,
        content: `When studying ${topic}, start with the fundamental concepts before moving to complex problems.`,
        type: 'topic'
      },
      {
        id: `${topic}-2`,
        content: `Create a mind map for ${topic} to visualize how different concepts are connected.`,
        type: 'topic'
      },
      {
        id: `${topic}-3`,
        content: `Practice ${topic} problems daily, starting from easier ones and gradually increasing difficulty.`,
        type: 'topic'
      },
      {
        id: `${topic}-4`,
        content: `For ${topic}, review past exam questions to understand common patterns and examiner expectations.`,
        type: 'topic'
      }
    ];
  }, []);

  const getGeneralTips = useCallback((): Tip[] => {
    return [
      {
        id: 'general-1',
        content: 'Remember to take short breaks between study sessions to maintain focus.',
        type: 'general'
      },
      {
        id: 'general-2',
        content: "Try explaining concepts to others - it helps reinforce your understanding!",
        type: 'general'
      },
      {
        id: 'general-3',
        content: 'Keep a math journal to track formulas, concepts, and common mistakes.',
        type: 'general'
      }
    ];
  }, []);

  const getExamTips = useCallback((): Tip[] => {
    return [
      {
        id: 'exam-1',
        content: 'Always read the question carefully and identify the key information.',
        type: 'exam'
      },
      {
        id: 'exam-2',
        content: 'Show all your working steps clearly to maximize marks.',
        type: 'exam'
      },
      {
        id: 'exam-3',
        content: 'Check your answers by substituting values or using estimation.',
        type: 'exam'
      }
    ];
  }, []);

  const getMotivationalTips = useCallback((): Tip[] => {
    return [
      {
        id: 'motivation-1',
        content: 'Every problem solved is a step toward mastery. Keep going!',
        type: 'motivation'
      },
      {
        id: 'motivation-2',
        content: 'Mistakes are opportunities to learn. Embrace them!',
        type: 'motivation'
      },
      {
        id: 'motivation-3',
        content: 'You are making progress every day, even if it does not feel like it.',
        type: 'motivation'
      }
    ];
  }, []);

  const generateTip = useCallback((messageType?: 'success' | 'error' | 'info') => {
    const tips: Tip[] = [
      ...(topic ? getTopicSpecificTips(topic) : []),
      ...getGeneralTips(),
      ...getExamTips(),
      ...getMotivationalTips()
    ];

    // Weight the selection based on message type
    let filteredTips = tips;
    if (messageType === 'success') {
      filteredTips = [...getMotivationalTips(), ...getTopicSpecificTips(topic || '')];
    } else if (messageType === 'error') {
      filteredTips = [...getExamTips(), ...getGeneralTips()];
    }

    const randomTip = filteredTips[Math.floor(Math.random() * filteredTips.length)];
    setCurrentTip(randomTip);
    return randomTip;
  }, [topic, getTopicSpecificTips, getGeneralTips, getExamTips, getMotivationalTips]);

  return {
    currentTip,
    generateTip
  };
}