class NormalUserWebSocketService {
    constructor() {
        this.socket = null;
    }

    connect(roomName) {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        this.socket = new WebSocket(`${wsProtocol}${window.location.host}/ws/webrtc/${roomName}/`);
        return new Promise((resolve, reject) => {
            this.socket.onopen = () => {
                console.log('WebSocket connected');
                resolve();
            };
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };
        });
    }

    listen(callback) {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            callback(message);
        };
    }

    send(message) {
        this.socket.send(JSON.stringify(message));
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default new NormalUserWebSocketService();