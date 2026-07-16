import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [
      {
        id: 'conv_1',
        user: {
          name: 'Sarah Chen',
          handle: 'sarah_c',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah'
        },
        lastMessage: 'Let\'s check out the new design prototypes tomorrow!',
        timestamp: '10:42 AM',
        unread: true
      },
      {
        id: 'conv_2',
        user: {
          name: 'Alex Martinez',
          handle: 'alex_m',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex'
        },
        lastMessage: 'Awesome! It is working perfectly.',
        timestamp: 'Yesterday',
        unread: false
      },
      {
        id: 'conv_3',
        user: {
          name: 'Elena Rostova',
          handle: 'elena_r',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=elena'
        },
        lastMessage: 'Are we still meeting at 3 PM?',
        timestamp: '2 days ago',
        unread: false
      }
    ],
    messagesByConversation: {
      'conv_1': [
        { id: 1, senderId: 'conv_1', text: 'Hey Kenji! Did you review the Firebase auth schemas?', timestamp: '10:30 AM' },
        { id: 2, senderId: 'usr_1', text: 'Hey Sarah! Yes, they look very clean. We can implement offline persistence easily.', timestamp: '10:35 AM' },
        { id: 3, senderId: 'conv_1', text: 'Perfect. Let\'s check out the new design prototypes tomorrow!', timestamp: '10:42 AM' }
      ],
      'conv_2': [
        { id: 1, senderId: 'conv_2', text: 'How is the new Vite setup going?', timestamp: 'Yesterday' },
        { id: 2, senderId: 'usr_1', text: 'Just scaffolded it. Extremely fast compared to standard Webpack.', timestamp: 'Yesterday' },
        { id: 3, senderId: 'conv_2', text: 'Awesome! It is working perfectly.', timestamp: 'Yesterday' }
      ],
      'conv_3': [
        { id: 1, senderId: 'conv_3', text: 'Hey there!', timestamp: '2 days ago' },
        { id: 2, senderId: 'conv_3', text: 'Are we still meeting at 3 PM?', timestamp: '2 days ago' }
      ]
    },
    activeConversationId: 'conv_1'
  }),
  
  getters: {
    activeConversation(state) {
      return state.conversations.find(c => c.id === state.activeConversationId) || null
    },
    activeMessages(state) {
      return state.messagesByConversation[state.activeConversationId] || []
    }
  },
  
  actions: {
    setActiveConversation(id) {
      this.activeConversationId = id
      const conv = this.conversations.find(c => c.id === id)
      if (conv) {
        conv.unread = false
      }
    },
    
    sendMessage(text) {
      if (!text.trim() || !this.activeConversationId) return
      
      const newMessage = {
        id: Date.now(),
        senderId: 'usr_1',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      
      // Add message to active thread
      if (!this.messagesByConversation[this.activeConversationId]) {
        this.messagesByConversation[this.activeConversationId] = []
      }
      this.messagesByConversation[this.activeConversationId].push(newMessage)
      
      // Update last message in thread
      const conv = this.conversations.find(c => c.id === this.activeConversationId)
      if (conv) {
        conv.lastMessage = text
        conv.timestamp = 'Just now'
      }
      
      // Simulate reply from active user after a short delay
      this.simulateReply(this.activeConversationId)
    },
    
    simulateReply(convId) {
      setTimeout(() => {
        const conv = this.conversations.find(c => c.id === convId)
        if (!conv) return
        
        const replies = [
          "That sounds like a great idea!",
          "I will look into that shortly.",
          "Wow, that's awesome!",
          "Let me check and get back to you.",
          "Could you share a link or screenshot?",
          "Indeed! Let's build it out."
        ]
        const randomReply = replies[Math.floor(Math.random() * replies.length)]
        
        const replyMessage = {
          id: Date.now() + 1,
          senderId: convId,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        
        this.messagesByConversation[convId].push(replyMessage)
        conv.lastMessage = randomReply
        conv.timestamp = 'Just now'
        
        if (this.activeConversationId !== convId) {
          conv.unread = true
        }
      }, 2000)
    }
  }
})
