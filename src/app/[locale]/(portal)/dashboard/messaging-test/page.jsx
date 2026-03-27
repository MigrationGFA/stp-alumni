"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useConversations,
  useMessages,
  usePendingInvitations,
} from "@/lib/hooks/useMessagingQueries";
import useMessagingStore from "@/lib/store/useMessagingStore";

/**
 * Temporary test page for Phase 1 messaging infrastructure.
 * Visit /dashboard/messaging-test to use it.
 * DELETE THIS FILE before merging to main.
 */
export default function MessagingTestPage() {
  const [selectedConvId, setSelectedConvId] = useState(null);

  // 1. Test: Fetch all conversations
  const {
    data: conversations,
    isLoading: convsLoading,
    error: convsError,
    refetch: refetchConvs,
  } = useConversations();

  // 2. Test: Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: msgsLoading,
    error: msgsError,
  } = useMessages(selectedConvId);

  // 3. Test: Fetch pending invitations
  const {
    data: invitations,
    isLoading: invLoading,
    error: invError,
  } = usePendingInvitations();

  // 4. Test: Zustand store selectors
  const store = useMessagingStore();
  const directConvs = store.getDirectConversations();
  const publicGroups = store.getPublicGroupConversations();
  const privateGroups = store.getPrivateGroupConversations();

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#233389] mb-2">
          Phase 1 — Messaging API Test
        </h1>
        <p className="text-sm text-gray-500">
          This page tests the service layer, store, and query hooks. Check the
          browser console for full response shapes. Delete this file before
          merging.
        </p>
      </div>

      {/* ── Conversations ──────────────────────────────── */}
      <section className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">GET /messaging/conversations</h2>
          <Button size="sm" onClick={() => refetchConvs()}>
            Refetch
          </Button>
        </div>

        {convsLoading && <p className="text-gray-500">Loading conversations...</p>}
        {convsError && (
          <p className="text-red-600">
            Error: {convsError.response?.status} —{" "}
            {convsError.response?.data?.message || convsError.message}
          </p>
        )}

        {conversations && (
          <>
            <p className="text-sm text-gray-600">
              Total: {conversations.length} | Direct: {directConvs.length} |
              Public Groups: {publicGroups.length} | Private Groups (Deal
              Rooms): {privateGroups.length}
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {conversations.map((conv, i) => (
                <button
                  key={conv.conversationId || conv.id || i}
                  onClick={() => {
                    const id = conv.conversationId || conv.id;
                    setSelectedConvId(id);
                    console.log("Selected conversation:", conv);
                  }}
                  className={`w-full text-left p-3 rounded border text-sm ${
                    selectedConvId === (conv.conversationId || conv.id)
                      ? "border-[#233389] bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{conv.name || conv.title || "Unnamed"}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    [{conv.type || "unknown"}]
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    ID: {conv.conversationId || conv.id}
                  </span>
                </button>
              ))}
              {conversations.length === 0 && (
                <p className="text-gray-400 text-sm">No conversations returned.</p>
              )}
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500">
                Raw JSON response
              </summary>
              <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(conversations, null, 2)}
              </pre>
            </details>
          </>
        )}
      </section>

      {/* ── Messages ───────────────────────────────────── */}
      <section className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          GET /messaging/conversations/:id/messages
        </h2>

        {!selectedConvId && (
          <p className="text-gray-400 text-sm">
            Click a conversation above to load its messages.
          </p>
        )}

        {selectedConvId && msgsLoading && (
          <p className="text-gray-500">Loading messages...</p>
        )}
        {selectedConvId && msgsError && (
          <p className="text-red-600">
            Error: {msgsError.response?.status} —{" "}
            {msgsError.response?.data?.message || msgsError.message}
          </p>
        )}

        {selectedConvId && messagesData && (
          <>
            <p className="text-sm text-gray-600">
              Conversation: {selectedConvId} | Messages:{" "}
              {messagesData?.meta?.total ?? messagesData?.data?.length ?? "?"}
            </p>
            <details className="text-xs" open>
              <summary className="cursor-pointer text-gray-500">
                Raw JSON response
              </summary>
              <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-60">
                {JSON.stringify(messagesData, null, 2)}
              </pre>
            </details>
          </>
        )}
      </section>

      {/* ── Invitations ────────────────────────────────── */}
      <section className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          GET /messaging/direct/invitations
        </h2>

        {invLoading && <p className="text-gray-500">Loading invitations...</p>}
        {invError && (
          <p className="text-red-600">
            Error: {invError.response?.status} —{" "}
            {invError.response?.data?.message || invError.message}
          </p>
        )}

        {invitations && (
          <>
            <p className="text-sm text-gray-600">
              Pending invitations: {invitations.length}
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500">
                Raw JSON response
              </summary>
              <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(invitations, null, 2)}
              </pre>
            </details>
          </>
        )}
      </section>

      {/* ── Store State ────────────────────────────────── */}
      <section className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Zustand Store State</h2>
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500">
            Full store snapshot
          </summary>
          <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-60">
            {JSON.stringify(
              {
                conversationsCount: store.conversations.length,
                activeConversationId: store.activeConversationId,
                messagesKeys: Object.keys(store.messages),
                invitationsCount: store.invitations.length,
                directCount: directConvs.length,
                publicGroupCount: publicGroups.length,
                privateGroupCount: privateGroups.length,
              },
              null,
              2
            )}
          </pre>
        </details>
      </section>
    </div>
  );
}
