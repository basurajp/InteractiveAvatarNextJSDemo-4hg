import { useCallback, useState } from "react";
import { useStreamingAvatarContext } from "./context";
import { Message } from "./context";

export const useOpenAI = () => {
  const { messages } = useStreamingAvatarContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = useCallback(
    async (userMessage: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        // Format conversation history for API
        const conversationHistory = messages.map((msg: Message) => ({
          sender: msg.sender,
          content: msg.content,
        }));

        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate response");
        }

        const data = await response.json();
        return data.response || "";
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate response";
        setError(errorMessage);
        console.error("OpenAI API error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  return {
    generateResponse,
    isLoading,
    error,
  };
};

