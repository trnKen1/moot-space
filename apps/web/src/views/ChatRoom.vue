<template>
  <div class="chat-layout ms-surface ms-chat" :data-finish="ui.finishFor('matte')">
    <!-- Thread list -->
    <aside class="ms-threads" aria-label="Conversations">
      <header class="ms-threads__head">
        <h1>Messages</h1>
      </header>
      <ul class="threads-list">
        <li v-for="conv in conversations" :key="conv.id">
          <button
            type="button"
            :class="['ms-thread', { unread: conv.unread }]"
            :aria-current="activeConversationId === conv.id ? 'true' : undefined"
            @click="setActiveConversation(conv.id)"
          >
            <Avatar :src="conv.user.avatar" :name="conv.user.name" :size="40" />
            <span class="ms-thread__meta">
              <span class="ms-thread__top">
                <span class="ms-thread__name">{{ conv.user.name }}</span>
                <span class="ms-count">{{ conv.timestamp }}</span>
              </span>
              <span class="ms-thread__preview">{{ conv.lastMessage }}</span>
            </span>
            <span v-if="conv.unread" class="ms-dot"><span class="sr-only">Unread</span></span>
          </button>
        </li>
      </ul>
    </aside>

    <!-- Open conversation -->
    <section v-if="activeConversation" class="ms-chat__main" aria-label="Conversation">
      <header class="ms-chat__head">
        <Avatar :src="activeConversation.user.avatar" :name="activeConversation.user.name" :size="40" ring />
        <div>
          <h2 class="chat-name">{{ activeConversation.user.name }}</h2>
          <span class="ms-chat__status">Online</span>
        </div>
      </header>

      <div ref="messagesContainer" class="ms-chat__log" role="log" aria-live="polite">
        <div
          v-for="msg in activeMessages"
          :key="msg.id"
          :class="['ms-bubble', msg.senderId === 'usr_1' ? 'ms-bubble--sent ms-lit' : 'ms-bubble--received']"
        >
          {{ msg.text }}
          <small>{{ msg.timestamp }}</small>
        </div>
      </div>

      <form class="ms-chat__bar" @submit.prevent="handleSend">
        <label for="message-input" class="sr-only">Message</label>
        <input
          id="message-input"
          v-model="typedMessage"
          class="ms-input"
          type="text"
          placeholder="Write a message…"
          required
          autocomplete="off"
        />
        <button type="submit" class="ms-btn ms-btn--primary ms-lit ms-btn--icon" aria-label="Send">
          <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </section>

    <div v-else class="chat-empty">
      <EmptyState title="No conversation selected" text="Pick a thread to start chatting." />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '../store/chat'
import { useUiStore } from '../store/ui'
import Avatar from '../components/common/Avatar.vue'
import EmptyState from '../components/common/EmptyState.vue'

const chatStore = useChatStore()
const ui = useUiStore()
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

</script>

<style scoped>
.chat-layout {
  height: calc(100vh - 5rem);
  max-width: 1000px;
  margin: 0 auto;
}

.threads-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-bottom: var(--space-3);
  overflow-y: auto;
}

.ms-thread.unread .ms-thread__name {
  font-weight: 700;
}

.chat-name {
  font: 600 18px/26px var(--font-sans);
}

/* The log scrolls; header and send bar stay put. */
.ms-chat__main {
  min-height: 0;
}

.ms-chat__log {
  min-height: 0;
  overflow-y: auto;
}

.chat-empty {
  display: grid;
  place-items: center;
  padding: var(--space-6);
}

/* Small screens: thread list above the conversation */
@media (max-width: 768px) {
  .chat-layout {
    grid-template-columns: minmax(0, 1fr);
    height: auto;
  }
  .ms-threads {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .ms-chat__main {
    height: 70vh;
  }
}
</style>
