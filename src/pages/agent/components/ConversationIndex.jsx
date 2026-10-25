import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from "antd";
import {
  activeConversationTurn,
  conversationTurns,
  indexDotScale,
} from "./conversationTurns.js";
import "./conversation-index.css";

export function ConversationIndex({ messages, scrollRef }) {
  const turns = useMemo(() => conversationTurns(messages), [messages]);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(null);
  const railRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !turns.length) return;
    let frame;
    const update = () => {
      const nodes = Array.from(
        container.querySelectorAll("[data-conversation-key]"),
      );
      const tops = turns.map(
        (turn) =>
          nodes
            .find((node) => node.dataset.conversationKey === turn.key)
            ?.getBoundingClientRect().top ?? Infinity,
      );
      const atBottom =
        container.scrollHeight > container.clientHeight + 2 &&
        container.scrollHeight - container.clientHeight - container.scrollTop <
          3;
      setActive(
        activeConversationTurn(
          tops,
          container.getBoundingClientRect().top,
          atBottom,
        ),
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(container);
    const messageList = container.querySelector(".ant-bubble-list");
    if (messageList) resize.observe(messageList);
    container.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      container.removeEventListener("scroll", schedule, true);
    };
  }, [turns, scrollRef]);

  useEffect(() => {
    const rail = railRef.current;
    const button = rail?.children[active];
    if (!button) return;
    if (
      button.offsetTop < rail.scrollTop ||
      button.offsetTop + button.offsetHeight >
        rail.scrollTop + rail.clientHeight
    ) {
      rail.scrollTop =
        button.offsetTop - rail.clientHeight / 2 + button.offsetHeight / 2;
    }
  }, [active]);

  if (!turns.length) return null;
  const center = preview ?? active;
  function jump(turn, index) {
    const container = scrollRef.current;
    const node = Array.from(
      container.querySelectorAll("[data-conversation-key]"),
    ).find((node) => node.dataset.conversationKey === turn.key);
    if (!node) return;
    setPreview(null);
    setActive(index);
    container.scrollTo({
      top:
        container.scrollTop +
        node.getBoundingClientRect().top -
        container.getBoundingClientRect().top -
        16,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <nav className="conversation-index" aria-label="长会话导航">
      <div className="conversation-index-rail" ref={railRef}>
        {turns.map((turn, index) => (
          <Tooltip
            key={turn.key}
            color="#fff"
            placement="right"
            trigger={["hover", "focus"]}
            mouseEnterDelay={0.15}
            open={preview === index}
            onOpenChange={(open) => setPreview(open ? index : null)}
            classNames={{ root: "conversation-index-tooltip" }}
            title={
              <div className="conversation-index-preview">
                <strong>{turn.question}</strong>
                <p>{turn.reply || "等待回复…"}</p>
              </div>
            }
          >
            <button
              type="button"
              aria-label={`跳转到第 ${index + 1} 轮对话：${turn.question}`}
              aria-current={active === index ? "location" : undefined}
              onClick={() => jump(turn, index)}
            >
              <span
                style={{
                  transform: `scale(${indexDotScale(Math.abs(index - center))})`,
                }}
              />
            </button>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
}
