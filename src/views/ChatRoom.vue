<template>
  <div class="chat-layout glass">
    <!-- Sidebar thread list -->
    <aside class="chat-sidebar">
      <header class="sidebar-header">
        <h2>Messages</h2>
      </header>
      <div class="threads-list">
        <div 
          v-for="conv in conversations" 
          :key="conv.id"
          :class="['thread-item', { active: activeConversationId === conv.id, unread: conv.unread }]"
          @click="setActiveConversation(conv.id)"
        >
          <Avatar :src="conv.user.avatar" :name="conv.user.name" :size="40" />
          <div class="thread-meta">
            <div class="thread-user-row">
              <span class="user-name">{{ conv.user.name }}</span>
              <span class="timestamp">{{ conv.timestamp }}</span>
            </div>
            <p class="last-msg">{{ conv.lastMessage }}</p>
          </div>
          <span v-if="conv.unread" class="unread-dot"></span>
        </div>
      </div>
    </aside>

    <!-- Main Message Box -->
    <main class="chat-main" v-if="activeConversation">
      <!-- Active Header -->
      <header class="chat-header">
        <div class="active-user-info">
          <Avatar :src="activeConversation.user.avatar" :name="activeConversation.user.name" :size="40" />
          <div>
            <h3>{{ activeConversation.user.name }}</h3>
            <span class="status">Online</span>
          </div>
        </div>
      </header>

      <!-- Message History -->
      <div class="messages-container" ref="messagesContainer">
        <div 
          v-for="msg in activeMessages" 
          :key="msg.id"
          :class="['message-bubble', msg.senderId === 'usr_1' ? 'sent' : 'received']"
        >
          <div class="msg-text">{{ msg.text }}</div>
          <div class="msg-time">{{ msg.timestamp }}</div>
        </div>
      </div>

      <!-- Input Message Bar -->
      <footer class="chat-footer">
        <form @submit.prevent="handleSend" class="message-form">
          <input 
            type="text" 
            v-model="typedMessage" 
            placeholder="Type your message..." 
            required
            autocomplete="off"
          />
          <button type="submit" class="send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="send-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </footer>
    </main>

    <!-- Empty State -->
    <main class="chat-empty" v-else>
      <div class="empty-content">
        <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3>No Conversation Selected</h3>
        <p>Select a message thread on the left pane to start chatting.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '../store/chat'
import Avatar from '../components/common/Avatar.vue'

export default {
  name: 'ChatRoom',
  components: {
    Avatar
  },
  setup() {
    const chatStore = useChatStore()
    const typedMessage = ref('')
    const messagesContainer = ref(null)

    const conversations = computed(() => chatStore.conversations)
    const activeConversationId = computed(() => chatStore.activeConversationId)
    const activeConversation = computed(() => chatStore.activeConversation)
    const activeMessages = computed(() => chatStore.activeMessages)

    const setActiveConversation = (id) => {
      chatStore.setActiveConversation(id)
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    const handleSend = () => {
      if (!typedMessage.value.trim()) return
      chatStore.sendMessage(typedMessage.value)
      typedMessage.value = ''
      scrollToBottom()
    }

    // Scroll to bottom when conversation or message length changes
    watch(() => activeConversationId.value, () => {
      scrollToBottom()
    })

    watch(() => activeMessages.value.length, () => {
      scrollToBottom()
    })

    onMounted(() => {
      scrollToBottom()
    })

    return {
      conversations,
      activeConversationId,
      activeConversation,
      activeMessages,
      typedMessage,
      messagesContainer,
      setActiveConversation,
      handleSend
    }
  }
}
</script>

<style scoped>
.chat-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: calc(100vh - 5rem);
  max-width: 1000px;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

@media (max-width: 768px) {
  .chat-layout {
    grid-template-columns: 1fr;
  }
  .chat-sidebar {
    display: block;
  }
  .chat-sidebar.inactive {
    display: none;
  }
  .chat-main {
    display: flex;
  }
}

/* Sidebar threads styles */
.chat-sidebar {
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.01);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
}

.threads-list {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.thread-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  position: relative;
}

.thread-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.thread-item.active {
  background: rgba(139, 92, 246, 0.08);
}

.thread-meta {
  flex-grow: 1;
  overflow: hidden;
}

.thread-user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.thread-user-row .user-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.thread-user-row .timestamp {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.last-msg {
  font-size: 0.82rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thread-item.unread .last-msg {
  font-weight: 600;
  color: var(--text-primary);
}

.unread-dot {
  position: absolute;
  right: 1.5rem;
  bottom: 1.25rem;
  width: 7px;
  height: 7px;
  background-color: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--primary-glow);
}

/* Chat window styles */
.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.01);
}

.active-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.active-user-info h3 {
  font-size: 1.05rem;
  font-weight: 600;
}

.active-user-info .status {
  font-size: 0.78rem;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.active-user-info .status::before {
  content: '';
  width: 6px;
  height: 6px;
  background-color: var(--secondary);
  border-radius: 50%;
  display: inline-block;
}

.messages-container {
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  background: rgba(0, 0, 0, 0.1);
}

.message-bubble {
  max-width: 65%;
  display: flex;
  flex-direction: column;
}

.message-bubble.sent {
  align-self: flex-end;
}

.message-bubble.received {
  align-self: flex-start;
}

.msg-text {
  padding: 0.8rem 1.1rem;
  border-radius: var(--radius-md);
  font-size: 0.98rem;
  line-height: 1.45;
}

.sent .msg-text {
  background: var(--primary);
  color: white;
  border-bottom-right-radius: 2px;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.received .msg-text {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-bottom-left-radius: 2px;
}

.msg-time {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  padding: 0 0.2rem;
}

.sent .msg-time {
  text-align: right;
}

.chat-footer {
  padding: 1.1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.01);
}

.message-form {
  display: flex;
  gap: 0.75rem;
}

.message-form input {
  flex-grow: 1;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

.message-form input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
}

.send-btn {
  background: var(--primary);
  border: none;
  padding: 0 1.2rem;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.send-btn:hover {
  background: var(--primary-hover);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
  transform: translateY(-1px);
}

.send-icon {
  width: 18px;
  height: 18px;
}

/* Empty State Styles */
.chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 320px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
}

.empty-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-content p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.45;
}
</style>
