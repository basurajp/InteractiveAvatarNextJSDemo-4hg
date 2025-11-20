import { TaskMode, TaskType } from "@heygen/streaming-avatar";
import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";
import { useOpenAI } from "./useOpenAI";

export const useTextChat = () => {
  const { avatarRef } = useStreamingAvatarContext();
  const { generateResponse } = useOpenAI();

  const sendMessage = useCallback(
    async (message: string) => {
      if (!avatarRef.current) return;
      
      try {
        // Generate OpenAI response
        const aiResponse = await generateResponse(message);
        
        // Send AI response to avatar
        avatarRef.current.speak({
          text: aiResponse,
          taskType: TaskType.TALK,
          taskMode: TaskMode.ASYNC,
        });
      } catch (error) {
        console.error("Error generating response:", error);
        // Fallback: send original message if OpenAI fails
        avatarRef.current.speak({
          text: message,
          taskType: TaskType.TALK,
          taskMode: TaskMode.ASYNC,
        });
      }
    },
    [avatarRef, generateResponse],
  );

  const sendMessageSync = useCallback(
    async (message: string) => {
      if (!avatarRef.current) return;

      try {
        // Generate OpenAI response
        const aiResponse = await generateResponse(message);
        
        // Send AI response to avatar
        return await avatarRef.current?.speak({
          text: aiResponse,
          taskType: TaskType.TALK,
          taskMode: TaskMode.SYNC,
        });
      } catch (error) {
        console.error("Error generating response:", error);
        // Fallback: send original message if OpenAI fails
        return await avatarRef.current?.speak({
          text: message,
          taskType: TaskType.TALK,
          taskMode: TaskMode.SYNC,
        });
      }
    },
    [avatarRef, generateResponse],
  );

  const repeatMessage = useCallback(
    (message: string) => {
      if (!avatarRef.current) return;

      return avatarRef.current?.speak({
        text: message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.ASYNC,
      });
    },
    [avatarRef],
  );

  const repeatMessageSync = useCallback(
    async (message: string) => {
      if (!avatarRef.current) return;

      return await avatarRef.current?.speak({
        text: message,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
      });
    },
    [avatarRef],
  );

  return {
    sendMessage,
    sendMessageSync,
    repeatMessage,
    repeatMessageSync,
  };
};
