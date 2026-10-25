export function messageText(content) {
  if (typeof content === "string" || typeof content === "number")
    return String(content);
  if (Array.isArray(content))
    return content.map(messageText).filter(Boolean).join(" ");
  if (content?.props?.children) return messageText(content.props.children);
  return "";
}

// A turn begins with a user message; forms and report messages remain in that turn.
export function conversationTurns(messages) {
  const turns = [];
  for (const message of messages) {
    if (message.role === "user") {
      turns.push({
        key: String(message.key),
        question: messageText(message.content).trim() || "用户消息",
        reply: "",
      });
    } else if (message.role === "assistant" && turns.length) {
      const turn = turns.at(-1);
      const text = messageText(message.content).trim() || "表单或报告内容";
      turn.reply = [turn.reply, text].filter(Boolean).join("\n");
    }
  }
  return turns;
}

export function indexDotScale(distance) {
  return [2.5, 2, 1.5, 1.25][distance] || 1;
}

export function activeConversationTurn(tops, viewportTop, atBottom = false) {
  if (atBottom) return Math.max(0, tops.length - 1);
  let active = 0;
  for (let index = 0; index < tops.length; index += 1) {
    if (tops[index] <= viewportTop + 32) active = index;
  }
  return active;
}
