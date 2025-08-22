# 🔌 WebSockets والاتصال في الوقت الفعلي

## نظرة عامة
تستخدم منصة Depth تقنية WebSockets لميزات الوقت الفعلي بما في ذلك التعاون المباشر والمراسلة الفورية والإشعارات.

## البنية المعمارية

### المكدس التقني
- **الخادم**: Socket.io مع محول Redis
- **العميل**: Socket.io client (ويب وموبايل)
- **التوسع**: Redis Pub/Sub للتوسع الأفقي
- **البروتوكول**: WebSocket مع احتياط long-polling

## إعداد الاتصال

### تكوين الخادم
```javascript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';

const pubClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const subClient = pubClient.duplicate();

export const initializeWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
    adapter: createAdapter(pubClient, subClient),
    pingTimeout: 60000,
    pingInterval: 25000,
  });
  
  // برمجية وسيطة للمصادقة
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await verifyToken(token);
      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (err) {
      next(new Error('فشلت المصادقة'));
    }
  });
  
  return io;
};
```

### اتصال العميل
```javascript
import io from 'socket.io-client';

const socket = io('wss://api.depth.so', {
  auth: {
    token: localStorage.getItem('authToken'),
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('متصل بالخادم');
});

socket.on('disconnect', (reason) => {
  console.log('انقطع الاتصال:', reason);
});

socket.on('error', (error) => {
  console.error('خطأ في Socket:', error);
});
```

## الأحداث والنطاقات

### هيكل النطاقات
```javascript
const namespaces = {
  '/': 'النطاق الافتراضي للأحداث العامة',
  '/chat': 'المراسلة في الوقت الفعلي',
  '/projects': 'التعاون في المشاريع',
  '/notifications': 'الإشعارات الفورية',
  '/admin': 'مراقبة وتحكم المسؤولين',
};
```

### أنواع الأحداث

#### أحداث المحادثة
```javascript
// الانضمام للمحادثة
socket.emit('chat:join', { conversationId });

// إرسال رسالة
socket.emit('chat:message', {
  conversationId,
  content,
  type: 'text|image|file',
  metadata: {},
});

// استقبال رسالة
socket.on('chat:message', (message) => {
  console.log('رسالة جديدة:', message);
});

// الكتابة
socket.emit('chat:typing', { conversationId, isTyping: true });

// حالة القراءة
socket.emit('chat:read', { conversationId, messageId });
```

#### أحداث المشاريع
```javascript
// الانضمام لغرفة المشروع
socket.emit('project:join', { projectId });

// تحديث حالة المشروع
socket.emit('project:statusUpdate', {
  projectId,
  status: 'in_progress',
  updatedBy: userId,
});

// تحديث التقدم
socket.emit('project:progress', {
  projectId,
  progress: 75,
  milestone: 'تصوير مكتمل',
});

// تعليق على المشروع
socket.emit('project:comment', {
  projectId,
  comment: 'عمل رائع!',
  attachments: [],
});
```

#### أحداث الإشعارات
```javascript
// الاشتراك في الإشعارات
socket.emit('notifications:subscribe', { userId });

// استقبال إشعار
socket.on('notification:new', (notification) => {
  showNotification(notification);
});

// وضع علامة كمقروء
socket.emit('notification:read', { notificationId });

// إلغاء الاشتراك
socket.emit('notifications:unsubscribe', { userId });
```

## إدارة الغرف

### إنشاء والانضمام للغرف
```javascript
// جانب الخادم
io.on('connection', (socket) => {
  // انضمام لغرفة خاصة بالمستخدم
  socket.join(`user:${socket.userId}`);
  
  // انضمام لغرف المشاريع
  socket.on('project:join', async ({ projectId }) => {
    // التحقق من الصلاحيات
    const hasAccess = await checkProjectAccess(socket.userId, projectId);
    if (hasAccess) {
      socket.join(`project:${projectId}`);
      socket.emit('project:joined', { projectId });
      
      // إشعار الآخرين
      socket.to(`project:${projectId}`).emit('user:joined', {
        userId: socket.userId,
        projectId,
      });
    }
  });
  
  // مغادرة الغرفة
  socket.on('project:leave', ({ projectId }) => {
    socket.leave(`project:${projectId}`);
    socket.to(`project:${projectId}`).emit('user:left', {
      userId: socket.userId,
    });
  });
});
```

### البث للغرف
```javascript
// بث لجميع أعضاء المشروع
io.to(`project:${projectId}`).emit('project:update', updateData);

// بث لمستخدم محدد
io.to(`user:${userId}`).emit('private:message', message);

// بث لعدة غرف
io.to('room1').to('room2').emit('announcement', data);

// بث للجميع ما عدا المرسل
socket.broadcast.to(`project:${projectId}`).emit('activity', activity);
```

## معالجة الأخطاء والاتصال

### إعادة الاتصال التلقائي
```javascript
// جانب العميل
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // الخادم فصل الاتصال، إعادة الاتصال يدوياً
    socket.connect();
  }
  // وإلا سيحاول إعادة الاتصال تلقائياً
});

socket.io.on('reconnect', (attemptNumber) => {
  console.log(`إعادة الاتصال نجحت بعد ${attemptNumber} محاولة`);
  // إعادة الاشتراك في الغرف
  rejoinRooms();
});

socket.io.on('reconnect_error', (error) => {
  console.error('خطأ في إعادة الاتصال:', error);
});
```

