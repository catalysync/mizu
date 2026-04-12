'use client';

import { useCallback, useRef, useState } from 'react';
import type { ChatMessage } from '@/components/craft/chat-dock';
import { useCraftStore } from '@/store/craft-store';
import type { DesignLanguageProfile } from '@/lib/craft/profile';
import type { Entity, Page, NavItem, EntityField } from '@/lib/craft/app-schema';
import { getPackForDomain } from '@/lib/craft/packs';

type ClusterKey =
  | 'foundation'
  | 'shape'
  | 'density'
  | 'type'
  | 'motion'
  | 'depth'
  | 'focus'
  | 'iconography'
  | 'voice'
  | 'opinions';

function applyToolCall(
  name: string,
  args: Record<string, unknown>,
  profile: DesignLanguageProfile,
): Partial<DesignLanguageProfile> | null {
  const clusterTools: Record<string, ClusterKey> = {
    set_foundation: 'foundation',
    set_shape: 'shape',
    set_density: 'density',
    set_type: 'type',
    set_motion: 'motion',
    set_depth: 'depth',
    set_focus: 'focus',
    set_iconography: 'iconography',
    set_voice: 'voice',
    set_opinions: 'opinions',
  };

  if (name in clusterTools) {
    const key = clusterTools[name];
    return { [key]: { ...profile[key], ...args } };
  }

  if (name === 'update_identity') {
    const newIdentity = { ...profile.app.identity, ...args };
    const domainChanged = args.domain && args.domain !== profile.app.identity.domain;
    const pack = domainChanged ? getPackForDomain(args.domain as string) : undefined;

    return {
      app: {
        ...profile.app,
        identity: newIdentity,
        ...(pack
          ? {
              entities: pack.entities,
              pages: pack.defaultPages,
              shell: { ...profile.app.shell, nav: pack.defaultNav },
            }
          : {}),
      },
    };
  }

  if (name === 'add_page') {
    const page: Page = {
      id: args.id as string,
      path: args.path as string,
      title: args.title as string,
      icon: args.icon as string | undefined,
      composition: {
        header: args.headerTitle
          ? {
              title: args.headerTitle as string,
              description: args.headerDescription as string | undefined,
              actions:
                (args.headerActions as Page['composition']['header'] extends { actions: infer A }
                  ? A
                  : never) ?? [],
            }
          : undefined,
        sections: (args.sections as Page['composition']['sections']) ?? [],
      },
    };
    const navSection = (args.navSection as string) ?? 'primary';
    const nav: NavItem[] = [...profile.app.shell.nav, { pageId: page.id, section: navSection }];
    return {
      app: {
        ...profile.app,
        pages: [...profile.app.pages, page],
        shell: { ...profile.app.shell, nav },
      },
    };
  }

  if (name === 'remove_page') {
    const id = args.id as string;
    return {
      app: {
        ...profile.app,
        pages: profile.app.pages.filter((p) => p.id !== id),
        shell: {
          ...profile.app.shell,
          nav: profile.app.shell.nav.filter((n) => n.pageId !== id),
        },
      },
    };
  }

  if (name === 'reorder_nav') {
    const order = args.order as string[];
    const existing = profile.app.shell.nav;
    const reordered: NavItem[] = order
      .map((id) => existing.find((n) => n.pageId === id))
      .filter((n): n is NavItem => !!n);
    const remaining = existing.filter((n) => !order.includes(n.pageId));
    return {
      app: {
        ...profile.app,
        shell: { ...profile.app.shell, nav: [...reordered, ...remaining] },
      },
    };
  }

  if (name === 'define_entity') {
    const entity: Entity = {
      id: args.id as string,
      name: args.name as string,
      plural: args.plural as string,
      fields: (args.fields as EntityField[]) ?? [],
    };
    const entities = profile.app.entities.filter((e) => e.id !== entity.id);
    return {
      app: { ...profile.app, entities: [...entities, entity] },
    };
  }

  if (name === 'add_table_column') {
    const entityId = args.entityId as string;
    const field = args.field as EntityField;
    const entities = profile.app.entities.map((e) =>
      e.id === entityId ? { ...e, fields: [...e.fields, field] } : e,
    );
    return { app: { ...profile.app, entities } };
  }

  return null;
}

let msgId = 0;

export function useCraftChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${++msgId}`,
        role: 'user',
        content: text,
      };
      const aiMsg: ChatMessage = {
        id: `msg-${++msgId}`,
        role: 'assistant',
        content: '',
        toolCalls: [],
        pending: true,
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setStreaming(true);

      const profile = useCraftStore.getState().profile;
      const allMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/craft/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: allMessages, profile }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errText = await res.text();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsg.id ? { ...m, content: `Error: ${errText}`, pending: false } : m,
            ),
          );
          setStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let textBuffer = '';
        const toolCalls: ChatMessage['toolCalls'] = [];
        let currentToolName = '';
        let currentToolInput = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const event = JSON.parse(data);

              if (event.type === 'content_block_start') {
                if (event.content_block?.type === 'tool_use') {
                  currentToolName = event.content_block.name ?? '';
                  currentToolInput = '';
                }
              }

              if (event.type === 'content_block_delta') {
                if (event.delta?.type === 'text_delta') {
                  textBuffer += event.delta.text ?? '';
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsg.id ? { ...m, content: textBuffer, pending: true } : m,
                    ),
                  );
                }
                if (event.delta?.type === 'input_json_delta') {
                  currentToolInput += event.delta.partial_json ?? '';
                }
              }

              if (event.type === 'content_block_stop' && currentToolName) {
                try {
                  const args = JSON.parse(currentToolInput || '{}');
                  const patch = applyToolCall(
                    currentToolName,
                    args,
                    useCraftStore.getState().profile,
                  );
                  if (patch) {
                    const prev = useCraftStore.getState().profile;
                    useCraftStore.setState({
                      profile: { ...prev, ...patch } as DesignLanguageProfile,
                      history: [...useCraftStore.getState().history, prev],
                      future: [],
                    });
                  }
                  toolCalls.push({
                    name: currentToolName,
                    rationale: `Applied ${currentToolName}`,
                  });
                } catch {
                  toolCalls.push({
                    name: currentToolName,
                    rationale: 'Failed to parse tool input',
                  });
                }
                currentToolName = '';
                currentToolInput = '';

                setMessages((prev) =>
                  prev.map((m) => (m.id === aiMsg.id ? { ...m, toolCalls: [...toolCalls] } : m)),
                );
              }

              if (event.type === 'message_stop') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsg.id
                      ? {
                          ...m,
                          content: textBuffer || 'Done.',
                          toolCalls: [...toolCalls],
                          pending: false,
                        }
                      : m,
                  ),
                );
              }
            } catch {
              // skip unparseable lines
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsg.id
                ? {
                    ...m,
                    content: `Error: ${(err as Error).message}`,
                    pending: false,
                  }
                : m,
            ),
          );
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages],
  );

  return { messages, streaming, send };
}
