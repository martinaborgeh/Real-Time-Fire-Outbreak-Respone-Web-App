import React, { useRef,useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';

import VideoComponent from './VideoComponent';
import AdminUserWebSocketService from './adminuserwebsocketservice';

export function AdminCallView() {
    const [localStream, setLocalStream] = useState(null);
    const socketRef = useRef();
    const serverbaseurl = "http://localhost:8000";

    const navigate =  useNavigate ()

    useEffect(() => {
        fetch(serverbaseurl + "/accounts/check-if-user-is-authenticated/", {
          method: 'GET',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response_data => {
            if (!response_data.ok) {
              if (response_data.status === 401) {
                console.log("Not Authorized, Enter V");
              } else if (response_data.status === 400) {
                console.log("Something Bad Happened, We would resolve it soon");
                navigate("/error-message");
              }
            } else {
              return response_data.json();
            }
          })
          .catch(error => {
            console.error('Authorization Error:', error.message);
          });
      }, [navigate]);; // Empty dependency array ensures this effect runs only once on mount

      const handleReceiveCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // Create WebSocket connection
        const roomName= "Caller ID"
        await AdminUserWebSocketService.connect(roomName);
        socketRef.current = AdminUserWebSocketService;
        socketRef.current.listen(handleSocketMessage);

        // Handle incoming offer and send answer
        socketRef.current.listen((message) => {
            const { type, offer } = message;
            if (type === 'offer') {
                handleReceiveOffer(offer);
            }
        });
    };

    const handleReceiveOffer = async (offer) => {
        // Create PeerConnection and handle offer
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        pc.addStream(localStream);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.send({
                    type: 'candidate',
                    candidate: event.candidate,
                });
            }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketRef.current.send({
            type: 'answer',
            answer: answer,
        });
    };

    const handleSocketMessage = (message) => {
        const { type, offer, candidate } = message;

        switch (type) {
            case 'offer':
                handleReceiveOffer(offer);
                break;
            case 'candidate':
                handleReceiveCandidate(candidate);
                break;
            default:
                break;
        }
    };

    const handleReceiveCandidate = (candidate) => {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        pc.addStream(localStream);

        pc.addIceCandidate(new RTCIceCandidate(candidate));
    };

    return (
        <div>
            <div>
                <VideoComponent stream={localStream} isMuted={true} />
            </div>
            <div>
                <button onClick={handleReceiveCall}>Receive Call</button>
            </div>
        </div>
    );
}