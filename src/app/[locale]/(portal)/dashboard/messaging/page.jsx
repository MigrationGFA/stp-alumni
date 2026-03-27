"use client";
import { cn } from "@/lib/utils";
import { ChatView } from "./ChatView";
import { ConversationList } from "./ConversationList";
import { useMessaging } from "./useMessaging";

const Messaging = () => {
  const {
    conversations,
    selectedConversation,
    currentMessages,
    searchQuery,
    sortBy,
    isLoading,
    isMessagesLoading,
    invitations,
    setSearchQuery,
    setSortBy,
    selectConversation,
    sendMessage,
    sendMediaFile,
    retryMessage,
    deleteMessage,
    acceptInvitation,
    declineInvitation,
  } = useMessaging();

  const handleBack = () => {
    selectConversation(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] flex bg-background">
      {/* Conversation List - hidden on mobile when chat is open */}
      <div
        className={cn(
          "w-full lg:w-100 border-r border-border shrink-0",
          selectedConversation ? "hidden lg:flex" : "flex"
        )}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          searchQuery={searchQuery}
          sortBy={sortBy}
          isLoading={isLoading}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onSelect={(conv) => selectConversation(conv.id)}
          invitations={invitations}
          onAcceptInvitation={acceptInvitation}
          onDeclineInvitation={declineInvitation}
        />
      </div>

      {/* Chat View - full width on mobile */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !selectedConversation ? "hidden lg:flex" : "flex"
        )}
      >
        {selectedConversation ? (
          <ChatView
            conversation={selectedConversation}
            messages={currentMessages}
            isLoading={isMessagesLoading}
            onBack={handleBack}
            onSendMessage={sendMessage}
            onSendMediaFile={sendMediaFile}
            onRetryMessage={retryMessage}
            onDeleteMessage={deleteMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