### معالجة الأخطاء
```javascript
// جانب الخادم
socket.on('error', (error) => {
  console.error('خطأ Socket:', error);
  
  // إرسال خطأ للعميل
  socket.emit('error', {
    code: 'SOCKET_ERROR',
    message: 'حدث خطأ في الاتصال',
    details: error.message,
  });
});

// التحقق من صحة البيانات
socket.use((packet, next) => {
  const [event, data] = packet;
  
  // التحقق من صحة البيانات
  if (!validateEventData(event, data)) {
    return next(new Error('بيانات غير صالحة'));
  }
  
  next();
});
```

## الأمان

### المصادقة بالرمز المميز
```javascript
// التحقق من الرمز المميز
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('الرمز المميز مطلوب'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return next(new Error('المستخدم غير موجود'));
    }
    
    socket.userId = user.id;
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error('رمز مميز غير صالح'));
  }
});
```

### تحديد المعدل
```javascript
const rateLimiter = new Map();

io.use((socket, next) => {
  const userId = socket.userId;
  const now = Date.now();
  const windowMs = 60000; // دقيقة واحدة
  const maxEvents = 100;
  
  if (!rateLimiter.has(userId)) {
    rateLimiter.set(userId, []);
  }
  
  const userEvents = rateLimiter.get(userId);
  const recentEvents = userEvents.filter(time => now - time < windowMs);
  
  if (recentEvents.length >= maxEvents) {
    return next(new Error('تجاوز حد المعدل'));
  }
  
  recentEvents.push(now);
  rateLimiter.set(userId, recentEvents);
  next();
});
```

## الأداء والتحسين

### ضغط البيانات
```javascript
const io = new Server(httpServer, {
  perMessageDeflate: {
    threshold: 1024, // ضغط الرسائل أكبر من 1KB
    zlibDeflateOptions: {
      level: 6,
    },
  },
});
```

### تجميع الأحداث
```javascript
class EventBatcher {
  constructor(socket, interval = 100) {
    this.socket = socket;
    this.queue = [];
    this.interval = interval;
    this.timer = null;
  }
  
  emit(event, data) {
    this.queue.push({ event, data });
    
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
      }, this.interval);
    }
  }
  
  flush() {
    if (this.queue.length > 0) {
      this.socket.emit('batch', this.queue);
      this.queue = [];
    }
    this.timer = null;
  }
}
```

## المراقبة والتحليل

### مقاييس الاتصال
```javascript
io.on('connection', (socket) => {
  // تسجيل الاتصال
  metrics.increment('websocket.connections');
  metrics.gauge('websocket.connected_clients', io.engine.clientsCount);
  
  socket.on('disconnect', () => {
    metrics.decrement('websocket.connections');
    metrics.gauge('websocket.connected_clients', io.engine.clientsCount);
  });
  
  // تتبع الأحداث
  socket.onAny((event) => {
    metrics.increment(`websocket.events.${event}`);
  });
});
```

### سجل الأحداث
```javascript
socket.use((packet, next) => {
  const [event, data] = packet;
  
  logger.info('WebSocket Event', {
    userId: socket.userId,
    event,
    timestamp: new Date().toISOString(),
    ip: socket.handshake.address,
  });
  
  next();
});
```

## أمثلة الاستخدام

### نظام محادثة كامل
```javascript
// العميل
class ChatClient {
  constructor() {
    this.socket = io('/chat');
    this.conversations = new Map();
    this.setupListeners();
  }
  
  setupListeners() {
    this.socket.on('message:new', (message) => {
      this.handleNewMessage(message);
    });
    
    this.socket.on('message:updated', (message) => {
      this.updateMessage(message);
    });
    
    this.socket.on('user:typing', ({ userId, conversationId }) => {
      this.showTypingIndicator(userId, conversationId);
    });
  }
  
  sendMessage(conversationId, content) {
    return new Promise((resolve, reject) => {
      this.socket.emit('message:send', {
        conversationId,
        content,
      }, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      });
    });
  }
  
  joinConversation(conversationId) {
    this.socket.emit('conversation:join', { conversationId });
  }
}
```

## الاختبار

### اختبار الاتصال
```javascript
// اختبار وحدة
describe('WebSocket Tests', () => {
  let clientSocket;
  let serverSocket;
  
  beforeAll((done) => {
    server.listen(() => {
      const port = server.address().port;
      clientSocket = io(`http://localhost:${port}`, {
        auth: { token: 'test-token' },
      });
      
      server.on('connection', (socket) => {
        serverSocket = socket;
      });
      
      clientSocket.on('connect', done);
    });
  });
  
  test('should receive message', (done) => {
    clientSocket.on('test', (data) => {
      expect(data).toBe('test message');
      done();
    });
    
    serverSocket.emit('test', 'test message');
  });
});
```

## الوثائق ذات الصلة
- [المصادقة](./01-authentication.md)
- [تحديد المعدل](./02-rate-limiting.md)
- [معالجة الأخطاء](./04-error-handling.md)
- [المراسلة](../features/07-messaging.md)
- [الإشعارات](../features/06-notifications.md)
