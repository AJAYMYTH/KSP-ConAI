import { useState } from 'react';
import type { ApiResponse, AssistantDataPayload } from '../types';
import { API_BASE_URL } from './api';
import { getCurrentSession } from './auth';

export function useAssistantApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryCopilot = async (
    text: string, 
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
    userRole?: string
  ): Promise<AssistantDataPayload | null> => {
    setLoading(true);
    setError(null);

    const session = getCurrentSession();
    const roleHeader = userRole || session?.role || 'investigator';

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/assistant/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': roleHeader,
          ...(session?.token ? { 'Authorization': `Bearer ${session.token}` } : {})
        },
        body: JSON.stringify({ 
          text,
          ...(conversationHistory && conversationHistory.length > 0 ? { conversationHistory } : {})
        })
      });

      const json: ApiResponse<AssistantDataPayload> = await response.json();

      if (!json.success || !json.data) {
        throw new Error(json.error?.message || 'Failed to fetch AI assistant response.');
      }

      return json.data;
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { queryCopilot, loading, error };
}
