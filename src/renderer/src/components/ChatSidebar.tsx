export default function ChatSidebar({ chats, activeChat, onSelect, onNewChat, onDelete }) {
    return (
      <div style={{ width: 250, borderRight: '1px solid #ddd', padding: 10 }}>
        <button onClick={onNewChat} style={{ width: '100%', marginBottom: 10 }}>➕ New Chat</button>
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            style={{
              padding: 8,
              borderRadius: 6,
              background: activeChat?.id === c.id ? '#007bff' : 'transparent',
              color: activeChat?.id === c.id ? 'white' : 'black',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{c.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeChat?.id === c.id ? 'white' : '#999',
                cursor: 'pointer',
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    );
  }
  